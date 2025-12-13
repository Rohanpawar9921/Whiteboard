import { io, Socket } from 'socket.io-client';
import type { DrawingData, Cursor } from '@/types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
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

  joinSession(sessionId: string): void {
    this.socket?.emit('join-session', sessionId);
  }

  leaveSession(sessionId: string): void {
    this.socket?.emit('leave-session', sessionId);
  }

  sendDrawing(sessionId: string, data: DrawingData): void {
    this.socket?.emit('drawing', { sessionId, data });
  }

  onDrawing(callback: (data: DrawingData) => void): void {
    this.socket?.on('drawing', callback);
  }

  sendCursor(sessionId: string, cursor: Cursor): void {
    this.socket?.emit('cursor-move', { sessionId, cursor });
  }

  onCursorMove(callback: (cursor: Cursor) => void): void {
    this.socket?.on('cursor-move', callback);
  }

  onUserJoined(callback: (data: { userId: string; username: string }) => void): void {
    this.socket?.on('user-joined', callback);
  }

  onUserLeft(callback: (data: { userId: string }) => void): void {
    this.socket?.on('user-left', callback);
  }

  onSessionState(callback: (data: { drawings: DrawingData[] }) => void): void {
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
    this.socket?.on('redo', callback);
  }

  removeAllListeners(): void {
    this.socket?.removeAllListeners();
  }
}

export default new SocketService();
