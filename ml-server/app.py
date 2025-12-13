from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(
    title="Whiteboard ML Server",
    description="ML prediction service for collaborative whiteboard",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class PredictionItem(BaseModel):
    label: str
    score: float

class PredictionResponse(BaseModel):
    label: str
    confidence: float
    predictions: List[PredictionItem]

class ImageURLRequest(BaseModel):
    imageUrl: str

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Whiteboard ML Server",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "predict": "/predict"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "OK",
        "service": "ml-server",
        "model_loaded": False  # TODO: Update when model is loaded
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_image(file: Optional[UploadFile] = File(None), data: Optional[ImageURLRequest] = None):
    """
    Predict image classification
    
    Accepts either:
    - Multipart file upload (file parameter)
    - JSON with imageUrl field
    
    Returns dummy predictions for now
    TODO: Implement actual ML model prediction
    """
    try:
        # Check if we received file or URL
        if file:
            # Validate file type
            if file.content_type not in ["image/jpeg", "image/png", "image/jpg", "image/webp"]:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid file type. Only JPEG, PNG, and WebP are allowed."
                )
            
            # TODO: Process uploaded file with ML model
            filename = file.filename
            print(f"Received file: {filename}")
            
        elif data and data.imageUrl:
            # TODO: Download and process image from URL
            print(f"Received image URL: {data.imageUrl}")
        else:
            raise HTTPException(
                status_code=400,
                detail="Either file upload or imageUrl is required"
            )
        
        # Dummy prediction response
        # TODO: Replace with actual ML model inference
        dummy_response = PredictionResponse(
            label="Cat",
            confidence=0.95,
            predictions=[
                PredictionItem(label="Cat", score=0.95),
                PredictionItem(label="Dog", score=0.03),
                PredictionItem(label="Bird", score=0.02)
            ]
        )
        
        return dummy_response
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Prediction failed")

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
