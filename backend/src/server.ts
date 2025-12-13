import { createServer } from 'http';
import createApp from './app';
import { initializeSocket } from './socket';
import config from './config';

const app = createApp();
const httpServer = createServer(app);

// Initialize Socket.io
initializeSocket(httpServer);

// Start server
const startServer = (): void => {
  httpServer.listen(config.port, () => {
    console.log('=================================');
    console.log(`🚀 Server running on port ${config.port}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
    console.log(`🌐 CORS enabled for: ${config.corsOrigin}`);
    console.log(`🔌 Socket.io server initialized`);
    console.log('=================================');
  });
};

// Graceful shutdown
const gracefulShutdown = (): void => {
  console.log('\n🛑 Shutting down gracefully...');
  
  httpServer.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️ Forced shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();
