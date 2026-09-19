import { Request, Response, NextFunction } from 'express';
import { uploadMediaToGoogleDrive } from '../services/googleDriveService';
import { getGoogleDriveConfig, getAuthUrl, exchangeCodeForTokens } from '../config/googleAuth';
import {
  getAllYears,
  getAlbums,
  getAlbumById,
  getAlbumByYearAndTitle,
  createAlbum,
  saveMediaItem,
  getMediaItemsByEventId,
  getPlatformStats,
} from '../db/database';
import { HealthStatus } from '../types';

/**
 * GET /api/auth/google
 * Initiates Google OAuth 2.0 Authorization Flow
 */
export function initiateGoogleAuth(_req: Request, res: Response) {
  try {
    const authUrl = getAuthUrl();
    return res.redirect(authUrl);
  } catch (err: any) {
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <body style="font-family: system-ui; padding: 2rem; background: #0f172a; color: #f8fafc;">
          <h2 style="color: #f43f5e;">Google OAuth Setup Error</h2>
          <p>${err.message}</p>
          <p>Please ensure <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code> are added to your backend environment variables.</p>
        </body>
      </html>
    `);
  }
}

/**
 * GET /api/auth/google/callback
 * Handles OAuth callback code from Google and displays acquired refresh token
 */
export async function googleAuthCallback(req: Request, res: Response) {
  const code = req.query.code as string;
  const error = req.query.error as string;

  if (error) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <body style="font-family: system-ui; padding: 2rem; background: #0f172a; color: #f8fafc;">
          <h2 style="color: #f43f5e;">Authorization Denied or Failed</h2>
          <p>Google OAuth Error: ${error}</p>
        </body>
      </html>
    `);
  }

  if (!code) {
    return res.status(400).send('Authorization code missing in callback request.');
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const refreshToken = tokens.refresh_token;

    console.log('\n======================================================');
    console.log('🔑 ACQUIRED GOOGLE REFRESH TOKEN:');
    console.log(refreshToken || '(No refresh_token returned - user had already authorized)');
    console.log('======================================================\n');

    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>RAMALAYAM YOUTH - OAuth Authorization Successful</title></head>
        <body style="font-family: system-ui; padding: 2rem; background: #0f172a; color: #f8fafc; max-width: 700px; margin: 0 auto; line-height: 1.6;">
          <h1 style="color: #38bdf8;">🎉 Google OAuth 2.0 Authorization Successful!</h1>
          <p>Your Google Account has authorized <strong>RAMALAYAM YOUTH Photo & Video Uploader</strong>.</p>
          
          ${
            refreshToken
              ? `
            <div style="background: #1e293b; padding: 1.5rem; border-radius: 12px; border: 1px solid #334155; margin: 1.5rem 0;">
              <h3 style="color: #4ade80; margin-top: 0;">Your Google Refresh Token:</h3>
              <textarea readonly style="width: 100%; height: 80px; background: #090d16; color: #facc15; border: 1px solid #475569; padding: 10px; border-radius: 8px; font-family: monospace; font-size: 13px;">${refreshToken}</textarea>
              <p style="font-size: 13px; color: #94a3b8; margin-bottom: 0;">Copy this token and add it to your <strong>Render Dashboard Environment Variables</strong> under <code>GOOGLE_REFRESH_TOKEN</code>.</p>
            </div>
            `
              : `
            <div style="background: #1e293b; padding: 1.5rem; border-radius: 12px; border: 1px solid #334155; margin: 1.5rem 0;">
              <p style="color: #4ade80; font-weight: bold;">Authorization confirmed!</p>
              <p style="font-size: 13px; color: #94a3b8;">If you need a new refresh token string, go to your Google Account permissions, revoke access for this app, and visit <code>/api/auth/google</code> again.</p>
            </div>
            `
          }

          <h3 style="color: #e2e8f0;">Next Steps for Render Deployment:</h3>
          <ol style="color: #cbd5e1; padding-left: 1.2rem;">
            <li>Go to <a href="https://dashboard.render.com" target="_blank" style="color: #38bdf8;">Render Dashboard</a> > Select your Backend Service > <strong>Environment</strong> tab.</li>
            <li>Add environment variable: <code>GOOGLE_REFRESH_TOKEN</code> = <em>(the token above)</em></li>
            <li>Click <strong>Save Changes</strong> (Render will restart your backend automatically).</li>
          </ol>
        </body>
      </html>
    `);
  } catch (err: any) {
    console.error('[OAuth Callback Error]:', err);
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <body style="font-family: system-ui; padding: 2rem; background: #0f172a; color: #f8fafc;">
          <h2 style="color: #f43f5e;">Token Exchange Failed</h2>
          <p>${err.message}</p>
        </body>
      </html>
    `);
  }
}

/**
 * POST /api/photos/upload
 * Multi-photo and video upload endpoint
 */
