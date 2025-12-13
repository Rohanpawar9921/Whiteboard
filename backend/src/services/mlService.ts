import axios from 'axios';
import config from '../config';
import { PredictionResponse } from '../types';

class MLService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.mlServerUrl;
  }

  /**
   * Send image to ML server for prediction
   * @param imageUrl - URL or path to the image
   * @returns Prediction results
   */
  async predictImage(imageUrl: string): Promise<PredictionResponse> {
    try {
      const response = await axios.post<PredictionResponse>(
        `${this.baseUrl}/predict`,
        { imageUrl },
        {
          timeout: 30000, // 30 second timeout
        }
      );

      return response.data;
    } catch (error) {
      console.error('ML Service prediction error:', error);
      throw new Error('Failed to get prediction from ML server');
    }
  }

  /**
   * Check if ML server is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/health`, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      console.error('ML Server health check failed:', error);
      return false;
    }
  }
}

export default new MLService();
