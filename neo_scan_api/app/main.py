from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from neo_scan_api.app.api import endpoints

app = FastAPI(
    title="NeoScan AI Phase 1 API",
    description="API for neonatal lung ultrasound image classification (Normal/Abnormal) with Grad-CAM visualization.",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router)

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "NeoScan AI Phase 1 API is running!"}


@app.get("/health", tags=["Health Check"])
async def health_check():
    return {"status": "ok", "message": "API is healthy"}
