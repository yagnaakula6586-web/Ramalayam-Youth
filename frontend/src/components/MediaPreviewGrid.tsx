import React from 'react';
import { X, Images, Film, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { SelectedMedia } from '../types';

interface MediaPreviewGridProps {
  mediaList: SelectedMedia[];
  onRemoveMedia: (id: string) => void;
  onClearAll: () => void;
  isUploading: boolean;
}

export const MediaPreviewGrid: React.FC<MediaPreviewGridProps> = ({
  mediaList,
  onRemoveMedia,
  onClearAll,
  isUploading,
}) => {
  if (mediaList.length === 0) return null;

  const photoCount = mediaList.filter((m) => !m.isVideo).length;
  const videoCount = mediaList.filter((m) => m.isVideo).length;
  const totalBytes = mediaList.reduce((acc, m) => acc + m.size, 0);

  const formatTotalSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full space-y-3">
      {/* Header showing photo & video counts and total size */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
            Selected Media ({mediaList.length})
            <span className="text-xs font-semibold text-slate-500 font-sans">
              ({photoCount} photo{photoCount !== 1 ? 's' : ''}, {videoCount} video{videoCount !== 1 ? 's' : ''})
            </span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Total batch size: <span className="font-semibold text-slate-700">{formatTotalSize(totalBytes)}</span>
          </p>
        </div>

        {!isUploading && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Grid of Photo & Video Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
        {mediaList.map((item) => (
          <div
            key={item.id}
            className="relative group bg-slate-50 border border-slate-200 rounded-2xl p-2.5 flex items-center space-x-3 shadow-sm hover:border-sky-300 transition-all"
          >
            {/* Thumbnail preview */}
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
              {item.isVideo ? (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-amber-400">
                  <Film className="w-6 h-6" />
                </div>
              ) : (
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Status overlays */}
              {item.status === 'uploading' && (
                <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
                </div>
              )}
              {item.status === 'success' && (
                <div className="absolute inset-0 bg-emerald-950/70 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              )}
              {item.status === 'error' && (
                <div className="absolute inset-0 bg-rose-950/70 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                </div>
              )}
            </div>

            {/* Media Details */}
            <div className="flex-1 min-w-0 pr-6">
              <p className="text-xs font-semibold text-slate-800 truncate" title={item.name}>
                {item.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                    item.isVideo
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-sky-100 text-sky-800 border-sky-300'
                  }`}
                >
                  {item.isVideo ? 'VIDEO' : 'PHOTO'}
                </span>
                <span className="text-[11px] text-slate-500">{item.formattedSize}</span>
              </div>
            </div>

            {/* Individual Remove Button */}
            {!isUploading && item.status !== 'success' && (
              <button
                onClick={() => onRemoveMedia(item.id)}
                className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-slate-200 transition-colors"
                title="Remove file"
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
