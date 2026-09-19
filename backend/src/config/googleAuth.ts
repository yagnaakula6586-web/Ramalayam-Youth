import { google } from 'googleapis';
import path from 'path';
import dotenv from 'dotenv';

// Load .env explicitly from backend directory regardless of working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

export interface GoogleAuthConfig {
  folderId: string;
  isConfigured: boolean;
  authMethod: 'OAuth2' | 'ServiceAccount' | 'NotConfigured';
}

export function getGoogleDriveConfig(): GoogleAuthConfig {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
  
  const hasOAuth = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN
  );

  const hasServiceAccount = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  );

  let authMethod: 'OAuth2' | 'ServiceAccount' | 'NotConfigured' = 'NotConfigured';
  if (hasOAuth) authMethod = 'OAuth2';
  else if (hasServiceAccount) authMethod = 'ServiceAccount';

  return {
    folderId,
    isConfigured: (hasOAuth || hasServiceAccount) && Boolean(folderId),
    authMethod,
  };
}

export function getAuthUrl(customRedirectUri?: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = customRedirectUri || process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5001/api/auth/google/callback';

  if (!clientId || !clientSecret) {
    throw new Error(`GOOGLE_CLIENT_ID (${clientId ? 'FOUND' : 'MISSING'}) and GOOGLE_CLIENT_SECRET (${clientSecret ? 'FOUND' : 'MISSING'}) must be configured in environment variables.`);
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });
}

export async function exchangeCodeForTokens(code: string, customRedirectUri?: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = customRedirectUri || process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5001/api/auth/google/callback';

  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured in environment variables.');
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export function createGoogleDriveClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (clientId && clientSecret && refreshToken) {
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5001/api/auth/google/callback'
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    return google.drive({ version: 'v3', auth: oauth2Client });
  }

  if (serviceAccountEmail && privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');

    const auth = new google.auth.JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    return google.drive({ version: 'v3', auth });
  }

  return null;
}
