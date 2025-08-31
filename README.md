# 🌟 Sentio – AI-Powered Neurodiversity Support Platform

Sentio is an **AI-driven support platform** designed for neurodiverse individuals, particularly children and teenagers with conditions like **ASD (Autism Spectrum Disorder)** and **ADHD**.  
It combines **personalized AI assistance**, **scenario-based learning**, and **preference-driven experiences** to provide engaging therapeutic support.

---

## ✅ Key Features

### 🧠 Personalized AI Assistant
- **RAG-Based Architecture** – Retrieval Augmented Generation for context-aware responses
- **Preference-Driven** – Adapts responses based on detailed user preferences
- **Advanced Chaining** – Uses LangChain's **sequential & parallel chains** for accuracy
- **Semantic Search** – Context retrieval using **sentence transformer embeddings**

### 🎯 Scenario-Based Learning
- **Preference-Based Recommendations** – Scenarios tailored to individual needs
- **Semantic Matching** – Compares user preferences and scenarios using **cosine similarity**
- **Skill Development Domains**:
  - Emotional regulation  
  - Social skills development  
  - Executive functioning  
  - Adaptability training  

### 👤 User Experience
- **Preference Management** – Stores user preferences for personalization
- **Progress Tracking** – Monitors user engagement with scenarios and lessons
- **Interactive UI** – Simple and responsive design built with **Next.js** and **Tailwind CSS**

---

## 🛠 Tech Stack

### **Frontend**
- **Framework**: Next.js 15.5.0
- **Styling**: Tailwind CSS
- **UI Enhancements**: ShadCN/UI components, Framer Motion animations
- **Routing & Navigation**: App Router

### **Backend**
- **Framework**: FastAPI (Python 3.12)
- **AI/ML**: LangChain, GroqCloud LLM API
- **Embeddings**: Sentence Transformers (*all-MiniLM-L6-v2*)
- **Validation**: Pydantic
- **Storage**: Local JSON & PKL files (Prototype phase)

---

## 📂 Project Structure

### **Frontend (Next.js)**
```
└── 📁src
    └── 📁app
        └── 📁about
            ├── page.tsx
        └── 📁api
            └── 📁save-preferences
                ├── route.ts
            └── 📁scenarios
                └── 📁recommend
                    ├── route.ts
                └── 📁search
                    ├── route.ts
        └── 📁auth
            └── 📁login
                ├── page.tsx
            └── 📁register
                ├── page.tsx
        └── 📁chat
            ├── page.tsx
        └── 📁dashboard
            ├── page.tsx
        └── 📁home
            ├── page.tsx
        └── 📁preferences
            ├── page.tsx
        └── 📁social
            ├── page.tsx
        ├── globals.css
        ├── layout.tsx
        ├── page.tsx
    └── 📁assets
        ├── bot.png
        ├── logo.png
    └── 📁components
        ├── ChatInterface.tsx
        ├── LLMMessageRenderer.tsx
        ├── Navbar.tsx
        ├── ScenarioInterface.tsx
        ├── ScenarioLearningModal.tsx
    └── 📁contexts
        ├── PreferencesContext.tsx
    └── 📁lib
        └── api.ts
```

### **Backend as Microservice (FastAPI)**
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


