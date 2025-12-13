import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import type { Stage as StageType } from 'konva/lib/Stage';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { LineData, WhiteboardProps, WhiteboardHandle } from './types';

const Whiteboard = forwardRef<WhiteboardHandle, WhiteboardProps>(
  ({ brushColor = '#000000', brushSize = 5 }, ref): React.JSX.Element => {
    const [lines, setLines] = useState<LineData[]>([]);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [undoStack, setUndoStack] = useState<LineData[][]>([]);
    const [redoStack, setRedoStack] = useState<LineData[][]>([]);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const stageRef = useRef<StageType | null>(null);

    // Handle window resize
    useEffect(() => {
      const handleResize = (): void => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight - 60, // Account for toolbar
        });
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Start drawing
    const handleMouseDown = (e: KonvaEventObject<MouseEvent | TouchEvent>): void => {
      setIsDrawing(true);
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      // Save current state to undo stack BEFORE starting new drawing
      setUndoStack([...undoStack, [...lines]]);
      setRedoStack([]); // Clear redo stack on new action

      const newLine: LineData = {
        id: `line-${Date.now()}-${Math.random()}`,
        points: [pos.x, pos.y],
        stroke: brushColor,
        strokeWidth: brushSize,
      };

      setLines([...lines, newLine]);
    };

    // Continue drawing
    const handleMouseMove = (e: KonvaEventObject<MouseEvent | TouchEvent>): void => {
      if (!isDrawing) return;

      const stage = e.target.getStage();
      const pos = stage?.getPointerPosition();
      if (!pos) return;

      const lastLine = lines[lines.length - 1];
      if (!lastLine) return;

      // Add new point to the last line
      const updatedLine: LineData = {
        ...lastLine,
        points: [...lastLine.points, pos.x, pos.y],
      };

      setLines([...lines.slice(0, -1), updatedLine]);
    };

    // Stop drawing
    const handleMouseUp = (): void => {
      setIsDrawing(false);
    };

    // Undo function
    const undo = (): void => {
      if (undoStack.length === 0) return;

      const previousState = undoStack[undoStack.length - 1];
      const newUndoStack = undoStack.slice(0, -1);

      setRedoStack([...redoStack, [...lines]]);
      setUndoStack(newUndoStack);
      setLines(previousState);
    };

    // Redo function
    const redo = (): void => {
      if (redoStack.length === 0) return;

      const nextState = redoStack[redoStack.length - 1];
      const newRedoStack = redoStack.slice(0, -1);

      setUndoStack([...undoStack, [...lines]]);
      setRedoStack(newRedoStack);
      setLines(nextState);
    };

    // Clear function
    const clear = (): void => {
      if (lines.length > 0) {
        setUndoStack([...undoStack, [...lines]]);
        setRedoStack([]);
        setLines([]);
      }
    };

    // Expose API methods
    useImperativeHandle(ref, () => ({
      undo,
      redo,
      clear,
    }));

    return (
      <div className="whiteboard-container" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <Stage
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          style={{ cursor: 'crosshair' }}
        >
          <Layer>
            {lines.map((line) => (
              <Line
                key={line.id}
                points={line.points}
                stroke={line.stroke}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation="source-over"
              />
            ))}
          </Layer>
        </Stage>
      </div>
    );
  }
);

Whiteboard.displayName = 'Whiteboard';

export default Whiteboard;
