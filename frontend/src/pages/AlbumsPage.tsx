import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlbumCard } from '../components/AlbumCard';
import { EventAlbum } from '../types';
import { fetchAlbums, fetchYears } from '../services/api';
import { Images, Filter, Search, Calendar } from 'lucide-react';

export const AlbumsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialYearParam = searchParams.get('year');
  const [selectedYear, setSelectedYear] = useState<string>(initialYearParam || 'all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [years, setYears] = useState<number[]>([2027, 2026, 2025, 2024]);
  const [albums, setAlbums] = useState<EventAlbum[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchYears().then((data) => setYears(data));
  }, []);

  useEffect(() => {
    async function loadAlbums() {
      setLoading(true);
      const yr = selectedYear === 'all' ? undefined : parseInt(selectedYear, 10);
      const data = await fetchAlbums(yr, searchTerm);
      setAlbums(data);
      setLoading(false);
    }
    loadAlbums();
  }, [selectedYear, searchTerm]);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900">
          Explore Our Memories
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Browse photo and video collections organized by year and event across Ramayaml Youth Vissannapeta
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Year Filter */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-sky-600 shrink-0" />
          <span className="text-xs font-bold text-slate-700 font-display">Year:</span>
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              if (e.target.value !== 'all') {
                setSearchParams({ year: e.target.value });
              } else {
                setSearchParams({});
              }
            }}
            className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="all">All Years</option>
            {years.map((yr) => (
              <option key={yr} value={yr.toString()}>
                Year {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Album Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      ) : albums.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <Images className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold font-display text-slate-800">No Albums Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No albums match the selected year or search terms. Upload photos and videos to create a new event album!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
};
