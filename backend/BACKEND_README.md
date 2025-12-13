# Collaborative Whiteboard - Backend

TypeScript Express server with Socket.io for real-time collaboration and Keycloak authentication.

## Project Structure

```
backend/
├── src/
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # Server entry point
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware (auth, error handling)
│   ├── routes/             # API routes
│   ├── services/           # Business logic (ML service, etc.)
│   ├── socket/             # Socket.io handlers
│   └── types/              # TypeScript type definitions
├── uploads/                # Uploaded images storage
├── Dockerfile              # Docker configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Technology Stack

- **Node.js 20** with TypeScript
- **Express 5** for REST API
- **Socket.io** for real-time communication
- **Multer** for file uploads
- **Keycloak-connect** for authentication (placeholder)
- **Axios** for HTTP requests to ML server
- **CORS** enabled for frontend communication

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```
   PORT=5000
   NODE_ENV=development
   KEYCLOAK_URL=http://localhost:8080
   KEYCLOAK_REALM=whiteboard
   KEYCLOAK_CLIENT_ID=whiteboard-backend
   KEYCLOAK_CLIENT_SECRET=your-client-secret
   ML_SERVER_URL=http://localhost:8000
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   
   The server will be available at `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (not configured yet)

## API Endpoints

### REST API

- `GET /` - API information
- `GET /api/health` - Health check
- `POST /api/upload` - Upload image (requires authentication)
- `POST /api/predict` - Predict image (placeholder, requires authentication)

### Socket.io Events

**Client → Server:**
- `join-session` - Join a whiteboard session
- `leave-session` - Leave a whiteboard session
- `drawing` - Send drawing data
- `cursor-move` - Send cursor position
- `undo` - Request undo
- `redo` - Request redo
- `clear-canvas` - Clear entire canvas

**Server → Client:**
- `session-state` - Current session state on join
- `user-joined` - New user joined the session
- `user-left` - User left the session
- `drawing` - Broadcast drawing data
- `cursor-move` - Broadcast cursor position
- `undo` - Broadcast undo action
- `redo` - Broadcast redo action
- `canvas-cleared` - Canvas was cleared

## Features Implemented

✅ TypeScript strict mode configuration  
✅ Express app with CORS enabled  
✅ Path aliases for clean imports (`@/config`, `@/routes`, etc.)  
✅ Socket.io integration for real-time collaboration  
✅ File upload with Multer (images only, 10MB limit)  
✅ Keycloak authentication middleware (placeholder)  
✅ Error handling middleware  
✅ ML service integration (placeholder)  
✅ In-memory session storage  
✅ Drawing data synchronization  
✅ Cursor sharing  
✅ Undo/Redo functionality  
✅ Dockerfile for Node 20  

## Docker

Build and run using Docker:

```bash
docker build -t whiteboard-backend .
docker run -p 5000:5000 --env-file .env whiteboard-backend
```

## TODO

- Implement full Keycloak JWT token validation
- Replace in-memory session storage with Redis
- Add unit and integration tests
- Implement rate limiting
- Add request validation middleware
- Complete ML server integration

## Notes

- Authentication middleware is a placeholder - tokens are accepted but not validated
- Session data is stored in memory - will be lost on server restart
- ML prediction returns placeholder data
- Production deployment should use Redis for session storage
