import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import apiService from '../../services/api';
import type { PredictionResult } from '../../types';
import styles from './ImagePredictor.module.css';

const ImagePredictor = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please select a JPEG, PNG, or WebP image.');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size too large. Maximum size is 10MB.');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setPrediction(null);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAndPredict = async (): Promise<void> => {
    if (!selectedFile) return;

    try {
      setError(null);
      setIsPredicting(true);

      // Send file directly to predict endpoint
      const predictionResult = await apiService.predictImageFromFile(selectedFile);
      setPrediction(predictionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
      console.error('Prediction error:', err);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleReset = (): void => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div 
            className="card border-0 shadow-lg"
            style={{ 
              borderRadius: '20px',
              overflow: 'hidden'
            }}
          >
            <div 
              className="card-header text-white p-4"
              style={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderBottom: 'none'
              }}
            >
              <div className="d-flex align-items-center">
                <div 
                  className="rounded-circle bg-white d-flex align-items-center justify-content-center me-3"
                  style={{ width: '50px', height: '50px' }}
                >
                  <i className="bi bi-stars fs-4" style={{ color: '#4facfe' }}></i>
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">AI Image Recognition</h4>
                  <small className="opacity-90">Powered by TensorFlow MobileNetV2</small>
                </div>
              </div>
            </div>
            <div className="card-body p-5">
              {/* File Upload Section */}
              <div className="mb-4">
                <label htmlFor="imageUpload" className="form-label fw-bold fs-5 mb-3">
                  <i className="bi bi-cloud-upload me-2"></i>
                  Upload Your Image
                </label>
                <div 
                  className="border-3 border-dashed rounded-4 p-5 text-center"
                  style={{ 
                    borderColor: '#4facfe',
                    background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.05), rgba(0, 242, 254, 0.05))',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={handleBrowseClick}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#00f2fe';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#4facfe';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <input
                    id="imageUpload"
                    ref={fileInputRef}
                    type="file"
                    className="d-none"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleFileSelect}
                    disabled={isPredicting}
                    aria-label="Upload image file"
                  />
                  <i className="bi bi-image display-1 mb-3" style={{ color: '#4facfe' }}></i>
                  <h5 className="fw-bold mb-2">Click to upload or drag and drop</h5>
                  <p className="text-muted mb-0">JPEG, PNG, WebP (max 10MB)</p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div 
                  className="alert alert-dismissible fade show border-0 shadow-sm animate__animated animate__shakeX" 
                  role="alert"
                  style={{ 
                    background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
                    color: 'white',
                    borderRadius: '15px'
                  }}
                >
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                  <strong>{error}</strong>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setError(null)}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              {/* Image Preview */}
              {previewUrl && (
                <div className="mb-4 animate__animated animate__fadeIn">
                  <label className="form-label fw-bold fs-5 mb-3">
                    <i className="bi bi-eye me-2"></i>
                    Image Preview
                  </label>
                  <div 
                    className="position-relative rounded-4 overflow-hidden shadow-lg"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1), rgba(0, 242, 254, 0.1))',
                      padding: '1rem'
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="img-fluid rounded-3"
                      style={{ 
                        maxHeight: '400px',
                        width: 'auto',
                        margin: '0 auto',
                        display: 'block'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedFile && !prediction && (
                <div className="d-flex gap-3 mb-4 animate__animated animate__fadeInUp">
                  <button
                    className="btn btn-lg flex-grow-1 fw-bold rounded-pill shadow"
                    onClick={handleUploadAndPredict}
                    disabled={isPredicting}
                    style={{ 
                      background: isPredicting ? '#6c757d' : 'linear-gradient(135deg, #4facfe, #00f2fe)',
                      border: 'none',
                      color: 'white',
                      transition: 'all 0.3s ease',
                      padding: '1rem 2rem'
                    }}
                    onMouseEnter={(e) => !isPredicting && (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => !isPredicting && (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {isPredicting && (
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    )}
                    {isPredicting ? 'Analyzing Image...' : '🚀 Predict with AI'}
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-lg rounded-pill fw-bold"
                    onClick={handleReset}
                    disabled={isPredicting}
                    style={{ 
                      padding: '1rem 2rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Reset
                  </button>
                </div>
              )}

              {/* Prediction Results */}
              {prediction && (
                <div className="mb-3 animate__animated animate__fadeInUp">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">
                      <i className="bi bi-trophy-fill me-2" style={{ color: '#ffd700' }}></i>
                      AI Predictions
                    </h5>
                    <button
                      className="btn btn-outline-primary rounded-pill"
                      onClick={handleReset}
                      style={{ transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <i className="bi bi-arrow-repeat me-1"></i>
                      Try Another
                    </button>
                  </div>

                  {/* Top Prediction Card */}
                  <div 
                    className="card border-0 shadow-lg mb-4 overflow-hidden"
                    style={{ 
                      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                      borderRadius: '20px'
                    }}
                  >
                    <div className="card-body p-4 text-white">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <div 
                              className="rounded-circle bg-white d-inline-flex align-items-center justify-content-center me-3"
                              style={{ width: '50px', height: '50px' }}
                            >
                              <i className="bi bi-trophy-fill fs-4" style={{ color: '#43e97b' }}></i>
                            </div>
                            <div>
                              <small className="opacity-75">Top Match</small>
                              <h3 className="mb-0 fw-bold">{prediction.label}</h3>
                            </div>
                          </div>
                        </div>
                        <div className="text-end ms-3">
                          <h1 className="mb-0 fw-bold display-4">
                            {(prediction.confidence * 100).toFixed(1)}%
                          </h1>
                          <small className="opacity-75">Confidence</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* All Predictions List */}
                  <div className="card border-0 shadow" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                    <div 
                      className="card-header text-white p-3"
                      style={{ 
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        borderBottom: 'none'
                      }}
                    >
                      <h6 className="mb-0 fw-bold">
                        <i className="bi bi-list-ol me-2"></i>
                        All Predictions
                      </h6>
                    </div>
                    <ul className="list-group list-group-flush">
                      {prediction.predictions.map((pred, index) => {
                        const gradients = [
                          'linear-gradient(135deg, #43e97b, #38f9d7)',
                          'linear-gradient(135deg, #4facfe, #00f2fe)',
                          'linear-gradient(135deg, #fa709a, #fee140)',
                          'linear-gradient(135deg, #667eea, #764ba2)',
                          'linear-gradient(135deg, #f093fb, #f5576c)'
                        ];
                        return (
                          <li 
                            key={index} 
                            className="list-group-item border-0 py-3"
                            style={{ 
                              background: index === 0 ? 'rgba(67, 233, 123, 0.05)' : 'white',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)';
                              e.currentTarget.style.transform = 'translateX(5px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = index === 0 ? 'rgba(67, 233, 123, 0.05)' : 'white';
                              e.currentTarget.style.transform = 'translateX(0)';
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center flex-grow-1">
                                <div 
                                  className="rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold text-white"
                                  style={{ 
                                    width: '35px', 
                                    height: '35px',
                                    background: gradients[index % gradients.length],
                                    fontSize: '0.9rem'
                                  }}
                                >
                                  {index + 1}
                                </div>
                                <span className="fw-semibold">{pred.label}</span>
                              </div>
                              <div className="d-flex align-items-center ms-3">
                                <div
                                  className="progress me-3"
                                  style={{ width: '120px', height: '8px', borderRadius: '10px' }}
                                  role="progressbar"
                                  aria-label={`${pred.label} prediction confidence`}
                                >
                                  <div
                                    className="progress-bar"
                                    data-score={pred.score}
                                    style={{ 
                                      width: `${pred.score * 100}%`,
                                      background: gradients[index % gradients.length],
                                      borderRadius: '10px'
                                    }}
                                  ></div>
                                </div>
                                <span 
                                  className="badge rounded-pill fw-semibold"
                                  style={{ 
                                    background: gradients[index % gradients.length],
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.85rem'
                                  }}
                                >
                                  {(pred.score * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePredictor;