export async function uploadPhotos(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No photo or video files were provided for upload.',
        uploadedCount: 0,
        failedCount: 0,
        totalRequested: 0,
        files: [],
      });
    }

    const year = req.body.year ? parseInt(req.body.year, 10) : 2026;
    let eventTitle = req.body.eventName || req.body.eventTitle || 'Annadanam Event 2026';
    const eventDate = req.body.eventDate || '';
    const location = req.body.location || 'Vissannapeta';
    const description = req.body.description || '';

    let album = getAlbumByYearAndTitle(year, eventTitle);
    const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '15nExvFfyxGIIXKlfQQslmLX4xVY-MxWC';

    if (!album) {
      const albumId = `album_${year}_${eventTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      album = createAlbum({
        id: albumId,
        year,
        title: eventTitle,
        description,
        event_date: eventDate,
        location,
        drive_folder_id: rootFolderId,
        drive_folder_url: `https://drive.google.com/drive/folders/${rootFolderId}`,
      });
    }

    const results: any[] = [];
    const config = getGoogleDriveConfig();
    const eventDriveFolderId = album.drive_folder_id || config.folderId;

    for (const file of files) {
      const uploadResult = await uploadMediaToGoogleDrive(
        file.buffer,
        file.originalname,
        file.mimetype,
        file.size,
        year,
        eventTitle,
        eventDriveFolderId
      );

      if (uploadResult.status === 'success') {
        saveMediaItem({
          id: `media_${Math.random().toString(36).substring(2, 11)}`,
          event_id: album.id,
          original_name: uploadResult.originalName,
          mime_type: file.mimetype,
          media_type: uploadResult.mediaType,
          size: file.size,
          drive_file_id: uploadResult.driveFileId,
          web_view_link: uploadResult.webViewLink,
          thumbnail_url: uploadResult.thumbnailLink,
        });
      }

      results.push(uploadResult);
    }

    const uploadedCount = results.filter((r) => r.status === 'success').length;
    const failedCount = results.filter((r) => r.status === 'failed').length;

    if (uploadedCount === 0) {
      const firstError = results[0]?.error || 'Google Drive API upload failed.';
      console.error(`[Upload Controller Error] All ${files.length} uploads failed:`, firstError);

      return res.status(500).json({
        success: false,
        message: firstError,
        uploadedCount: 0,
        failedCount,
        totalRequested: files.length,
        albumId: album.id,
        folderId: eventDriveFolderId,
        files: results,
      });
    }

    const isAllSuccess = failedCount === 0;
    const isPartialSuccess = uploadedCount > 0 && failedCount > 0;

    let message = `Your photos and videos have been uploaded successfully to ${album.title}!`;
    if (isPartialSuccess) {
      message = `${uploadedCount} file(s) uploaded successfully to Google Drive, but ${failedCount} file(s) failed.`;
    }

    return res.status(200).json({
      success: true,
      message,
      uploadedCount,
      failedCount,
      totalRequested: files.length,
      albumId: album.id,
      folderId: album.drive_folder_id || config.folderId,
      folderUrl: album.drive_folder_url || `https://drive.google.com/drive/folders/${config.folderId}`,
      files: results,
    });
  } catch (error: any) {
    next(error);
  }
}

export function getAlbumsList(req: Request, res: Response) {
  const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
  const search = req.query.search as string | undefined;

  const albums = getAlbums(year, search);
  return res.status(200).json({ success: true, albums });
}

export function getAlbumDetails(req: Request, res: Response) {
  const id = req.params.id;
  const album = getAlbumById(id);

  if (!album) {
    return res.status(404).json({ success: false, message: 'Album not found' });
  }

  const mediaItems = getMediaItemsByEventId(id);
  return res.status(200).json({ success: true, album, mediaItems });
}

export function getYearsList(_req: Request, res: Response) {
  const years = getAllYears();
  return res.status(200).json({ success: true, years });
}

export function getStats(_req: Request, res: Response) {
  const stats = getPlatformStats();
  return res.status(200).json({ success: true, ...stats });
}

export function createNewEvent(req: Request, res: Response) {
  const { year, title, description, location, event_date, drive_folder_id } = req.body;

  if (!year || !title) {
    return res.status(400).json({ success: false, message: 'Year and Event Title are required.' });
  }

  const existing = getAlbumByYearAndTitle(year, title);
  if (existing) {
    return res.status(200).json({ success: true, album: existing });
  }

  const folderId = drive_folder_id || process.env.GOOGLE_DRIVE_FOLDER_ID || '15nExvFfyxGIIXKlfQQslmLX4xVY-MxWC';
  const newAlbum = createAlbum({
    id: `album_${year}_${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    year: parseInt(year, 10),
    title,
    description: description || '',
    location: location || 'Vissannapeta',
    event_date: event_date || '',
    drive_folder_id: folderId,
    drive_folder_url: `https://drive.google.com/drive/folders/${folderId}`,
  });

  return res.status(201).json({ success: true, album: newAlbum });
}

export function getHealth(_req: Request, res: Response) {
  const config = getGoogleDriveConfig();

  const healthPayload: HealthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    googleDriveConfigured: config.isConfigured,
    folderIdConfigured: Boolean(config.folderId),
    authMethod: config.authMethod,
  };

  return res.status(200).json(healthPayload);
}

export function getUploadStatus(_req: Request, res: Response) {
  const config = getGoogleDriveConfig();

  return res.status(200).json({
    service: 'RAMALAYAM YOUTH Photo & Video Sharing API',
    organization: 'Ramalayam Youth Vissannapeta',
    allowedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP', 'MP4', 'MOV', 'WEBM'],
    maxFileSizeMB: 100,
    maxBatchFiles: 20,
    googleDriveConfigured: config.isConfigured,
    destinationFolderId: config.folderId ? `${config.folderId.substring(0, 6)}...` : 'Not Configured',
    authMethod: config.authMethod,
  });
}
