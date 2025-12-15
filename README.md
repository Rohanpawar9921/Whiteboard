# 🎨 Collaborative Whiteboard

A real-time collaborative whiteboard application with AI-powered image recognition, built with React, Node.js, Socket.io, and TensorFlow.

![Whiteboard Banner](frontend/src/assets/Home%20image.jpg)

## 📸 Screenshots & Demo Videos

### UI Snapshots
Explore the application's beautiful interface in the [`ui shapshots`](./ui%20shapshots/) folder:
- Landing page with hero section
- Authentication screens (Login/Signup)
- Whiteboard canvas with drawing tools
- AI Image Predictor interface
- Real-time collaboration features

### Video Demonstrations
Watch complete feature demonstrations in the [`screenshots and videos for review`](./screenshots%20and%20videos%20for%20review/) folder:
- Application walkthrough
- Real-time collaboration demo
- AI image recognition in action
- Drawing and export features

## ✨ Features

### 🖌️ Drawing & Collaboration
- **Real-time Drawing**: Draw simultaneously with multiple users in the same session
- **Customizable Brush**: Choose from any color and brush sizes (1-20px)
- **Multi-user Cursors**: See other users' cursors in real-time
- **Undo/Redo**: Full history management for your drawings
- **Clear Canvas**: Reset the whiteboard instantly
- **Export Options**: Download your artwork as PNG or PDF

### 🤖 AI-Powered Features
- **Image Recognition**: Upload images and get AI predictions using TensorFlow MobileNetV2
- **1000+ Categories**: Recognizes objects from ImageNet dataset
- **Confidence Scores**: See top 5 predictions with confidence percentages
- **Drag & Drop Upload**: Easy image upload interface

### 🔐 Authentication
- **Dual Authentication**: Support for both custom login and Keycloak SSO
- **Sign Up/Login**: Create accounts with email and password
- **Secure Password Storage**: bcrypt hashing with salt rounds
- **JWT Tokens**: 7-day token expiration with automatic refresh
- **Session Management**: Persistent authentication across browser sessions

### 🎨 Modern UI/UX
- **Premium Design**: Gradient themes with smooth animations
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Glassmorphism Effects**: Modern card and navigation designs
- **Animate.css Integration**: Smooth entrance and interaction animations
- **Bootstrap 5**: Professional component styling

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **React Konva** - Canvas manipulation
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP requests
- **Bootstrap 5** - UI framework
- **Keycloak JS** - SSO authentication
- **jsPDF** - PDF generation

### Backend
- **Node.js** with Express
- **TypeScript** - Type safety
- **Socket.io** - WebSocket server
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **Multer** - File upload handling
- **Keycloak Connect** - SSO integration

### ML Server
- **Python 3.10**
- **TensorFlow 2.18.0**
- **MobileNetV2** - Pre-trained model
- **FastAPI** - REST API framework
- **Pillow** - Image processing

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **PostgreSQL** - Database for Keycloak
- **Keycloak 26** - Identity and access management

## 📋 Prerequisites

- **Node.js** 20.19+ or 22.12+
- **Docker** & **Docker Compose**
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd WhiteBoard
```

### 2. Environment Setup

Create `.env` files:

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ML_SERVICE_URL=http://ml-server:8000
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=whiteboard
VITE_KEYCLOAK_CLIENT_ID=whiteboard-frontend
```

### 3. Start Services with Docker

```bash
# Start all services (Backend, ML Server, Keycloak, PostgreSQL)
docker compose up -d

# Check service status
docker compose ps

# View logs
docker compose logs -f
```

### 4. Start Frontend Development Server

