# Sentio Backend API

A FastAPI-based backend service powering Sentio - an AI-powered support platform designed for neurodiverse individuals, particularly children and teenagers with conditions like ASD and ADHD. The system provides personalized therapeutic support and learning experiences through a RAG-based AI assistant and scenario-based learning modules.

## 🚀 Features

### Personalized AI Assistant
- **RAG-Based Architecture**: Utilizes Retrieval Augmented Generation with Langchain for context-aware responses
- **Preference-Driven**: Tailors responses based on comprehensive user preferences
- **Sequential & Parallel Chaining**: Implements advanced Langchain patterns for optimal response generation
- **Semantic Search**: Employs sentence transformers for enhanced context understanding

### Scenario-Based Learning System
- **Preference-Based Retrieval**: Recommends learning modules based on user preferences
- **Semantic Matching**: Uses embeddings and cosine similarity to match scenarios with user needs
- **Interactive Learning**: Provides structured learning activities across multiple domains:
  - Emotional regulation
  - Social skills development
  - Executive functioning
  - Adaptability training

### User Management
- **Preference Storage**: Maintains detailed user preferences to personalize experiences
- **Progress Tracking**: Monitors user engagement with learning modules

## 🛠️ Technology Stack

- **Framework**: FastAPI
- **Language**: Python 3.12
- **AI/ML**: Langchain, GroqCloud LLM API
- **Embeddings**: Sentence Transformers (all-MiniLM-L6-v2)
- **Validation**: Pydantic
- **Storage**: Local storage (prototype phase)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sentio-backend

# Server Configuration
export API_HOST=0.0.0.0
export API_PORT=8000

# Application Configuration
export LOG_LEVEL=INFO
export MODEL_NAME="openai/gpt-oss-120b"
export EMBEDDING_MODEL="sentence-transformers/all-MiniLM-L6-v2"

```
└── 📁app
    └── 📁__pycache__
        ├── main.cpython-312.pyc
    └── 📁api
        └── 📁__pycache__
            ├── __init__.cpython-312.pyc
            ├── routes.cpython-312.pyc
            ├── scenario_routes.cpython-312.pyc
        ├── __init__.py
        ├── routes.py
        ├── scenario_routes.py
    └── 📁core
        └── 📁__pycache__
            ├── __init__.cpython-312.pyc
            ├── config.cpython-312.pyc
        ├── __init__.py
        ├── config.py
    └── 📁llm
        └── 📁__pycache__
            ├── __init__.cpython-312.pyc
            ├── response_generator.cpython-312.pyc
        ├── __init__.py
        ├── response_generator.py
    └── 📁models
        └── 📁__pycache__
            ├── __init__.cpython-312.pyc
            ├── preferences.cpython-312.pyc
            ├── scenario_content.cpython-312.pyc
            ├── scenario.cpython-312.pyc
        ├── __init__.py
        ├── preferences.py
        ├── scenario_content.py
        ├── scenario.py
    └── 📁profiles
        ├── __init__.py
    └── 📁retrieval
        ├── __init__.py
    └── 📁services
        └── 📁__pycache__
            ├── __init__.cpython-312.pyc
            ├── preference_processor.cpython-312.pyc
            ├── scenario_generator.cpython-312.pyc
            ├── scenario_service.cpython-312.pyc
        ├── __init__.py
        ├── preference_processor.py
        ├── scenario_generator.py
        ├── scenario_service.py
    └── 📁utils
        ├── __init__.py
    ├── main.py
    ├── scenario_embeddings.pkl
    └── scenarios.json
```

# 🧠 How It Works

## **Personalized AI Assistant**
- User preferences are collected and stored
- A custom prompt template is created using **LangChain's prompt engineering**
- The system performs **semantic search** on the knowledge base using preference-derived embeddings
- Relevant context is retrieved and fed to the LLM through **sequential chaining**
- The **GroqCloud LLM** generates personalized responses based on the context and user preferences

---

## **Scenario Recommendation System**
- Scenario content is converted to embeddings using **sentence transformers**
- User preferences are similarly embedded for comparison
- **Cosine similarity** identifies the most relevant scenarios
- Results are ranked and returned based on **relevance scores**

---

## 🔮 Future Enhancements
- Database integration for **persistent storage**
- **User authentication** and authorization
- Enhanced **progress tracking and analytics**
- **Multimedia support** for scenarios
- Real-time **collaboration features** for therapists
- Expanded LLM support with **multiple provider options**

---

## 📄 License
This project is **proprietary software**.  
All rights reserved.

---

