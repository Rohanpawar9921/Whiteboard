from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import numpy as np
from PIL import Image
import io
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input, decode_predictions
import requests

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

# Global model variable
model = None

def load_model():
    """Load the MobileNetV2 model pre-trained on ImageNet"""
    global model
    if model is None:
        print("Loading MobileNetV2 model...")
        model = MobileNetV2(weights='imagenet', include_top=True)
        print("Model loaded successfully!")
    return model

def preprocess_image(image: Image.Image) -> np.ndarray:
    """Preprocess image for MobileNetV2"""
    # Convert to RGB if necessary
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize to 224x224 (MobileNetV2 input size)
    image = image.resize((224, 224))
    
    # Convert to numpy array
    img_array = np.array(image)
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    # Preprocess for MobileNetV2
    img_array = preprocess_input(img_array)
    
    return img_array

def predict_image_with_model(image: Image.Image) -> PredictionResponse:
    """Run prediction on the image"""
    model = load_model()
    
    # Preprocess image
    processed_image = preprocess_image(image)
    
    # Make prediction
    predictions = model.predict(processed_image)
    
    # Decode predictions (top 5)
    decoded = decode_predictions(predictions, top=5)[0]
    
    # Convert to response format
    prediction_items = [
        PredictionItem(
            label=label.replace('_', ' ').title(),
            score=float(score)
        )
        for (_, label, score) in decoded
    ]
    
    # Top prediction
    top_prediction = prediction_items[0]
    
    return PredictionResponse(
        label=top_prediction.label,
        confidence=top_prediction.score,
        predictions=prediction_items
    )


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
        "model_loaded": model is not None
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
        image = None
        
        # Check if we received file or URL
        if file:
            # Validate file type
            if file.content_type not in ["image/jpeg", "image/png", "image/jpg", "image/webp"]:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid file type. Only JPEG, PNG, and WebP are allowed."
                )
            
            # Read file and convert to PIL Image
            contents = await file.read()
            image = Image.open(io.BytesIO(contents))
            print(f"Received file: {file.filename}")
            
        elif data and data.imageUrl:
            # Download image from URL
            print(f"Received image URL: {data.imageUrl}")
            response = requests.get(data.imageUrl, timeout=10)
            if response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail="Failed to download image from URL"
                )
            image = Image.open(io.BytesIO(response.content))
        else:
            raise HTTPException(
                status_code=400,
                detail="Either file upload or imageUrl is required"
            )
        
        # Run prediction with the model
        prediction_response = predict_image_with_model(image)
        
        return prediction_response
        
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
