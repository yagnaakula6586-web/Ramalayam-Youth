export interface SelectedMedia {
  id: string;
  file: File;
  name: string;
  size: number;
  formattedSize: string;
  type: string;
  isVideo: boolean;
  previewUrl: string;
  duration?: string;
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  driveFileId?: string;
  webViewLink?: string;
  errorMessage?: string;
}

export interface EventAlbum {
  id: string;
  year: number;
  title: string;
  description?: string;
  event_date?: string;
  location?: string;
  drive_folder_id?: string;
  drive_folder_url?: string;
  photo_count: number;
  video_count: number;
  thumbnail_url?: string;
  created_at?: string;
}

export interface MediaItem {
  id: string;
  event_id: string;
  original_name: string;
  mime_type: string;
  media_type: 'photo' | 'video';
  size: number;
  drive_file_id: string;
  web_view_link?: string;
  thumbnail_url?: string;
  created_at?: string;
}

export interface PlatformStats {
  totalAlbums: number;
  totalPhotos: number;
  totalVideos: number;
}

export interface UploadBatchResponse {
  success: boolean;
  message: string;
  uploadedCount: number;
  failedCount: number;
  totalRequested: number;
  albumId?: string;
  folderId?: string;
  folderUrl?: string;
  files: Array<{
    originalName: string;
    mimeType: string;
    mediaType: 'photo' | 'video';
    size: number;
    driveFileId: string;
    webViewLink?: string;
    thumbnailLink?: string;
    status: 'success' | 'failed';
    error?: string;
  }>;
}
