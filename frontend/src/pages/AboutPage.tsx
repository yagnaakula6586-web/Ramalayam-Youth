import React from 'react';
import { Camera, Heart, MapPin, Users, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Hero Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-600/30">
          <Camera className="w-8 h-8" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900">
          RAMALAYAM YOUTH <span className="text-sky-600">Vissannapeta</span>
        </h1>

        <div className="inline-block px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold font-display shadow-sm">
          "Together We Grow, Serve and Make a Difference."
        </div>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-sans">
          RAMALAYAM YOUTH is a community youth organization based in Vissannapeta dedicated to bringing together the vibrant youth of our village for social service, festival celebrations, sports events, and cultural heritage preservation.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-display text-slate-900">Youth Unity</h3>
          <p className="text-xs text-slate-500">
            Fostering strong bonds among the youth of Vissannapeta through sports tournaments, gatherings, and annual meetups.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-display text-slate-900">Community Service</h3>
          <p className="text-xs text-slate-500">
            Organizing Annadanam food distribution, village clean-up drives, health awareness camps, and supporting families in need.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-display text-slate-900">Cultural Pride</h3>
          <p className="text-xs text-slate-500">
            Celebrating traditional Uragimpu (ఉరేగింపు) grand processions and local temple festivals with energy and devotion.
          </p>
        </div>
      </div>

      {/* Contact & Location Info */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-xl font-bold font-display flex items-center gap-2">
          <MapPin className="w-5 h-5 text-sky-400" /> Location & Contact
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div>
            <p className="font-bold text-white text-sm">Organization Headquarters</p>
            <p className="mt-1">Ramalayam Youth Center, Main Road</p>
            <p>Vissannapeta, NTR District, Andhra Pradesh</p>
          </div>
          <div>
            <p className="font-bold text-white text-sm">Digital Storage & Security</p>
            <p className="mt-1">Central Google Drive Archive System</p>
            <p>256-Bit SSL Direct Media Upload Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
};
