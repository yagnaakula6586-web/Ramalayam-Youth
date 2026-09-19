import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Video as VideoIcon, AlertCircle } from 'lucide-react';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
  maxFilesAllowed?: number;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesSelected,
  isUploading,
  maxFilesAllowed = 20,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

  const validateAndPassFiles = (fileList: FileList | File[]) => {
    setValidationError(null);
    const filesArray = Array.from(fileList);

    if (filesArray.length === 0) return;

    if (filesArray.length > maxFilesAllowed) {
      setValidationError(`You can select up to ${maxFilesAllowed} media files per batch.`);
      return;
    }

    const invalidFiles = filesArray.filter(
      (file) =>
        !ALLOWED_PHOTO_TYPES.includes(file.type.toLowerCase()) &&
        !ALLOWED_VIDEO_TYPES.includes(file.type.toLowerCase())
    );

    if (invalidFiles.length > 0) {
      setValidationError(
        `Unsupported file type (${invalidFiles[0].name}). Allowed formats: Photos (JPG, JPEG, PNG, WEBP) & Videos (MP4, MOV, WEBM).`
      );
      return;
    }

    const oversizedFiles = filesArray.filter((file) => file.size > 100 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setValidationError(
        `File size limit exceeded for ${oversizedFiles[0].name}. Maximum size per file is 100 MB.`
      );
      return;
    }

    onFilesSelected(filesArray);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (isUploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndPassFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Hidden File Inputs */}
      <input
        ref={photoInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={(e) => e.target.files && validateAndPassFiles(e.target.files)}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        multiple
        accept=".mp4,.mov,.webm,video/mp4,video/quicktime,video/webm"
        onChange={(e) => e.target.files && validateAndPassFiles(e.target.files)}
        className="hidden"
      />
      <input
        ref={mediaInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.webm,image/*,video/*"
        onChange={(e) => e.target.files && validateAndPassFiles(e.target.files)}
        className="hidden"
      />

      {/* Two Large Touch Buttons for Mobile Choice */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => !isUploading && photoInputRef.current?.click()}
          disabled={isUploading}
          className="p-4 sm:p-5 rounded-2xl bg-sky-50 border-2 border-sky-200 hover:border-sky-400 text-sky-800 flex flex-col items-center justify-center space-y-2 transition-all active:scale-98 shadow-sm group"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20 group-hover:scale-110 transition-transform">
            <ImageIcon className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold font-display">Select Photos</span>
          <span className="text-[11px] text-sky-600">JPG, PNG, WEBP</span>
        </button>

        <button
          type="button"
          onClick={() => !isUploading && videoInputRef.current?.click()}
          disabled={isUploading}
          className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 hover:border-amber-400 text-amber-900 flex flex-col items-center justify-center space-y-2 transition-all active:scale-98 shadow-sm group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
            <VideoIcon className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold font-display">Select Videos</span>
          <span className="text-[11px] text-amber-700">MP4, MOV, WEBM</span>
        </button>
      </div>

      {/* Drag & Drop Combined Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && mediaInputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-3xl p-6 sm:p-10 text-center transition-all duration-200 ${
          isDragActive
            ? 'border-sky-500 bg-sky-50 shadow-lg'
            : 'border-slate-300 hover:border-sky-400 bg-slate-50/50 hover:bg-sky-50/30'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white text-sky-600 shadow-md border border-slate-200 flex items-center justify-center">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm sm:text-base font-bold text-slate-800 font-display">
              {isDragActive ? 'Drop your files here!' : 'Or drag & drop photos and videos together'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Select multiple files directly from your phone gallery or computer
            </p>
          </div>
        </div>
      </div>

      {validationError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
};
