import { Server as HTTPServer } from 'http';
import { Server, ServerOptions } from 'socket.io';
import config from '../config';
import { setupSocketHandlers } from './handlers';

export const initializeSocket = (httpServer: HTTPServer): Server => {
  const socketOptions: Partial<ServerOptions> = {
    cors: {
      origin: config.corsOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  };

  const io = new Server(httpServer, socketOptions);

  // Middleware for socket authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    // TODO: Validate token with Keycloak
    // For now, allow all connections
    
    if (token) {
      // Placeholder: Extract user info from token
      socket.handshake.auth.userId = 'user-123';
      socket.handshake.auth.username = 'testuser';
    }
    
    next();
  });

  // Setup event handlers
  setupSocketHandlers(io);

  console.log('Socket.io server initialized');

  return io;
};
