import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Whiteboard from '@/components/Whiteboard/Whiteboard';
import type { WhiteboardHandle } from '@/components/Whiteboard/types';

const WhiteboardPage = (): React.JSX.Element => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [brushColor, setBrushColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(5);
  const whiteboardRef = useRef<WhiteboardHandle>(null);

  return (
    <div className="d-flex flex-column vh-100">
      {/* Top Bar */}
      <div className="bg-light border-bottom p-2 d-flex align-items-center gap-3">
        <span className="badge bg-primary">Session: {sessionId}</span>
        
        {/* Color Picker */}
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="colorPicker" className="form-label mb-0 small">Color:</label>
          <input
            id="colorPicker"
            type="color"
            className="form-control form-control-sm"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            style={{ width: '50px', height: '30px' }}
          />
        </div>

        {/* Brush Size */}
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="brushSize" className="form-label mb-0 small">Size:</label>
          <input
            id="brushSize"
            type="range"
            className="form-range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            style={{ width: '100px' }}
          />
          <span className="badge bg-secondary">{brushSize}px</span>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2 ms-auto">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => whiteboardRef.current?.undo()}
          >
            <i className="bi bi-arrow-counterclockwise"></i> Undo
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => whiteboardRef.current?.redo()}
          >
            <i className="bi bi-arrow-clockwise"></i> Redo
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => whiteboardRef.current?.clear()}
          >
            <i className="bi bi-trash"></i> Clear
          </button>
        </div>
      </div>

      {/* Whiteboard Canvas */}
      <div className="flex-grow-1">
        <Whiteboard ref={whiteboardRef} brushColor={brushColor} brushSize={brushSize} />
      </div>
    </div>
  );
};

export default WhiteboardPage;
