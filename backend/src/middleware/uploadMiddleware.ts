import multer from 'multer';
import { Request } from 'express';

// Memory storage for direct stream transfer to Google Drive
const storage = multer.memoryStorage();

// Allowed MIME types for Photos & Videos
const ALLOWED_MIME_TYPES = [
  // Photos
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  // Videos
  'video/mp4',
  'video/quicktime', // .mov
  'video/webm',
];

// Max file size: 100 MB per file (photos & videos)
const MAX_FILE_SIZE = 100 * 1024 * 1024;

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid format (${file.mimetype}). Allowed formats: Photos (JPG, JPEG, PNG, WEBP) & Videos (MP4, MOV, WEBM).`));
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 20, // Max 20 media files per request batch
  },
  fileFilter,
});
