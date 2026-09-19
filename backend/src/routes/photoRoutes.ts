import { Router } from 'express';
import {
  uploadPhotos,
  getHealth,
  getUploadStatus,
  getAlbumsList,
  getAlbumDetails,
  getYearsList,
  getStats,
  createNewEvent,
  initiateGoogleAuth,
  googleAuthCallback,
} from '../controllers/photoController';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

const router = Router();

// System Health & Status
router.get('/health', getHealth);
router.get('/photos/status', getUploadStatus);
router.get('/stats', getStats);

// Google OAuth 2.0 Web Server Flow Routes
router.get('/auth/google', initiateGoogleAuth);
router.get('/auth/google/callback', googleAuthCallback);

// Albums & Years Metadata
router.get('/years', getYearsList);
router.get('/albums', getAlbumsList);
router.get('/albums/:id', getAlbumDetails);
router.post('/events', createNewEvent);

// Multi-Photo & Video Upload Endpoint
router.post('/photos/upload', uploadMiddleware.array('photos', 20), uploadPhotos);

export default router;
