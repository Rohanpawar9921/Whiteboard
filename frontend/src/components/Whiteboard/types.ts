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
}

export interface WhiteboardHandle {
  undo: () => void;
  redo: () => void;
  clear: () => void;
}
