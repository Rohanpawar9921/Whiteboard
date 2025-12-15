export interface LineData {
  id: string;
  points: number[];
  stroke: string;
  strokeWidth: number;
  userId?: string;
}

export interface WhiteboardProps {
  brushColor?: string;
  brushSize?: number;
  sessionId?: string;
}

export interface WhiteboardHandle {
  undo: () => void;
  redo: () => void;
  clear: () => void;
  exportToPNG: () => void;
  exportToPDF: () => void;
}

export interface RemoteCursor {
  userId: string;
  x: number;
  y: number;
  username?: string;
}
