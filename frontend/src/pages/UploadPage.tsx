import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Dropzone } from '../components/Dropzone';
import { MediaPreviewGrid } from '../components/MediaPreviewGrid';
import { ConfirmModal } from '../components/ConfirmModal';
import { ProgressBar } from '../components/ProgressBar';
import { SuccessCard } from '../components/SuccessCard';
import { ErrorBanner } from '../components/ErrorBanner';
import { SelectedMedia } from '../types';
import { fetchYears, fetchAlbums, createEvent, uploadMediaFiles } from '../services/api';
import { Calendar, Layers, PlusCircle, Upload, MapPin, AlignLeft, CheckCircle2 } from 'lucide-react';

export const UploadPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const yearQueryParam = searchParams.get('year');
  const eventQueryParam = searchParams.get('event');

  const [years, setYears] = useState<number[]>([2027, 2026, 2025, 2024]);
  const [selectedYear, setSelectedYear] = useState<number>(
    yearQueryParam ? parseInt(yearQueryParam, 10) : 2026
  );

  const [eventsList, setEventsList] = useState<Array<{ id: string; title: string }>>([]);
  const [selectedEventTitle, setSelectedEventTitle] = useState<string>(
    eventQueryParam ? decodeURIComponent(eventQueryParam) : 'Annadanam Event 2026'
  );
  const [isCreatingCustomEvent, setIsCreatingCustomEvent] = useState<boolean>(false);
  const [customEventName, setCustomEventName] = useState<string>('');

  const [eventDate, setEventDate] = useState<string>('');
  const [location, setLocation] = useState<string>('Vissannapeta');
  const [description, setDescription] = useState<string>('');

  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [googleDriveFolderUrl, setGoogleDriveFolderUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchYears().then((data) => setYears(data));
  }, []);

  useEffect(() => {
    fetchAlbums(selectedYear).then((albums) => {
      const formatted = albums.map((a) => ({ id: a.id, title: a.title }));
      setEventsList(formatted);
      if (eventQueryParam) {
        setSelectedEventTitle(decodeURIComponent(eventQueryParam));
      } else if (formatted.length > 0) {
        setSelectedEventTitle(formatted[0].title);
      }
    });
  }, [selectedYear, eventQueryParam]);

  const handleFilesSelected = (files: File[]) => {
    setErrorMessage(null);
    setUploadSuccess(false);

    const newMediaItems: SelectedMedia[] = files.map((file) => {
      const isVideo = file.type.startsWith('video/');
      return {
        id: Math.random().toString(36).substring(2, 11),
        file,
        name: file.name,
        size: file.size,
        formattedSize: formatFileSize(file.size),
        type: file.type,
        isVideo,
        previewUrl: isVideo ? '' : URL.createObjectURL(file),
        status: 'idle',
        progress: 0,
      };
    });

    setSelectedMedia((prev) => {
      const existingKeys = new Set(prev.map((m) => `${m.name}_${m.size}`));
      const uniqueNew = newMediaItems.filter((m) => !existingKeys.has(`${m.name}_${m.size}`));
      return [...prev, ...uniqueNew];
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleRemoveMedia = (id: string) => {
    setSelectedMedia((prev) => {
      const item = prev.find((m) => m.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((m) => m.id !== id);
    });
  };

  const handleClearAll = () => {
    selectedMedia.forEach((m) => {
      if (m.previewUrl) URL.revokeObjectURL(m.previewUrl);
    });
    setSelectedMedia([]);
    setErrorMessage(null);
    setUploadSuccess(false);
  };

  const handleCreateEvent = async () => {
    if (!customEventName.trim()) return;
    try {
      const newAlbum = await createEvent({
        year: selectedYear,
        title: customEventName.trim(),
        location,
        description,
      });

      setEventsList((prev) => [{ id: newAlbum.id, title: newAlbum.title }, ...prev]);
      setSelectedEventTitle(newAlbum.title);
      setIsCreatingCustomEvent(false);
      setCustomEventName('');
    } catch (err) {
      console.error('Failed creating event:', err);
    }
  };

  const executeUpload = async () => {
    if (selectedMedia.length === 0 || isUploading) return;

    const finalEventName = isCreatingCustomEvent && customEventName ? customEventName : selectedEventTitle;

    setIsUploading(true);
    setUploadProgress(5);
    setErrorMessage(null);

    setSelectedMedia((prev) =>
      prev.map((m) => ({ ...m, status: 'uploading', progress: 10 }))
    );

    try {
      const rawFiles = selectedMedia.map((m) => m.file);

      const response = await uploadMediaFiles(
        rawFiles,
        selectedYear,
        finalEventName,
        eventDate,
        location,
        description,
        (percent) => {
          setUploadProgress(percent);
          setSelectedMedia((prev) => prev.map((m) => ({ ...m, progress: percent })));
        }
      );

      setUploadProgress(100);

      if (response.success) {
        setUploadSuccess(true);
        if (response.folderUrl) setGoogleDriveFolderUrl(response.folderUrl);
        setSelectedMedia((prev) =>
          prev.map((m) => {
            const match = response.files.find((f) => f.originalName === m.name);
            return {
              ...m,
              status: match?.status === 'success' ? 'success' : 'error',
              driveFileId: match?.driveFileId,
              webViewLink: match?.webViewLink,
            };
          })
        );
      } else {
        setErrorMessage(response.message || 'Failed uploading files to Google Drive.');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Network error during media upload.';
      setErrorMessage(msg);
      setSelectedMedia((prev) => prev.map((m) => ({ ...m, status: 'error' })));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black font-display text-slate-900">
          Upload Photos & Videos
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Upload media directly to the designated Google Drive folder for <span className="font-bold text-sky-700">{selectedEventTitle}</span> ({selectedYear})
        </p>
      </div>

      {/* Main Form Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
        
        {uploadSuccess ? (
          <SuccessCard
            uploadedPhotos={selectedMedia as any}
            onUploadMore={handleClearAll}
            driveFolderUrl={googleDriveFolderUrl}
          />
        ) : (
          <>
            {/* Form Inputs: Year & Event Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Select Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 font-display flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-sky-600" /> A. Select Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  disabled={isUploading}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {years.map((yr) => (
                    <option key={yr} value={yr}>
                      Year {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Event */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 font-display flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-500" /> B. Select Event
                  </span>
                  {!isCreatingCustomEvent && (
                    <button
                      type="button"
                      onClick={() => setIsCreatingCustomEvent(true)}
                      className="text-sky-600 hover:text-sky-700 text-[11px] font-bold flex items-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> + New Event
                    </button>
                  )}
                </label>

                {isCreatingCustomEvent ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter new event title..."
                      value={customEventName}
                      onChange={(e) => setCustomEventName(e.target.value)}
                      className="flex-1 py-2 px-3 rounded-xl border border-sky-300 bg-sky-50 text-sm text-slate-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCreateEvent}
                      className="px-3 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreatingCustomEvent(false)}
                      className="px-2.5 py-2 bg-slate-200 text-slate-600 text-xs rounded-xl font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <select
                    value={selectedEventTitle}
                    onChange={(e) => setSelectedEventTitle(e.target.value)}
                    disabled={isUploading}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    {eventsList.map((evt) => (
                      <option key={evt.id} value={evt.title}>
                        {evt.title}
                      </option>
                    ))}
                    {!eventsList.some((e) => e.title === selectedEventTitle) && (
                      <option value={selectedEventTitle}>{selectedEventTitle}</option>
                    )}
                  </select>
                )}
              </div>

            </div>

            {/* Event Target Drive Notice */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 text-xs text-sky-900 flex items-center justify-between gap-2 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Target Folder: <strong>{selectedEventTitle} ({selectedYear})</strong></span>
              </div>
              <span className="text-[10px] text-sky-700 bg-sky-200/60 px-2 py-0.5 rounded-md font-bold">
                Authorized Drive
              </span>
            </div>

            {/* Optional Event Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="space-y-1">
                <label className="text-slate-600 font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Vissannapeta"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-semibold flex items-center gap-1">
                  <AlignLeft className="w-3.5 h-3.5 text-slate-400" /> Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Short event note..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs"
                />
              </div>
            </div>

            {/* Media Dropzone */}
            <Dropzone
              onFilesSelected={handleFilesSelected}
              isUploading={isUploading}
              maxFilesAllowed={20}
            />

            {/* Media Previews */}
            <MediaPreviewGrid
              mediaList={selectedMedia}
              onRemoveMedia={handleRemoveMedia}
              onClearAll={handleClearAll}
              isUploading={isUploading}
            />

            {/* Upload Progress Bar */}
            {isUploading && (
              <ProgressBar progress={uploadProgress} totalFiles={selectedMedia.length} />
            )}

            {/* Error Banner */}
            {errorMessage && (
              <ErrorBanner message={errorMessage} onRetry={executeUpload} />
            )}

            {/* Primary Action Button */}
            {selectedMedia.length > 0 && !isUploading && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full py-4 px-8 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-base font-display tracking-wide shadow-lg shadow-sky-600/25 transition-all active:scale-98 flex items-center justify-center gap-3"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload {selectedMedia.length} Media Files</span>
                </button>
              </div>
            )}
          </>
        )}

      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={executeUpload}
        year={selectedYear}
        eventTitle={isCreatingCustomEvent ? customEventName : selectedEventTitle}
        location={location}
        mediaList={selectedMedia}
      />
    </div>
  );
};
