import React from 'react';
import { X, Images, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { SelectedMedia } from '../types';

interface FilePreviewGridProps {
  photos: SelectedMedia[];
  onRemovePhoto: (id: string) => void;
  onClearAll: () => void;
  isUploading: boolean;
}

export const FilePreviewGrid: React.FC<FilePreviewGridProps> = ({
  photos,
  onRemovePhoto,
  onClearAll,
  isUploading,
}) => {
  if (photos.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      {/* Header bar showing count and Clear All */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
            <Images className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-display">
              Selected Photos ({photos.length})
            </h4>
            <p className="text-xs text-slate-400">
              Ready to upload to Ramayaml Youth Google Drive
            </p>
          </div>
        </div>

        {!isUploading && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Grid of photo cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative group bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 flex items-center space-x-3 transition-all duration-200 hover:border-slate-600"
          >
            {/* Image Thumbnail */}
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-700/50">
              <img
                src={photo.previewUrl}
                alt={photo.name}
                className="w-full h-full object-cover"
              />
              {photo.status === 'uploading' && (
                <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
                </div>
              )}
              {photo.status === 'success' && (
                <div className="absolute inset-0 bg-emerald-950/70 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              )}
              {photo.status === 'error' && (
                <div className="absolute inset-0 bg-rose-950/70 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                </div>
              )}
            </div>

            {/* Photo Details */}
            <div className="flex-1 min-w-0 pr-6">
              <p className="text-xs font-semibold text-slate-200 truncate" title={photo.name}>
                {photo.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  {photo.type.split('/')[1] || 'IMG'}
                </span>
                <span className="text-[11px] text-slate-400">{photo.formattedSize}</span>
              </div>
            </div>

            {/* Individual Remove Button */}
            {!isUploading && photo.status !== 'success' && (
              <button
                onClick={() => onRemovePhoto(photo.id)}
                className="absolute top-2 right-2 text-slate-400 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-700/60 transition-colors"
                title="Remove photo"
                aria-label={`Remove ${photo.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
