import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Upload, Images, Info, Home } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Upload', path: '/upload', icon: Upload },
    { name: 'Albums', path: '/albums', icon: Images },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        
        {/* Logo and Brand Name */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-amber-500 p-0.5 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-sky-600 rounded-[10px] flex items-center justify-center text-white">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold font-display tracking-tight text-slate-900">
                RAMALAYAM YOUTH
              </span>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded-full uppercase">
                Vissannapeta
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Together We Grow, Serve and Make a Difference.
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <Link
            to="/upload"
            className="ml-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/25 transition-all flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Media</span>
          </Link>
        </nav>

      </div>
    </header>
  );
};
