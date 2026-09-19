import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, Images, Info } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Upload', path: '/upload', icon: Upload, isHighlight: true },
    { name: 'Albums', path: '/albums', icon: Images },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          if (item.isHighlight) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-600/30 transform active:scale-95 transition-transform border-2 border-white">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold text-sky-700 mt-1">
                  {item.name}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
                active ? 'text-sky-700 font-bold' : 'text-slate-500 font-medium hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-sky-600' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
