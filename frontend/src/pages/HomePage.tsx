import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Images, Sparkles, Calendar, Layers } from 'lucide-react';
import { AlbumCard } from '../components/AlbumCard';
import { EventAlbum, PlatformStats } from '../types';
import { fetchAlbums, fetchPlatformStats, fetchYears } from '../services/api';

export const HomePage: React.FC = () => {
  const [recentAlbums, setRecentAlbums] = useState<EventAlbum[]>([]);
  const [stats, setStats] = useState<PlatformStats>({ totalAlbums: 2, totalPhotos: 83, totalVideos: 18 });
  const [availableYears, setAvailableYears] = useState<number[]>([2026]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [albumsData, statsData, yearsData] = await Promise.all([
          fetchAlbums(),
          fetchPlatformStats(),
          fetchYears(),
        ]);
        setRecentAlbums(albumsData);
        setStats(statsData);
        setAvailableYears(yearsData);
      } catch (err) {
        console.warn('Load data error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-8 sm:space-y-12 pb-12">
      {/* Hero Welcome Banner */}
      <section className="bg-gradient-to-b from-sky-500/10 via-sky-500/5 to-transparent pt-8 pb-12 px-4 rounded-3xl text-center space-y-6 max-w-4xl mx-auto border border-sky-100">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>RAMALAYAM YOUTH Vissannapeta</span>
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-black leading-tight">
            Welcome to <span className="text-black">RAMALAYAM YOUTH</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
            Share your memorable moments with Ramalayam Youth. Upload photos and videos, explore past events, and celebrate our community memories together.
          </p>
        </div>

        {/* Two Prominent Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/upload"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-base shadow-lg shadow-sky-600/25 transition-all transform active:scale-98 flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Photos & Videos</span>
          </Link>

          <Link
            to="/albums"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Images className="w-5 h-5 text-sky-600" />
            <span>Explore Albums</span>
          </Link>
        </div>
      </section>

      {/* Platform Statistics Counter */}
      <section className="grid grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto px-2">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl sm:text-4xl font-extrabold font-display text-sky-600">
            {stats.totalAlbums}
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">Total Albums</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl sm:text-4xl font-extrabold font-display text-amber-500">
            {stats.totalPhotos}
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">Photos Uploaded</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl sm:text-4xl font-extrabold font-display text-emerald-600">
            {stats.totalVideos}
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">Videos Uploaded</p>
        </div>
      </section>

      {/* Available Years Pills */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-600" /> Available Years
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {availableYears.map((yr) => (
            <Link
              key={yr}
              to={`/albums?year=${yr}`}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-sky-400 text-slate-800 font-bold text-xs shadow-sm hover:text-sky-700 transition-colors flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>Year {yr}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently Added Albums Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-600" /> 2026 Community Event Albums
            </h2>
            <p className="text-xs text-slate-500 font-medium">Explore Ramalayam Youth celebrations in Vissannapeta</p>
          </div>

          <Link
            to="/albums"
            className="text-xs font-bold text-sky-700 hover:text-sky-800 hover:underline"
          >
            View All ({stats.totalAlbums})
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {recentAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
