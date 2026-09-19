import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, ExternalLink, Images, Film, MapPin } from 'lucide-react';
import { EventAlbum } from '../types';

interface AlbumCardProps {
  album: EventAlbum;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  const fallbackThumbnail =
    album.thumbnail_url ||
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80';

  const driveUrl =
    album.drive_folder_url ||
    `https://drive.google.com/drive/folders/${album.drive_folder_id || '15nExvFfyxGIIXKlfQQslmLX4xVY-MxWC'}`;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-200 flex flex-col group">
      {/* Image Thumbnail */}
      <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
        <img
          src={fallbackThumbnail}
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Year Pill Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white font-extrabold font-display text-xs px-3 py-1 rounded-xl border border-white/20 shadow-md">
          {album.year}
        </div>

        {/* Media Counts Badge */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-md border border-slate-200 flex items-center gap-2">
          <span className="flex items-center gap-1 text-sky-700">
            <Images className="w-3.5 h-3.5" /> {album.photo_count}
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1 text-amber-700">
            <Film className="w-3.5 h-3.5" /> {album.video_count}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 line-clamp-1 group-hover:text-sky-700 transition-colors">
            {album.title}
          </h3>

          {album.description && (
            <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
              {album.description}
            </p>
          )}

          {album.location && (
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{album.location}</span>
            </div>
          )}
        </div>

        {/* Required 2 Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          {/* Button 1: Upload Photos & Videos */}
          <Link
            to={`/upload?year=${album.year}&event=${encodeURIComponent(album.title)}`}
            className="w-full py-2.5 px-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-[11px] sm:text-xs transition-colors flex items-center justify-center gap-1 shadow-sm text-center"
          >
            <Upload className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Upload Photos & Videos</span>
          </Link>

          {/* Button 2: View Album (Opens Google Drive folder in new tab) */}
          <a
            href={driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-[11px] sm:text-xs transition-colors flex items-center justify-center gap-1 text-center border border-slate-200"
          >
            <span className="truncate">View Album</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-500" />
          </a>
        </div>
      </div>
    </div>
  );
};
