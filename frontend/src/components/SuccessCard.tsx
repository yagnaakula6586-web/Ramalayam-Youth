import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, ExternalLink, PlusCircle, ShieldCheck } from 'lucide-react';
import { SelectedMedia } from '../types';

interface SuccessCardProps {
  uploadedPhotos: SelectedMedia[];
  onUploadMore: () => void;
  driveFolderUrl?: string;
}

export const SuccessCard: React.FC<SuccessCardProps> = ({
  uploadedPhotos,
  onUploadMore,
  driveFolderUrl,
}) => {
  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#f59e0b', '#10b981', '#ffffff'],
      });
    } catch (e) {
      console.log('Confetti failed to trigger:', e);
    }
  }, []);

  return (
    <div className="w-full bg-slate-800/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl shadow-emerald-500/10 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
      {/* Icon Badge */}
      <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
        <CheckCircle className="w-10 h-10" />
      </div>

      {/* Success Message */}
      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-extrabold font-display text-white">
          Your photos and videos have been uploaded successfully to Ramalayam Youth Google Drive!
        </h3>
        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          Thank you for sharing your memorable moments with <span className="text-amber-400 font-semibold">Ramalayam Youth Vissannapeta</span>.
        </p>
      </div>

      {/* Uploaded Summary List */}
      <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-4 max-h-48 overflow-y-auto text-left space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2 mb-2 font-semibold">
          <span>Uploaded Files ({uploadedPhotos.length})</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified & Saved
          </span>
        </div>

        {uploadedPhotos.map((photo) => (
          <div key={photo.id} className="flex items-center justify-between text-xs py-1">
            <span className="text-slate-200 font-medium truncate max-w-[200px] sm:max-w-xs">
              {photo.name}
            </span>
            {photo.webViewLink ? (
              <a
                href={photo.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 font-semibold inline-flex items-center gap-1 hover:underline"
              >
                View on Drive <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-emerald-400 font-medium">Uploaded</span>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {driveFolderUrl && (
          <a
            href={driveFolderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            Open Google Drive Folder <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
        )}

        <button
          onClick={onUploadMore}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-amber-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Upload More Photos
        </button>
      </div>
    </div>
  );
};
