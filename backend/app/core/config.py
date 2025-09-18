import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # API Configuration
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    
    # Model Configuration
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    MODEL_NAME: str = os.getenv("MODEL_NAME", "openai/gpt-oss-120b")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    
    # Paths
    DATA_DIR: str = "data"
    SCENARIOS_PATH: str = os.path.join(DATA_DIR, "scenarios.json")
    FAQS_PATH: str = os.path.join(DATA_DIR, "faqs.json")
    VECTORSTORE_PATH: str = os.path.join(DATA_DIR, "embeddings", "faiss_index")
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Preference processing
    MAX_PREFERENCES_SIZE: int = 1024  # Max size of preferences in bytes

    # Redis Configuration
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB: int = int(os.getenv("REDIS_DB", "0"))
    REDIS_PASSWORD: str = os.getenv("REDIS_PASSWORD", "")
    SESSION_EXPIRE_SECONDS: int = int(os.getenv("SESSION_EXPIRE_SECONDS", "604800"))  # 7 days

settings = Settings()