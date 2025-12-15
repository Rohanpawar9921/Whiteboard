import { io, Socket } from 'socket.io-client';
import type { DrawingData, Cursor } from '@/types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

class SocketService {
  private socket: Socket | null = null;
  private drawingCallback: ((data: DrawingData) => void) | null = null;
  private cursorCallback: ((cursor: Cursor) => void) | null = null;
  private sessionStateCallback: ((data: { drawings: DrawingData[] }) => void) | null = null;

  connect(token: string): void {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    console.log('Connecting to socket server:', SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  onConnect(callback: () => void): void {
    this.socket?.on('connect', callback);
  }

  joinSession(sessionId: string): void {
    if (!this.socket) {
      console.error('Cannot join session: socket not initialized');
      return;
    }
    if (!this.socket.connected) {
      console.error('Cannot join session: socket not connected');
      return;
    }
    console.log('Emitting join-session event for:', sessionId);
    this.socket.emit('join-session', sessionId);
  }

  leaveSession(sessionId: string): void {
    this.socket?.emit('leave-session', sessionId);
  }

  sendDrawing(sessionId: string, data: DrawingData): void {
    console.log('Emitting drawing event:', { sessionId, data });
    this.socket?.emit('drawing', { sessionId, data });
  }

  onDrawing(callback: (data: DrawingData) => void): void {
    // Remove old listener if exists
    if (this.drawingCallback) {
      this.socket?.off('drawing', this.drawingCallback);
    }
    this.drawingCallback = callback;
    this.socket?.on('drawing', callback);
  }

  sendCursor(sessionId: string, cursor: Cursor): void {
    this.socket?.emit('cursor-move', { sessionId, cursor });
  }

  onCursorMove(callback: (cursor: Cursor) => void): void {
    if (this.cursorCallback) {
      this.socket?.off('cursor-move', this.cursorCallback);
    }
    this.cursorCallback = callback;
    this.socket?.on('cursor-move', callback);
  }

  onUserJoined(callback: (data: { userId: string; username: string }) => void): void {
    this.socket?.on('user-joined', callback);
  }

  onUserLeft(callback: (data: { userId: string }) => void): void {
    this.socket?.on('user-left', callback);
  }

  onSessionState(callback: (data: { drawings: DrawingData[] }) => void): void {
    if (this.sessionStateCallback) {
      this.socket?.off('session-state', this.sessionStateCallback);
    }
    this.sessionStateCallback = callback;
    this.socket?.on('session-state', callback);
  }

  requestUndo(sessionId: string): void {
    this.socket?.emit('undo', sessionId);
  }

  requestRedo(sessionId: string): void {
    this.socket?.emit('redo', sessionId);
  }

  onUndo(callback: () => void): void {
    this.socket?.on('undo', callback);
  }

  onRedo(callback: () => void): void {
    // Only remove our specific listeners, not system ones
    if (this.drawingCallback) {
      this.socket?.off('drawing', this.drawingCallback);
      this.drawingCallback = null;
    }
    if (this.cursorCallback) {
      this.socket?.off('cursor-move', this.cursorCallback);
      this.cursorCallback = null;
    }
    if (this.sessionStateCallback) {
      this.socket?.off('session-state', this.sessionStateCallback);
      this.sessionStateCallback = null;
    }
  }

  removeAllListeners(): void {
    this.socket?.removeAllListeners();
  }
}

export default new SocketService();
