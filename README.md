# 🏆 HabitRace - Real-time Habit Tracking & Streaks

> **A full-stack, real-time habit tracking application built with React, Node.js, and Socket.IO, featuring containerization with Docker and Kubernetes orchestration.**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7.5-orange.svg)](https://socket.io/)
[![Docker](https://img.shields.io/badge/Docker-28.3.2-blue.svg)](https://docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-1.33.1-326CE5.svg)](https://kubernetes.io/)

## ✨ Features

- **🚀 Real-time Updates**: Live habit check-ins with instant streak updates
- **📊 Live Leaderboard**: Compete with others in real-time
- **💬 Live Feed**: See everyone's habit progress as it happens
- **🎯 Streak Tracking**: Build and maintain habit streaks
- **🔔 Multi-user Support**: Real-time collaboration and competition
- **📱 Responsive Design**: Works seamlessly on all devices
- **🐳 Containerized**: Easy deployment with Docker and Kubernetes
- **⚡ WebSocket Powered**: Instant real-time communication

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│  Express Server │◄──►│   SQLite DB     │
│   (Port 5173)   │    │   (Port 4000)   │    │   (Persistent)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │              ┌─────────────────┐
         └──────────────►│   Socket.IO     │
                        │  (Real-time)    │
                        └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Socket.IO Client** - Real-time communication
- **CSS3** - Modern styling and animations

### Backend
- **Node.js 20** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **SQLite** - Lightweight database
- **better-sqlite3** - High-performance SQLite3 client

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Kubernetes** - Container orchestration
- **Nginx** - Reverse proxy and static file serving
- **Minikube** - Local Kubernetes development

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://docker.com/) (for containerized deployment)
- [Minikube](https://minikube.sigs.k8s.io/) (for Kubernetes deployment)

### Option 1: Local Development (Recommended for Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/azibmalik/habitrace.git
   cd habitrace
   ```

2. **Start the Backend Server**
   ```bash
   cd server
   npm install
   npm run dev
   # Server will be available at http://localhost:4000
   ```

3. **Start the Frontend Client** (in a new terminal)
   ```bash
   cd client
   npm install
   npm run dev
   # Client will be available at http://localhost:5173
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` and start tracking habits!

### Option 2: Docker Compose (Recommended for Production-like Environment)

```bash
# From the project root
docker compose up --build

# Access the application:
# Frontend: http://localhost:8080
# Backend API: http://localhost:4000
```

### Option 3: Kubernetes Deployment

1. **Start Minikube**
   ```bash
   minikube start
   minikube addons enable ingress
   ```

2. **Build and Deploy**
   ```bash
   eval $(minikube docker-env)
   docker build -t habitrace-server:1.0.0 ./server
   docker build -t habitrace-client:1.0.0 ./client
   
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/server-pvc.yaml
   kubectl apply -f k8s/server-deployment.yaml
   kubectl apply -f k8s/server-service.yaml
   kubectl apply -f k8s/client-deployment.yaml
   kubectl apply -f k8s/client-service.yaml
   kubectl apply -f k8s/ingress.yaml
   ```

3. **Start Tunnel and Access**
   ```bash
   minikube tunnel
   # Access at: http://habitrace.localtest.me
   ```

## 📱 How to Use

1. **Set Your Username** - Enter your username in the top-right corner
2. **Add a Habit** - Create a new habit you want to track
3. **Check-in Daily** - Click the check-in button to maintain your streak
4. **Watch Live Updates** - See real-time updates in the Live Feed and Leaderboard
5. **Compete with Friends** - Open multiple browser tabs to simulate multi-user experience

## 🔧 Configuration

### Environment Variables

#### Frontend (Client)
```bash
VITE_API_BASE=http://localhost:4000  # Development
VITE_API_BASE=""                     # Production (same-origin)
```

#### Backend (Server)
```bash
PORT=4000                           # Server port
DB_PATH=/data/habitrace.db         # Database path
```

### Database
- **Development**: SQLite file in project directory
- **Docker**: Persistent volume mounted at `/data`
- **Kubernetes**: Persistent Volume Claim (PVC)

## 📊 API Endpoints

### Health Check
```http
GET /healthz
Response: { "ok": true }
```

### WebSocket Events
- `habit:checkin` - User checks in a habit
- `habit:add` - User adds a new habit
- `user:join` - User joins the session

## 🐳 Docker Details

### Multi-stage Builds
- **Server**: Node.js Alpine → Production dependencies only
- **Client**: Node.js build → Nginx Alpine for serving

### Security Features
- Non-root user execution
- Minimal attack surface with Alpine Linux
- Health checks for container monitoring

## ☸️ Kubernetes Architecture

```
Namespace: habitrace
├── Deployments
│   ├── server (1 replica)
│   └── client (1 replica)
├── Services
│   ├── server-svc (ClusterIP:4000)
│   └── client-svc (ClusterIP:80)
├── Ingress
│   └── habitrace-ingress (nginx)
└── PVC
    └── server-pvc (SQLite storage)
```

## 🧪 Testing

```bash
# Test the API
curl http://localhost:4000/healthz

# Test WebSocket connection
# Use browser dev tools or Socket.IO client

# Load testing
# Use tools like Artillery or k6 for WebSocket testing
```

## 📈 Performance

- **Frontend**: Vite dev server with HMR
- **Backend**: Express.js with optimized SQLite queries
- **Real-time**: Socket.IO with efficient event handling
- **Database**: In-memory SQLite with persistent storage

## 🔒 Security Considerations

- Input validation on server-side
- CORS configuration for cross-origin requests
- SQL injection prevention with parameterized queries
- Rate limiting for API endpoints (can be added)

## 🚀 Deployment Strategies

### Development
- Local Node.js servers
- Hot reload enabled
- Debug logging

### Staging
- Docker Compose
- Production-like environment
- Volume persistence

### Production
- Kubernetes cluster
- Load balancing
- Auto-scaling (can be configured)
- Monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing frontend framework
- **Socket.IO** - For real-time communication capabilities
- **Express.js** - For the robust backend framework
- **Docker & Kubernetes** - For containerization and orchestration

---

<div align="center">

**Made with ❤️ by Azib Malik**
</div>
