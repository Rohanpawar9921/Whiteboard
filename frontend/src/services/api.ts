import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  setAuthToken(token: string): void {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.api.defaults.headers.common['Authorization'];
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }

  async uploadImage(file: File): Promise<{ imageUrl: string; filename: string; message: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await this.api.post<{ imageUrl: string; filename: string; message: string }>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async predictImage(imageUrl: string): Promise<import('../types').PredictionResult> {
    const response = await this.api.post<import('../types').PredictionResult>('/api/predict', { imageUrl });
    return response.data;
  }

  async predictImageFromFile(file: File): Promise<import('../types').PredictionResult> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await this.api.post<import('../types').PredictionResult>('/api/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Authentication methods
  async signup(username: string, email: string, password: string): Promise<{ user: any; token: string; message: string }> {
    const response = await this.api.post<{ user: any; token: string; message: string }>('/api/auth/signup', {
      username,
      email,
      password,
    });
    return response.data;
  }

  async login(email: string, password: string): Promise<{ user: any; token: string; message: string }> {
    const response = await this.api.post<{ user: any; token: string; message: string }>('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async getCurrentUser(): Promise<{ user: any }> {
    const response = await this.api.get<{ user: any }>('/api/auth/me');
    return response.data;
  }
}

export default new ApiService();
