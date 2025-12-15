import axios from 'axios';
import FormData from 'form-data';
import config from '../config';
import { PredictionResponse } from '../types';

class MLService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.mlServerUrl;
  }

  /**
   * Send image buffer to ML server for prediction
   * @param buffer - Image file buffer
   * @param mimetype - MIME type of the image
   * @param filename - Original filename
   * @returns Prediction results
   */
  async predictImageFromBuffer(
    buffer: Buffer,
    mimetype: string,
    filename: string
  ): Promise<PredictionResponse> {
    try {
      const formData = new FormData();
      formData.append('file', buffer, {
        filename,
        contentType: mimetype,
      });

      const response = await axios.post<PredictionResponse>(
        `${this.baseUrl}/predict`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 30000, // 30 second timeout
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      return response.data;
    } catch (error) {
      console.error('ML Service prediction error:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`ML Server error: ${error.response.data.detail || error.message}`);
      }
      throw new Error('Failed to get prediction from ML server');
    }
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
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`ML Server error: ${error.response.data.detail || error.message}`);
      }
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
