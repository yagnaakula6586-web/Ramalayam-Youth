import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EventAlbum, MediaItem } from '../types';
import { fetchAlbumDetails } from '../services/api';
import { ArrowLeft, ExternalLink, Images, Film, Calendar, MapPin, Play, Eye } from 'lucide-react';

export const AlbumDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<EventAlbum | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [activeMediaFilter, setActiveMediaFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        setLoading(true);
        const res = await fetchAlbumDetails(id as string);
        setAlbum(res.album);
        setMediaItems(res.mediaItems || []);
      } catch (err) {
        console.error('Failed loading album detail:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-48 mx-auto" />
        <div className="h-4 bg-slate-200 rounded-xl w-64 mx-auto" />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold font-display text-slate-800">Album Not Found</h2>
        <Link to="/albums" className="text-sky-600 font-bold text-sm hover:underline">
          Return to Albums
        </Link>
      </div>
    );
  }

  const filteredMedia = mediaItems.filter((item) => {
    if (activeMediaFilter === 'photo') return item.media_type === 'photo';
    if (activeMediaFilter === 'video') return item.media_type === 'video';
    return true;
  });

  const photoCount = mediaItems.filter((m) => m.media_type === 'photo').length || album.photo_count;
  const videoCount = mediaItems.filter((m) => m.media_type === 'video').length || album.video_count;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Back Button */}
      <Link
        to="/albums"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-sky-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Albums
      </Link>

      {/* Album Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-sky-100 text-sky-800 text-xs font-extrabold px-2.5 py-0.5 rounded-lg border border-sky-200">
                Year {album.year}
              </span>
              {album.location && (
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" /> {album.location}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-display text-slate-900">
              {album.title}
            </h1>
            {album.description && (
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">{album.description}</p>
            )}
          </div>

          {/* Action Button: Open in Google Drive */}
          {album.drive_folder_url && (
            <a
              href={album.drive_folder_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span>Open in Google Drive</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Counts & Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center space-x-3 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1 text-sky-700">
              <Images className="w-4 h-4" /> {photoCount} Photos
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-amber-600">
              <Film className="w-4 h-4" /> {videoCount} Videos
            </span>
          </div>

          {/* Filter pills */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveMediaFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeMediaFilter === 'all' ? 'bg-white text-sky-700 shadow-sm' : ''
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveMediaFilter('photo')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeMediaFilter === 'photo' ? 'bg-white text-sky-700 shadow-sm' : ''
              }`}
            >
              Photos ({photoCount})
            </button>
            <button
              onClick={() => setActiveMediaFilter('video')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeMediaFilter === 'video' ? 'bg-white text-sky-700 shadow-sm' : ''
              }`}
            >
              Videos ({videoCount})
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <Images className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No media items uploaded for this filter yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="relative group rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 aspect-square shadow-sm"
            >
              {item.media_type === 'video' ? (
                <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-3 text-white text-center">
                  <Film className="w-8 h-8 text-amber-400 mb-1" />
                  <span className="text-[11px] font-semibold line-clamp-1">{item.original_name}</span>
                  <a
                    href={item.web_view_link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-[10px] bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-slate-950" /> Play Video
                  </a>
                </div>
              ) : (
                <>
                  <img
                    src={item.thumbnail_url || item.web_view_link || 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=600&q=80'}
                    alt={item.original_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <a
                    href={item.web_view_link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1"
                  >
                    <Eye className="w-4 h-4" /> View Photo
                  </a>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
