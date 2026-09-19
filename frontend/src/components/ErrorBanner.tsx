import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry }) => {
  return (
    <div className="w-full bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-200 text-sm">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-rose-500/20 rounded-xl text-rose-400 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-rose-100 font-display">Upload Interrupted</p>
          <p className="text-xs text-rose-300/90">{message}</p>
        </div>
      </div>

      <button
        onClick={onRetry}
        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Retry Upload
      </button>
    </div>
  );
};