```bash
cd frontend
npm install
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **ML Server**: http://localhost:8000
- **Keycloak**: http://localhost:8080

## 📖 Usage

### Creating a Session
1. Navigate to the home page
2. Click "Create New Session"
3. You'll be redirected to a unique whiteboard session
4. Share the session URL with collaborators

### Joining a Session
1. Get the session ID from a collaborator
2. Click "Join Existing Session" on the home page
3. Enter the session ID
4. Start collaborating!

### Drawing
- Select your preferred color from the color picker
- Adjust brush size with the slider (1-20px)
- Click and drag on the canvas to draw
- Use Undo/Redo buttons to manage your history
- Click Clear to reset the canvas

### Exporting
- **PNG**: Click "PNG" button to download high-quality image (2x pixel ratio)
- **PDF**: Click "PDF" button to download as PDF document

### AI Image Recognition
1. Scroll to the "AI Image Predictor" section on the home page
2. Upload an image or drag & drop
3. Click "Predict Image"
4. View top 5 predictions with confidence scores

## 🔑 Authentication

### Custom Authentication
1. Click "Sign Up" tab on the login page
2. Enter username, email, and password (min 6 characters)
3. Click "Create Account"
4. You'll be automatically logged in

### Login
1. Enter your email and password
2. Click "Login"
3. Your session will persist for 7 days

### Keycloak SSO
1. Click "Continue with Keycloak"
2. Follow the Keycloak authentication flow
3. You'll be redirected back after authentication

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user (requires JWT token)

### Image Processing
- `POST /api/upload` - Upload image file
- `POST /api/predict` - Predict image content with AI

### Health Check
- `GET /api/health` - Server health status

### WebSocket Events
- `joinSession` - Join a whiteboard session
- `leaveSession` - Leave a session
- `drawing` - Broadcast drawing data
- `cursorMove` - Broadcast cursor position
- `sessionState` - Get current session state

## 🏗️ Project Structure

```
WhiteBoard/
├── backend/                    # Node.js Express backend
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Authentication, error handling
│   │   ├── models/            # Data models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── socket/            # Socket.io handlers
│   │   └── types/             # TypeScript types
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── assets/            # Images, fonts
│   │   ├── auth/              # Keycloak configuration
│   │   ├── components/        # React components
│   │   │   ├── ImagePredictor/
│   │   │   └── Whiteboard/
│   │   ├── context/           # React context (Auth)
│   │   ├── layout/            # Layout components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API & Socket services
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Helper functions
│   └── package.json
│
├── ml-server/                  # Python ML server
│   ├── app.py                 # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile
│
└── docker-compose.yml         # Docker services configuration
```

## 🧪 Development

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### ML Server Development
```bash
cd ml-server
pip install -r requirements.txt
uvicorn app:app --reload
```

### Building for Production
```bash
# Build all services
docker compose build

# Start in production mode
docker compose up -d
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :4000

# Kill the process (Windows)
taskkill /PID <process-id> /F

# Or change the port in docker-compose.yml
```

### Backend Container Won't Start
```bash
# Rebuild without cache
docker compose build --no-cache backend
docker compose up -d backend
```

### Keycloak Connection Issues
1. Ensure Keycloak is running: `docker compose ps`
2. Wait for PostgreSQL to be healthy before Keycloak starts
3. Check logs: `docker logs whiteboard-keycloak`

### ML Model Download Taking Long
The first time you start the ML server, TensorFlow (~615MB) needs to be downloaded. This is normal and only happens once.

## 📝 Environment Variables

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `JWT_SECRET` | JWT signing secret | Required in production |
| `ML_SERVICE_URL` | ML server URL | `http://ml-server:8000` |

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:4000` |
| `VITE_SOCKET_URL` | Socket.io URL | `http://localhost:4000` |
| `VITE_KEYCLOAK_URL` | Keycloak URL | `http://localhost:8080` |
| `VITE_KEYCLOAK_REALM` | Keycloak realm | `whiteboard` |
| `VITE_KEYCLOAK_CLIENT_ID` | Keycloak client ID | `whiteboard-frontend` |

## 🔒 Security

- Passwords are hashed using bcrypt with 10 salt rounds
- JWT tokens expire after 7 days
- CORS is configured to allow only specified origins
- Keycloak provides enterprise-grade SSO
- File uploads are validated and stored securely

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- TensorFlow team for MobileNetV2 model
- React Konva for canvas manipulation
- Socket.io for real-time communication
- Keycloak for authentication infrastructure
- Bootstrap team for UI components

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

---

**Built with ❤️ using React, Node.js, and TensorFlow**
