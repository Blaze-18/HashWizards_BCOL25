# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.api.routes import router as api_router
from app.api.scenario_routes import router as scenario_router
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Neurodiversity Learning Platform API",
    description="API for neurodiversity-affirming learning experiences and scenario-based education",
    version="1.0.0"
)

# CORS middleware - allow requests from your Next.js app
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        # Add your production URLs here when deploying
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"] 
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": str(exc) if settings.DEBUG else "An unexpected error occurred"
        }
    )

# Include API routes
app.include_router(api_router, prefix="/api/v1")
app.include_router(scenario_router, prefix="/api/v1/scenarios")

@app.get("/")
async def root():
    return {
        "message": "Neurodiversity Learning Platform API is running",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/api/v1/generate-response",
            "scenarios": "/api/v1/scenarios/",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "neurodiversity-learning-platform",
        "version": "1.0.0"
    }