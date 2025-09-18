# services/kb_service.py
from chromadb import Client
from chromadb.config import Settings
from typing import Dict
import uuid

# Initialize Chroma client
chroma_client = Client(Settings(chroma_db_impl="duckdb+parquet", persist_directory="./chroma_db"))

# Create collection for knowledge base
collection = chroma_client.get_or_create_collection(name="knowledge_base")

def add_kb_entry(title: str, content: str, source: str = "", metadata: Dict = {}):
    """
    Add a KB entry with embedding stored in Chroma DB
    """
    # Generate embedding using your model (mock here)
    embedding_vector = generate_embedding(content)
    
    # Use UUID as id
    kb_id = str(uuid.uuid4())
    
    collection.add(
        documents=[content],
        metadatas=[{"title": title, "source": source, **metadata}],
        ids=[kb_id],
        embeddings=[embedding_vector]
    )
    
    return {"id": kb_id, "title": title, "source": source}

def list_kb_entries():
    """
    Return metadata of all KB entries
    """
    return collection.get(include=["metadatas", "ids"])
    
# Mock embedding
def generate_embedding(text: str):
    import numpy as np
    return np.random.rand(1536).tolist()
