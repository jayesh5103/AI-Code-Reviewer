# Note: Anatomy of a Good Coding Prompt

## Introduction

A coding prompt is an instruction given to an AI assistant or developer to generate code for a specific task. The quality of the prompt directly affects the quality of the generated code. A well-structured prompt reduces ambiguity and produces accurate, efficient, and maintainable solutions.

A good coding prompt consists of four main components:

1. Goal
2. Context
3. Constraints
4. Example

---

## 1. Goal 🎯

The **goal** clearly defines what the code should accomplish.

### Purpose:

* Tells the AI exactly what problem needs to be solved.
* Prevents vague or incorrect responses.

### Example:

**Bad Prompt:**

> Write a Python program.

**Good Prompt:**

> Write a Python program that finds duplicate elements in a list.

---

## 2. Context 📚

The **context** explains where and why the code will be used.

### Purpose:

* Helps the AI understand the real-world scenario.
* Produces solutions that fit the application's requirements.

### Example:

> This function will be used in an e-commerce application to detect duplicate order IDs before storing them in the database.

---

## 3. Constraints ⚙️

**Constraints** specify the rules, limitations, and requirements that the solution must follow.

### Examples of Constraints:

* Use Python 3.12.
* Do not use external libraries.
* Time complexity should be O(n).
* Follow Object-Oriented Programming principles.
* Include comments and error handling.

### Purpose:

* Ensures the generated code meets technical and business requirements.
* Improves performance and maintainability.

---

## 4. Example 📝

Examples provide sample inputs and expected outputs.

### Purpose:

* Removes ambiguity.
* Clarifies exactly how the program should behave.

### Example:

**Input:**

```python
[1, 2, 3, 2, 4, 5, 1]
```

**Output:**

```python
[1, 2]
```

---

# Complete Coding Prompt Example

```text
Goal:
Write a Python function to find duplicate elements in a list.

Context:
This function will be used in an e-commerce application to detect duplicate order IDs.

Constraints:
- Use Python 3.12.
- Do not use external libraries.
- Time complexity should be O(n).
- Return only unique duplicate values.

Example:
Input: [1, 2, 3, 2, 4, 5, 1]
Output: [1, 2]
```

---

# Key Takeaways

* A good prompt should be **clear, specific, and structured**.
* Including context helps generate more relevant solutions.
* Constraints ensure the solution follows required standards.
* Examples make expectations explicit and reduce misunderstandings.

## Formula to Remember

**Good Coding Prompt = Goal + Context + Constraints + Example**

Using this formula leads to better code generation, fewer revisions, and more effective collaboration with AI coding assistants.
