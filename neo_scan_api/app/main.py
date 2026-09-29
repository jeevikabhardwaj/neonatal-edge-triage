from fastapi import FastAPI
from neo_scan_api.app.api import endpoints

# Create FastAPI application instance
app = FastAPI(
    title="NeoScan AI Phase 1 API",
    description="API for neonatal lung ultrasound image classification (Normal/Abnormal) with Grad-CAM visualization.",
    version="0.1.0"
)

# Include the API router from endpoints.py
app.include_router(endpoints.router)

@app.get("/", tags=["Root"])
async def read_root():
    """
    Root endpoint for the NeoScan AI API.
    """
    return {"message": "NeoScan AI Phase 1 API is running!"}


@app.get("/health", tags=["Health Check"])
async def health_check():
    """
    Health check endpoint to verify API status.
    """
    return {"status": "ok", "message": "API is healthy"}
