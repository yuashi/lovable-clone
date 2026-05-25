# 🚀 Lovable Clone – Agentic AI App Builder

An **Agentic AI system built with LangGraph** that automatically generates complete software applications from natural language prompts.

This project mimics the core idea behind tools like _Lovable_:
👉 You describe an app → AI plans, designs, and builds it step-by-step.

---

## 🧠 Architecture Overview

The system is composed of **three autonomous agents**, orchestrated using a LangGraph workflow:

### 1. 🧩 Planner Agent

- Takes user input
- Generates a **high-level project plan**

### 2. 🏗 Architect Agent

- Converts the plan into:
  - Structured **engineering tasks**
  - File-level implementation steps
  - Dependency-aware execution order

### 3. 💻 Coder Agent

- Iteratively executes tasks
- Uses tools to:
  - Read existing files
  - Write/update code
  - Maintain consistency across modules

---

## 🔁 Workflow

User Prompt → Planner → Architect → Coder (loop) → Final App

The **Coder Agent loops** until all implementation steps are completed.

---

## ⚙️ Tech Stack

- **LangGraph** – agent orchestration
- **LangChain** – LLM + tool integration
- **Groq LLM (`openai/gpt-oss-120b`)**
- **Python**
- Tooling:
  - File system tools (`read_file`, `write_file`, etc.)
  - ReAct-style agent execution

---

## 📂 Project Structure

```
.
├── graph.py        # Main agent workflow (LangGraph)
├── prompts.py      # Prompts for planner, architect, coder
├── states.py       # Pydantic state schemas
├── tools.py        # File system tools
```

---

## 🚀 How It Works

### Step 1: Provide a prompt

```python
user_prompt = "Create a simple calculator web application"
```

### Step 2: Run the agent

```bash
python graph.py
```

### Step 3: What happens internally

1. Planner creates a full project plan
2. Architect breaks it into structured tasks
3. Coder:
   - Reads files
   - Writes code
   - Iterates until completion

---

## 🔄 Execution Graph

```
Planner → Architect → Coder ↺
                        ↓
                       END
```

- The system loops in the **Coder node**
- Stops when all tasks are completed

---

## 🧰 Key Features

✅ Fully autonomous multi-agent pipeline
✅ Structured output using Pydantic schemas
✅ Tool-augmented coding agent (ReAct pattern)
✅ Iterative file-based code generation
✅ Dependency-aware task execution

---

## ⚠️ Limitations

- No validation/testing agent (yet)
- Depends heavily on LLM output quality
- File system operations are local-only
- No UI (CLI-based)

---

## 🔮 Future Improvements

- ✅ Add **Debugger/Test Agent**
- ✅ Add **Frontend preview (like Lovable)**
- ✅ Add **memory & long-term context**
- ✅ Add **multi-file dependency validation**
- ✅ Support multiple LLM providers

---

## 🔑 Setup Instructions (using uv)

### 1. Install uv

If you don’t have `uv` installed:

```bash
pip install uv
```

Or (recommended):

```bash
curl -Ls https://astral.sh/uv/install.sh | sh
```

---

### 2. Clone the repository

```bash
git clone https://github.com/yuashi/lovable-clone.git
cd lovable-clone
```

---

### 3. Create and sync environment

```bash
uv venv
uv sync
```

---

### 4. Activate the environment

```bash
source .venv/bin/activate   # Mac/Linux
.venv\Scripts\activate      # Windows
```

---

### 5. Add environment variables

Create a `.env` file:

```env
GROQ_API_KEY=your_api_key_here
```

---

### ▶️ Run the project

```bash
python graph.py
```

---

## 💡 Example Output

Input:

```
Create a simple calculator web app
```

Output:

- Multiple files generated
- Structured frontend/backend logic
- Fully working base app

---

## 🙌 Acknowledgements

- LangChain
- LangGraph
- Groq LLM
- Inspiration: Lovable.dev

---
