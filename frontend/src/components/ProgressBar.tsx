import React from 'react';
import { Loader2, CloudUpload } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  totalFiles: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, totalFiles }) => {
  return (
    <div className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 space-y-3 shadow-xl">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center space-x-2 text-sky-400 font-semibold">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Uploading {totalFiles} photo{totalFiles > 1 ? 's' : ''} to Google Drive...</span>
        </div>
        <span className="font-extrabold text-white font-display text-base">
          {progress}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <div
          className="h-full bg-gradient-to-r from-sky-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-300 ease-out shadow-sm shadow-sky-500/50"
          style={{ width: `${Math.max(5, progress)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1">
        <span className="flex items-center gap-1">
          <CloudUpload className="w-3.5 h-3.5 text-sky-400" /> Secure SSL Stream Transfer
        </span>
        <span>Please do not close this browser window</span>
      </div>
    </div>
  );
};
