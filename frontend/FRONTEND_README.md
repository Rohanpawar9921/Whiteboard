# Collaborative Whiteboard - Frontend

React + TypeScript frontend application with Bootstrap 5, Konva.js, Socket.io, and Keycloak authentication.

## Project Structure

```
src/
├── auth/           # Keycloak authentication setup
├── components/     # Reusable React components (whiteboard components will be added later)
├── context/        # React Context providers (Auth, etc.)
├── hooks/          # Custom React hooks
├── layout/         # Layout components (MainLayout, etc.)
├── pages/          # Page components (Login, Home, Whiteboard)
├── services/       # API and Socket services
├── types/          # TypeScript type definitions
└── utils/          # Utility helper functions
```

## Technology Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Bootstrap 5** for UI styling
- **Konva.js** & React-Konva for canvas drawing
- **Socket.io-client** for real-time communication
- **Keycloak-js** for authentication
- **React Router** for routing
- **Axios** for HTTP requests

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your backend and Keycloak URLs:
   ```
   VITE_API_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   VITE_KEYCLOAK_URL=http://localhost:8080
   VITE_KEYCLOAK_REALM=whiteboard
   VITE_KEYCLOAK_CLIENT_ID=whiteboard-client
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Implemented

✅ Project scaffolding with Vite + React + TypeScript  
✅ Clean folder structure following best practices  
✅ TypeScript strict mode configuration  
✅ Path aliases for clean imports (`@/components`, `@/services`, etc.)  
✅ Bootstrap 5 integration  
✅ Keycloak authentication setup  
✅ Protected routes with authentication guard  
✅ Auth context provider  
✅ API service with Axios  
✅ Socket.io service for real-time communication  
✅ Login page with Keycloak integration  
✅ Home page with session creation/joining  
✅ Main layout with navigation  
✅ Type definitions for core entities  

## Next Steps

- Whiteboard canvas implementation with Konva.js
- Drawing tools (pen, shapes, text)
- Real-time collaboration features
- Cursor sharing
- Undo/Redo functionality
- Export to PNG/PDF
- Image upload and prediction

## Notes

- No whiteboard components have been created yet (as per requirements)
- The project is ready for whiteboard implementation
- All dependencies are installed and configured
- Authentication flow is complete and ready to use
