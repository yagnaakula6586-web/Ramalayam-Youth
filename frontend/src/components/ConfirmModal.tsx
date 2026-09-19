import React from 'react';
import { Upload, X, Calendar, MapPin, Images, Film, ShieldCheck } from 'lucide-react';
import { SelectedMedia } from '../types';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  year: number;
  eventTitle: string;
  location?: string;
  mediaList: SelectedMedia[];
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  year,
  eventTitle,
  location = 'Vissannapeta',
  mediaList,
}) => {
  if (!isOpen) return null;

  const photoCount = mediaList.filter((m) => !m.isVideo).length;
  const videoCount = mediaList.filter((m) => m.isVideo).length;
  const totalFiles = mediaList.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 duration-200 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-2">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-display text-slate-900">
            Confirm Upload Request
          </h3>
          <p className="text-xs text-slate-500">
            Review your collection details before uploading to Google Drive
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-sm text-slate-700">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-600" /> Selected Year
            </span>
            <span className="font-extrabold text-slate-900 font-display text-base bg-sky-100 px-2.5 py-0.5 rounded-lg border border-sky-200">
              {year}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" /> Event Name
            </span>
            <span className="font-bold text-slate-900 truncate max-w-[180px]" title={eventTitle}>
              {eventTitle}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Images className="w-4 h-4 text-emerald-600" /> Photos Selected
            </span>
            <span className="font-bold text-slate-900">{photoCount} photo{photoCount !== 1 ? 's' : ''}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Film className="w-4 h-4 text-purple-600" /> Videos Selected
            </span>
            <span className="font-bold text-slate-900">{videoCount} video{videoCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center space-x-2 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-medium">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Files will be uploaded directly to Ramalayam Youth Google Drive folder.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm shadow-lg shadow-sky-600/30 transition-all"
          >
            Upload {totalFiles} File{totalFiles !== 1 ? 's' : ''}
          </button>
        </div>

      </div>
    </div>
  );
};
