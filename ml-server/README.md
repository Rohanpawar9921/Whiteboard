# Whiteboard ML Server

FastAPI-based machine learning service for image prediction.

## Setup

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

2. **Activate virtual environment:**
   
   **Windows:**
   ```bash
   venv\Scripts\activate
   ```
   
   **Linux/Mac:**
   ```bash
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server:**
   ```bash
   python app.py
   ```
   
   Or with uvicorn directly:
   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

The server will be available at `http://localhost:8000`

## API Endpoints

### GET /
Root endpoint with API information

### GET /health
Health check endpoint

### POST /predict
Predict image classification

**Request (File Upload):**
```bash
curl -X POST "http://localhost:8000/predict" \
  -F "file=@image.jpg"
```

**Request (JSON with URL):**
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "http://example.com/image.jpg"}'
```

**Response:**
```json
{
  "label": "Cat",
  "confidence": 0.95,
  "predictions": [
    {"label": "Cat", "score": 0.95},
    {"label": "Dog", "score": 0.03},
    {"label": "Bird", "score": 0.02}
  ]
}
```

## Interactive API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## TODO

- [ ] Integrate actual ML model (TensorFlow/PyTorch)
- [ ] Add image preprocessing pipeline
- [ ] Implement model loading and caching
- [ ] Add request validation and rate limiting
- [ ] Add logging and monitoring
- [ ] Containerize with Docker

## Notes

Currently returns dummy predictions. The actual ML model integration will be added in the next phase.
