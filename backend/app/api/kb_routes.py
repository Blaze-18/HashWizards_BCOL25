# api/kb_routes.py
from fastapi import APIRouter, Form, UploadFile, File
from app.services import kb_service
import pandas as pd

router = APIRouter(prefix="/kb", tags=["Knowledge Base"])

@router.post("/upload")
async def upload_kb(
    title: str = Form(...),
    content: str = Form(...),
    source: str = Form(""),
):
    entry = kb_service.add_kb_entry(title, content, source)
    return entry

@router.post("/upload_csv")
async def upload_kb_csv(file: UploadFile = File(...)):
    """
    CSV columns: title, content, source (optional)
    """
    df = pd.read_csv(file.file)
    uploaded = []
    for _, row in df.iterrows():
        source = row.get("source", "")
        entry = kb_service.add_kb_entry(row["title"], row["content"], source)
        uploaded.append(entry)
    return {"uploaded": uploaded}

@router.get("/")
async def list_kb():
    return kb_service.list_kb_entries()
