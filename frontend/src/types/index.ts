// Core Types
export interface User {
  id: string;
  username: string;
  email: string;
  token: string;
}

export interface Session {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  participants: string[];
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

export interface ToolSettings {
  tool: 'pen' | 'eraser' | 'rectangle' | 'circle' | 'text';
  color: string;
  strokeWidth: number;
}

export interface PredictionResult {
  label: string;
  confidence: number;
  predictions: Array<{
    label: string;
    score: number;
  }>;
}
