import { Readable } from 'stream';
import { createGoogleDriveClient, getGoogleDriveConfig } from '../config/googleAuth';
import { UploadedFileResult } from '../types';

function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

/**
 * Ensures or creates a subfolder inside a target Google Drive parent folder
 */
export async function getOrCreateDriveFolder(parentFolderId: string, folderName: string): Promise<string> {
  const driveClient = createGoogleDriveClient();
  if (!driveClient) {
    throw new Error('Google Drive API credentials are not configured in backend environment (.env).');
  }

  try {
    const query = `'${parentFolderId}' in parents and name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    const searchRes = await driveClient.files.list({
      q: query,
      fields: 'files(id, name)',
    });

    if (searchRes.data.files && searchRes.data.files.length > 0) {
      return searchRes.data.files[0].id!;
    }

    const createRes = await driveClient.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolderId],
      },
      fields: 'id',
    });

    return createRes.data.id || parentFolderId;
  } catch (err: any) {
    console.error(`[Google Drive Subfolder Error] Failed folder operation for '${folderName}':`, err.message || err);
    throw new Error(`Google Drive folder access error: ${err.message || 'Unable to access target folder'}`);
  }
}

/**
 * Fixes Multer UTF-8 filename encoding issue for international / Telugu characters
 */
function fixUtf8FileName(name: string): string {
  try {
    // If string was encoded as latin1 by multer header parser, convert to utf8
    return Buffer.from(name, 'latin1').toString('utf8');
  } catch (e) {
    return name;
  }
}

/**
 * Uploads media to Google Drive and performs post-upload verification via files.get
 * NO MOCK / NO SIMULATED FALLBACKS ALLOWED.
 */
export async function uploadMediaToGoogleDrive(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
  size: number,
  year?: number,
  eventTitle?: string,
  overrideFolderId?: string
): Promise<UploadedFileResult & { mediaType: 'photo' | 'video' }> {
  const config = getGoogleDriveConfig();
  const driveClient = createGoogleDriveClient();

  const isVideo = mimeType.startsWith('video/');
  const mediaType: 'photo' | 'video' = isVideo ? 'video' : 'photo';
  const fileName = fixUtf8FileName(originalName);

  // Validate Google Drive API client configuration
  if (!driveClient) {
    console.error('[Google Drive Service] Error: Google OAuth2 / Service Account credentials missing in backend .env');
    return {
      originalName: fileName,
      mimeType,
      mediaType,
      size,
      driveFileId: '',
      status: 'failed',
      error: 'Google Drive authentication is not configured on the server. Please set GOOGLE_CLIENT_ID & GOOGLE_REFRESH_TOKEN or GOOGLE_SERVICE_ACCOUNT_EMAIL in backend/.env.',
    };
  }

  let targetFolderId = overrideFolderId || config.folderId;

  if (!targetFolderId) {
    console.error('[Google Drive Service] Error: Destination GOOGLE_DRIVE_FOLDER_ID missing');
    return {
      originalName: fileName,
      mimeType,
      mediaType,
      size,
      driveFileId: '',
      status: 'failed',
      error: 'Destination Google Drive Folder ID is not configured on the server.',
    };
  }

  try {
    // If no explicit event folder ID override was provided, ensure year/event subfolder
    if (!overrideFolderId) {
      if (year) targetFolderId = await getOrCreateDriveFolder(targetFolderId, `${year}`);
      if (eventTitle) targetFolderId = await getOrCreateDriveFolder(targetFolderId, eventTitle);
    }

    console.log(`[Google Drive Stream Upload] Uploading '${fileName}' (${size} bytes) to Folder ID: ${targetFolderId}`);

    const fileStream = bufferToStream(fileBuffer);

    // 1. Upload Binary Media Stream to Google Drive
    const uploadRes = await driveClient.files.create({
      requestBody: {
        name: fileName,
        parents: [targetFolderId],
        mimeType: mimeType,
      },
      media: {
        mimeType: mimeType,
        body: fileStream,
      },
      fields: 'id, name, mimeType, parents, webViewLink, thumbnailLink',
    });

    const createdFile = uploadRes.data;

    if (!createdFile || !createdFile.id) {
      throw new Error('Google Drive API upload did not return a valid file ID.');
    }

    // 2. Post-Upload Verification via Google Drive API (files.get)
    console.log(`[Google Drive Verification] Verifying file ID '${createdFile.id}' via Google Drive API (files.get)...`);
    
    const verifyRes = await driveClient.files.get({
      fileId: createdFile.id,
      fields: 'id, name, mimeType, parents, webViewLink, thumbnailLink',
    });

    const verifiedFile = verifyRes.data;

    if (!verifiedFile || verifiedFile.id !== createdFile.id) {
      throw new Error(`Google Drive post-upload verification failed. File ID '${createdFile.id}' not confirmed by Drive API.`);
    }

    console.log(`✅ [Google Drive Confirmed] File '${verifiedFile.name}' (${verifiedFile.id}) verified in parent folder: ${targetFolderId}`);

    return {
      originalName: verifiedFile.name || fileName,
      mimeType: verifiedFile.mimeType || mimeType,
      mediaType,
      size,
      driveFileId: verifiedFile.id,
      webViewLink: verifiedFile.webViewLink || `https://drive.google.com/file/d/${verifiedFile.id}/view`,
      thumbnailLink: verifiedFile.thumbnailLink || undefined,
      status: 'success',
    };
  } catch (error: any) {
    const errorMsg = error.response?.data?.error_description || error.response?.data?.error?.message || error.message || 'Google Drive API upload failed';
    console.error(`❌ [Google Drive API Upload Failed] '${fileName}':`, errorMsg);

    return {
      originalName: fileName,
      mimeType,
      mediaType,
      size,
      driveFileId: '',
      status: 'failed',
      error: `Google Drive API upload failed: ${errorMsg}`,
    };
  }
}
