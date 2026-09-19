export interface UploadedFileResult {
  originalName: string;
  mimeType: string;
  size: number;
  driveFileId: string;
  webViewLink?: string;
  thumbnailLink?: string;
  status: 'success' | 'failed';
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  uploadedCount: number;
  failedCount: number;
  totalRequested: number;
  folderId?: string;
  files: UploadedFileResult[];
}

export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  googleDriveConfigured: boolean;
  folderIdConfigured: boolean;
  authMethod: 'OAuth2' | 'ServiceAccount' | 'NotConfigured' | 'DemoMode';
}
