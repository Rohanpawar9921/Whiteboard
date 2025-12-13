import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
  };
  token?: string;
}

export interface DrawingData {
  type: 'line' | 'rect' | 'circle' | 'text';
  points?: number[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  text?: string;
  id: string;
  userId: string;
}

export interface Cursor {
  userId: string;
  username: string;
  x: number;
  y: number;
  color: string;
}

export interface Session {
  id: string;
  drawings: DrawingData[];
  participants: Map<string, { userId: string; username: string; socketId: string }>;
  undoStack: DrawingData[][];
  redoStack: DrawingData[][];
}

export interface PredictionRequest {
  imageUrl: string;
}

export interface PredictionResponse {
  label: string;
  confidence: number;
  predictions: Array<{
    label: string;
    score: number;
  }>;
}
