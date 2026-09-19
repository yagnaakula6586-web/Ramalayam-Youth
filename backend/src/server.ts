import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import photoRoutes from './routes/photoRoutes';
import { errorHandler } from './middleware/errorHandler';
import { getGoogleDriveConfig } from './config/googleAuth';
import { initDatabase } from './db/database';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL || '',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS Policy'));
      }
    },
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

app.use('/api/', limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use('/api', photoRoutes);

// Root Status
app.get('/', (_req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head><title>RAMALAYAM YOUTH API</title></head>
      <body style="font-family: system-ui, sans-serif; padding: 2rem; background: #0f172a; color: #f8fafc;">
        <h1 style="color: #38bdf8;">RAMALAYAM YOUTH Vissannapeta - Photo & Video Sharing API</h1>
        <p>Status: <strong style="color: #4ade80;">Active & Running</strong></p>
        <p>Tagline: <em>"Together We Grow, Serve and Make a Difference."</em></p>
      </body>
    </html>
  `);
});

// Error handling middleware
app.use(errorHandler);

// Initialize DB and start listening
async function startServer() {
  await initDatabase();

  app.listen(PORT, () => {
    const config = getGoogleDriveConfig();
    console.log(`\n======================================================`);
    console.log(`🚀 RAMALAYAM YOUTH Server listening on port ${PORT}`);
    console.log(`🌐 API Base: http://localhost:${PORT}/api`);
    console.log(`📁 Destination Folder ID: ${config.folderId ? config.folderId : 'Not Configured'}`);
    console.log(`🔑 Client ID: ${process.env.GOOGLE_CLIENT_ID ? 'LOADED ✅' : 'MISSING ❌'}`);
    console.log(`🔐 Auth Mode: ${config.authMethod}`);
    console.log(`======================================================\n`);
  });
}

startServer();
