# Note: Importance of Providing Project Context to an AI Model

## What is Project Context?

Project context is the additional information provided to an AI model about a software project, such as:

* Project requirements
* Existing code files
* Folder structure
* Database schema
* APIs and dependencies
* Coding standards and constraints
* Business rules and expected behavior

The more relevant context the model has, the better it can understand the project and generate accurate code.

---

## Why Does Context Improve Quality?

Without context, the AI makes assumptions, which can lead to:

* Incorrect code
* Missing dependencies
* Inconsistent coding styles
* Wrong file modifications
* Solutions that do not fit the project

With proper context, the AI can:

* Generate project-specific code.
* Follow existing coding patterns.
* Understand dependencies and requirements.
* Produce more accurate and maintainable solutions.
* Reduce the need for manual corrections.

---

## Example

### Prompt Without Context

```text
Create a login API.
```

Possible issues:

* Which framework should be used?
* Which database is being used?
* What authentication method is required?
* What is the project structure?

The AI has to guess these details.

---

### Prompt With Context

```text
Project: E-commerce Application

Backend: FastAPI
Database: PostgreSQL
Authentication: JWT
Existing files:
- app/models/user.py
- app/routes/auth.py
- app/database.py

Requirement:
Create a login API that verifies email and password and returns a JWT token.
Follow the existing project structure and error handling conventions.
```

The model now has enough information to generate code that fits the project.

---

## Types of Context to Provide

### 1. Project Requirements

* Features to implement
* Business rules
* User stories

### 2. Code Files

* Existing source code
* Configuration files
* Database models

### 3. Dependencies

* Libraries and frameworks
* Package versions

### 4. Folder Structure

* Project organization
* Naming conventions

### 5. Constraints

* Performance requirements
* Security requirements
* Coding standards

---

## Best Practices

✅ Share only relevant files.

✅ Provide clear requirements.

✅ Mention the technology stack.

✅ Explain the expected output.

✅ Include examples when possible.

---

## Key Learning

**AI performs significantly better when it understands the project's context.**

### Formula to Remember

**Better Context = Better Understanding = Better Code Quality**

Providing project files, requirements, and constraints helps the model generate code that is more accurate, maintainable, and aligned with the existing project.
