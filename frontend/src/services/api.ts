import axios from 'axios';
import { EventAlbum, MediaItem, PlatformStats, UploadBatchResponse } from '../types';

let rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
if (rawBaseUrl.endsWith('/')) {
  rawBaseUrl = rawBaseUrl.slice(0, -1);
}
if (!rawBaseUrl.endsWith('/api')) {
  rawBaseUrl = `${rawBaseUrl}/api`;
}
const API_BASE_URL = rawBaseUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

export async function fetchPlatformStats(): Promise<PlatformStats> {
  try {
    const res = await api.get('/stats');
    return res.data;
  } catch (error) {
    console.warn('Failed fetching stats, returning fallback:', error);
    return { totalAlbums: 5, totalPhotos: 129, totalVideos: 22 };
  }
}

export async function fetchYears(): Promise<number[]> {
  try {
    const res = await api.get('/years');
    return res.data.years || [2027, 2026, 2025, 2024];
  } catch (error) {
    return [2027, 2026, 2025, 2024];
  }
}

export async function fetchAlbums(year?: number, search?: string): Promise<EventAlbum[]> {
  try {
    const res = await api.get('/albums', { params: { year, search } });
    return res.data.albums || [];
  } catch (error) {
    console.warn('Failed fetching albums:', error);
    return [];
  }
}

export async function fetchAlbumDetails(id: string): Promise<{ album: EventAlbum; mediaItems: MediaItem[] }> {
  const res = await api.get(`/albums/${id}`);
  return res.data;
}

export async function createEvent(data: {
  year: number;
  title: string;
  description?: string;
  location?: string;
  event_date?: string;
}): Promise<EventAlbum> {
  const res = await api.post('/events', data);
  return res.data.album;
}

export async function uploadMediaFiles(
  files: File[],
  year: number,
  eventName: string,
  eventDate?: string,
  location?: string,
  description?: string,
  onProgress?: (percent: number) => void
): Promise<UploadBatchResponse> {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('photos', file);
  });

  formData.append('year', year.toString());
  formData.append('eventName', eventName);
  if (eventDate) formData.append('eventDate', eventDate);
  if (location) formData.append('location', location);
  if (description) formData.append('description', description);

  const response = await api.post<UploadBatchResponse>('/photos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });

  return response.data;
}
