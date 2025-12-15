import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Line, Circle, Text } from 'react-konva';
import type { Stage as StageType } from 'konva/lib/Stage';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { LineData, WhiteboardProps, WhiteboardHandle, RemoteCursor } from './types';
import socketService from '@/services/socket';
import { useAuth } from '@/auth';

const Whiteboard = forwardRef<WhiteboardHandle, WhiteboardProps>(
  ({ brushColor = '#000000', brushSize = 5, sessionId }, ref): React.JSX.Element => {
    const [lines, setLines] = useState<LineData[]>([]);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [undoStack, setUndoStack] = useState<LineData[][]>([]);
    const [redoStack, setRedoStack] = useState<LineData[][]>([]);
    const [remoteCursors, setRemoteCursors] = useState<Map<string, RemoteCursor>>(new Map());
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const stageRef = useRef<StageType | null>(null);
    const { user } = useAuth();

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

    // Socket connection and event handlers
    useEffect(() => {
      if (!sessionId) return;

      console.log('Setting up socket listeners for session:', sessionId);

      // Set up listeners FIRST, before joining
      const handleDrawing = (data: any): void => {
        console.log('Received drawing:', data);
        setLines((prevLines) => [...prevLines, data as LineData]);
      };

      const handleCursorMove = (cursor: any): void => {
        setRemoteCursors((prev) => {
          const updated = new Map(prev);
          updated.set(cursor.userId, cursor);
          return updated;
        });
      };

      const handleSessionState = (data: any): void => {
        console.log('Received session state:', data);
        setLines(data.drawings as LineData[]);
      };

      // Register listeners
      socketService.onDrawing(handleDrawing);
      socketService.onCursorMove(handleCursorMove);
      socketService.onSessionState(handleSessionState);

      // Join session - wait a bit to ensure socket is fully ready
      const joinTimer = setTimeout(() => {
        console.log('Attempting to join session:', sessionId);
        socketService.joinSession(sessionId);
      }, 1000);

      // Cleanup
      return () => {
        clearTimeout(joinTimer);
        console.log('Cleaning up session:', sessionId);
        if (sessionId) {
          socketService.leaveSession(sessionId);
        }
        socketService.removeAllListeners();
      };
    }, [sessionId]);

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
        userId: user?.id,
      };

      setLines([...lines, newLine]);
    };

    // Handle mouse/touch move (drawing + cursor)
    const handleMouseMove = (e: KonvaEventObject<MouseEvent | TouchEvent>): void => {
      const stage = e.target.getStage();
      const pos = stage?.getPointerPosition();
      if (!pos) return;
      
      // Emit cursor position to other users
      if (sessionId && user) {
        socketService.sendCursor(sessionId, {
          userId: user.id,
          x: pos.x,
          y: pos.y,
          username: user.username,
          color: brushColor,
        });
      }

      // Continue drawing if mouse is down
      if (!isDrawing) return;

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
      if (isDrawing && sessionId) {
        // Emit the completed line to other users
        const completedLine = lines[lines.length - 1];
        if (completedLine) {
          const drawingData = {
            type: 'line' as const,
            id: completedLine.id,
            points: completedLine.points,
            stroke: completedLine.stroke,
            strokeWidth: completedLine.strokeWidth,
            userId: user?.id || 'unknown',
          };
          console.log('Sending drawing to session:', sessionId, drawingData);
          socketService.sendDrawing(sessionId, drawingData);
        }
      }
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

    // Export to PNG
    const exportToPNG = (): void => {
      if (!stageRef.current) return;

      const uri = stageRef.current.toDataURL({
        mimeType: 'image/png',
        quality: 1,
        pixelRatio: 2, // Higher quality
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `whiteboard-${sessionId || Date.now()}.png`;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // Export to PDF
    const exportToPDF = async (): Promise<void> => {
      if (!stageRef.current) return;

      try {
        // Dynamic import to avoid bundling if not needed
        const { jsPDF } = await import('jspdf');

        const uri = stageRef.current.toDataURL({
          mimeType: 'image/png',
          quality: 1,
          pixelRatio: 2,
        });

        // Get stage dimensions
        const width = stageRef.current.width();
        const height = stageRef.current.height();

        // Create PDF with appropriate size
        // A4 size is 210 x 297 mm
        const pdf = new jsPDF({
          orientation: width > height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [width, height],
        });

        pdf.addImage(uri, 'PNG', 0, 0, width, height);
        pdf.save(`whiteboard-${sessionId || Date.now()}.pdf`);
      } catch (error) {
        console.error('Failed to export PDF:', error);
        alert('Failed to export PDF. Please try again.');
      }
    };

    // Expose API methods
    useImperativeHandle(ref, () => ({
      undo,
      redo,
      clear,
      exportToPNG,
      exportToPDF,
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
          
          {/* Remote Cursors Layer */}
          <Layer>
            {Array.from(remoteCursors.values()).map((cursor) => (
              <React.Fragment key={cursor.userId}>
                <Circle
                  x={cursor.x}
                  y={cursor.y}
                  radius={8}
                  fill="#3b82f6"
                  opacity={0.7}
                />
                {cursor.username && (
                  <Text
                    x={cursor.x + 12}
                    y={cursor.y - 5}
                    text={cursor.username}
                    fontSize={12}
                    fill="#3b82f6"
                    fontStyle="bold"
                  />
                )}
              </React.Fragment>
            ))}
          </Layer>
        </Stage>
      </div>
    );
  }
);

Whiteboard.displayName = 'Whiteboard';

export default Whiteboard;
