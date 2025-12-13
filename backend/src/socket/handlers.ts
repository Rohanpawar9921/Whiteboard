import { Server, Socket } from 'socket.io';
import { DrawingData, Cursor, Session } from '../types';

// In-memory session storage (replace with Redis in production)
const sessions = new Map<string, Session>();

export const setupSocketHandlers = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // Extract user info from auth token (placeholder)
    const userId = socket.handshake.auth.userId || socket.id;
    const username = socket.handshake.auth.username || `User-${socket.id.substring(0, 5)}`;

    // Join session
    socket.on('join-session', (sessionId: string) => {
      console.log(`${username} joining session: ${sessionId}`);
      
      socket.join(sessionId);

      // Initialize session if it doesn't exist
      if (!sessions.has(sessionId)) {
        sessions.set(sessionId, {
          id: sessionId,
          drawings: [],
          participants: new Map(),
          undoStack: [],
          redoStack: [],
        });
      }

      const session = sessions.get(sessionId)!;
      session.participants.set(userId, { userId, username, socketId: socket.id });

      // Send current session state to the joining user
      socket.emit('session-state', {
        drawings: session.drawings,
      });

      // Notify others in the session
      socket.to(sessionId).emit('user-joined', { userId, username });
    });

    // Leave session
    socket.on('leave-session', (sessionId: string) => {
      console.log(`${username} leaving session: ${sessionId}`);
      
      socket.leave(sessionId);

      const session = sessions.get(sessionId);
      if (session) {
        session.participants.delete(userId);
        
        // Clean up empty sessions
        if (session.participants.size === 0) {
          sessions.delete(sessionId);
        }
      }

      socket.to(sessionId).emit('user-left', { userId });
    });

    // Handle drawing events
    socket.on('drawing', ({ sessionId, data }: { sessionId: string; data: DrawingData }) => {
      const session = sessions.get(sessionId);
      if (session) {
        session.drawings.push(data);
        // Broadcast to all users in the session except sender
        socket.to(sessionId).emit('drawing', data);
      }
    });

    // Handle cursor movement
    socket.on('cursor-move', ({ sessionId, cursor }: { sessionId: string; cursor: Cursor }) => {
      socket.to(sessionId).emit('cursor-move', cursor);
    });

    // Handle undo
    socket.on('undo', (sessionId: string) => {
      const session = sessions.get(sessionId);
      if (session && session.drawings.length > 0) {
        const lastDrawing = session.drawings.pop();
        if (lastDrawing) {
          session.undoStack.push([lastDrawing]);
          io.to(sessionId).emit('undo');
        }
      }
    });

    // Handle redo
    socket.on('redo', (sessionId: string) => {
      const session = sessions.get(sessionId);
      if (session && session.undoStack.length > 0) {
        const drawings = session.undoStack.pop();
        if (drawings) {
          session.drawings.push(...drawings);
          io.to(sessionId).emit('redo');
        }
      }
    });

    // Clear canvas
    socket.on('clear-canvas', (sessionId: string) => {
      const session = sessions.get(sessionId);
      if (session) {
        session.drawings = [];
        session.undoStack = [];
        session.redoStack = [];
        io.to(sessionId).emit('canvas-cleared');
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      // Remove user from all sessions
      sessions.forEach((session, sessionId) => {
        if (session.participants.has(userId)) {
          session.participants.delete(userId);
          socket.to(sessionId).emit('user-left', { userId });
          
          // Clean up empty sessions
          if (session.participants.size === 0) {
            sessions.delete(sessionId);
          }
        }
      });
    });
  });
};
