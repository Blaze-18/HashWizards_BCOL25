Got it! For the **backend README.md**, since it’s a purely technical backend, we can clean it up:

* Remove unnecessary `__pycache__` and `.pyc` files from the project structure.
* Keep only relevant folders and files like `api`, `models`, `services`, `core`, `llm`, `utils`, `main.py`, `scenario_embeddings.pkl`, and `scenarios.json`.
* Keep the flow consistent with the root README and frontend README: high-level description, key features, AI backend methods, tech stack, simplified project structure, installation, how it works, future enhancements, license.
* No screenshots or videos needed.

Here’s a **ready-to-copy backend README.md** in the cleaned format:

---

# 🌟 Sentio Backend API

A FastAPI-based backend service powering Sentio – an AI-powered support platform designed for neurodiverse individuals, particularly children and teenagers with conditions like ASD and ADHD. The system provides personalized therapeutic support and learning experiences through a **RAG-based AI assistant** and **scenario-based learning modules**.

---

## ✅ Key Features

* **Personalized AI Assistant:** Uses **Retrieval Augmented Generation (RAG)** with **LangChain sequential and parallel chains** to generate responses based on user preferences. Semantic search uses **sentence-transformer embeddings** for accurate context retrieval.
* **Scenario-Based Learning System:** Provides structured learning activities across domains such as **emotional regulation, social skills, executive functioning, and adaptability training**. User preferences are embedded and matched using **cosine similarity** to recommend the most relevant scenarios.
* **User Management:** Stores detailed user preferences, monitors engagement with learning modules, and ensures personalized interactions.

---

## 🛠 Technology Stack

* **Framework:** FastAPI
* **Language:** Python 3.12
* **AI/ML:** LangChain, GroqCloud LLM API
* **Embeddings:** Sentence Transformers (all-MiniLM-L6-v2)
* **Validation:** Pydantic
* **Storage:** Local files (prototype phase)

---

## 📂 Project Structure

```
app/
├── api/
│   ├── routes.py
│   └── scenario_routes.py
├── core/
│   └── config.py
├── llm/
│   └── response_generator.py
├── models/
│   ├── preferences.py
│   ├── scenario.py
│   └── scenario_content.py
├── services/
│   ├── preference_processor.py
│   ├── scenario_generator.py
│   └── scenario_service.py
├── utils/
├── main.py
├── scenario_embeddings.pkl
└── scenarios.json
```

---

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd sentio-backend
```

2. Install dependencies:

```bash
pip install fastapi uvicorn pydantic langchain sentence-transformers
```

3. Set environment variables:

```bash
export API_HOST=0.0.0.0
export API_PORT=8000
export LOG_LEVEL=INFO
export MODEL_NAME="openai/gpt-oss-120b"
export EMBEDDING_MODEL="sentence-transformers/all-MiniLM-L6-v2"
```

4. Run the backend server:

```bash
uvicorn main:app --reload
```

---

## 🧠 How It Works

* User preferences are collected and stored.
* A custom prompt template is created using **LangChain's prompt engineering**.
* **Semantic search** is performed on the knowledge base using preference-derived embeddings.
* Relevant context is retrieved and fed to the LLM through **sequential chaining**.
* The **GroqCloud LLM** generates personalized responses based on the context and user preferences.
* **Scenario Recommendation:** Scenario content and user preferences are embedded, similarity is computed, and scenarios are ranked by relevance.

---

## 🔮 Future Enhancements

* Persistent database integration for user preferences and scenarios.
* User authentication and role-based authorization.
* Enhanced progress tracking and analytics.
* Multimedia support for scenarios (images, audio, video).
* Real-time collaboration features for therapists and administrators.
* Support for multiple LLM providers.

---

## 📄 License

MIT License
