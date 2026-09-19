import React from 'react';
import { Heart, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 mt-16 text-xs text-slate-500 shadow-inner">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <p className="font-bold text-slate-900 font-display text-sm">
            © 2026 Ramalayam Youth. All rights reserved.
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
            Serving Vissannapeta Community with Pride & Unity.
          </p>
        </div>

        <div className="flex flex-col items-center sm:items-end space-y-1 text-slate-700 text-xs font-sans">
          <div className="flex items-center space-x-1 font-semibold">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
            <span>for Ramalayam Youth Vissannapeta</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 font-bold bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl">
            <span>Designed & Developed by <span className="text-sky-700">Akula Yagna - 2026</span></span>
            <span className="text-slate-300">·</span>
            <a
              href="tel:8328418521"
              className="flex items-center gap-1 text-slate-800 hover:text-sky-700 font-bold transition-colors"
            >
              <Phone className="w-3 h-3 text-sky-600" />
              <span>8328418521</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
