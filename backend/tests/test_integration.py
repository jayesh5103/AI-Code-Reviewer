import pytest
import sys
import os
import subprocess
from unittest.mock import patch

# Add parent directory to path so main can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from main import app, _ai_client
import main
from groq import Groq

# Create test client for testing endpoints
client = TestClient(app)

# ---------------------------------------------------------------------------
# Integration Tests
# ---------------------------------------------------------------------------

def test_integration_ai_success():
    """
    Submit a valid python snippet, hit the real Groq API, and check that the 
    response format matches our ReviewResponse schema (source: "ai" with issues list).
    """
    payload = {
        "code": "def divide(a: int, b: int) -> float:\n    if b == 0:\n        raise ValueError('Division by zero')\n    return a / b\n",
        "language": "python"
    }
    response = client.post("/api/review", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["source"] == "ai"
    assert "issues" in data
    assert isinstance(data["issues"], list)
    # Check that it compiles with schema issues (e.g. they should have severity, title, explanation)
    for issue in data["issues"]:
        assert issue["severity"] in ("bug", "style")
        assert "title" in issue
        assert "explanation" in issue

def test_integration_fallback_on_api_error():
    """
    Force a real API key error on Groq API call, verify that it falls back to 
    Pylint static analysis, and verify using mock.patch (wraps=subprocess.run) 
    that the real pylint subprocess was actually invoked.
    """
    payload = {
        "code": "def calc(a, b):\n    return a + b\n",
        "language": "python"
    }
    
    # Save the original Groq client
    original_client = main._ai_client
    
    # Setup temporary invalid client and spy on subprocess.run (but let it run end-to-end)
    with patch("subprocess.run", wraps=subprocess.run) as spy_run:
        try:
            main._ai_client = Groq(api_key="gsk_invalidkeyforintegrationtestspassword123")
            response = client.post("/api/review", json=payload)
            
            # The request should still return 200 via fallback linter path
            assert response.status_code == 200
            data = response.json()
            assert data["source"] == "fallback"
            assert isinstance(data["issues"], list)
            
            # Confirm that subprocess.run was called to launch pylint
            spy_run.assert_called()
            called_args = [call[0][0] for call in spy_run.call_args_list]
            pylint_called = any("pylint" in arg for arg in called_args)
            assert pylint_called is True
            
        finally:
            # Restore original client
            main._ai_client = original_client

def test_integration_rag_grounding():
    """
    Submit a Python code snippet with a style issue (missing type hints) and check 
    that the returned AI response contains references to 'type hints', 'annotations', 
    or 'PEP 484', verifying that the RAG style guide grounding works in the prompt seam.
    """
    payload = {
        "code": "def add(a, b):\n    return a + b\n",
        "language": "python"
    }
    response = client.post("/api/review", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["source"] == "ai"
    
    # Check that at least one style issue mentions type hints / annotations
    explanations = [issue["explanation"].lower() for issue in data["issues"]]
    has_rag_grounding = any(
        "type" in exp or "annotation" in exp or "pep 484" in exp 
        for exp in explanations
    )
    assert has_rag_grounding is True

def test_integration_guardrail_rejection():
    """
    Verify that submitting code over the 500-line cap via the endpoint returns 
    an HTTP 400 Bad Request with a clear message, confirming guardrail integration.
    """
    payload = {
        "code": "\n" * 501,
        "language": "python"
    }
    response = client.post("/api/review", json=payload)
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "Code exceeds the 500-line limit for this tool." in data["detail"]
