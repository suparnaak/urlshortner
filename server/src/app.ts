import './types/express';
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.config';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes'
import urlRoutes from './routes/url.routes';
import redirectRoutes from './routes/redirect.routes';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Mongodb connection
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true, 
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);
app.use('/', redirectRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
