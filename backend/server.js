import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import './mongoMock.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import productivityRoutes from './routes/productivityRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { handleSocketConnection } from './sockets/socketHandler.js';

dotenv.config();

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io Server
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all client connections in sandbox
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Connect to Database
connectDB();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false // Allow loading static uploaded assets in frontend
}));
app.use(mongoSanitize());

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per window
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/productivity', productivityRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/admin', adminRoutes);

// Base route for health checks
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Configure socket lifecycle
handleSocketConnection(io);

// Global Error Handler
app.use(errorHandler);

// Listen on configured port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`[AetherTalk Server Running]`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Port: ${PORT}`);
  console.log(`WebSocket: ws://localhost:${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
  console.log(`==================================================\n`);
});
