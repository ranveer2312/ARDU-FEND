// src/components/layouts/MainTopNav.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Plus, MessageSquare } from 'lucide-react';
import { useAuth } from '../../features/Auth/AuthContext';

const InitialsAvatar = ({ name = '', src }) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 text-gray-700 flex items-center justify-center text-xs">
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
      ) : (
        <span>{initials || '?'}</span>
      )}
    </div>
  );
};

export default function MainTopNav() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isAdmin = !!(user?.mainAdmin || String(user?.role || '').toUpperCase().includes('ADMIN'));

  const baseBtn =
    'h-9 px-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2';
  const activeBtn = 'bg-primary text-primary-foreground shadow';
  const ghostBtn =
    'text-foreground/80 hover:text-foreground hover:bg-muted/60';

  return (
    <nav className="backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/80 border-b border-border sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-full h-8 bg-primary rounded-lg flex items-center justify-center px-2">
              <span className="text-primary-foreground font-bold text-sm">ARDU</span>
            </div>
            <span className="text-lg font-bold text-foreground"></span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            <Link to="/feed" className={`${baseBtn} ${isActive('/feed') ? activeBtn : ghostBtn}`}>
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link to="/members" className={`${baseBtn} ${isActive('/members') ? activeBtn : ghostBtn}`}>
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Members</span>
            </Link>

            <Link to="/upload" className={`${baseBtn} ${isActive('/upload') ? activeBtn : ghostBtn}`}>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </Link>

            {isAdmin && (
              <Link to="/admin" className={`${baseBtn} ${isActive('/admin') ? activeBtn : ghostBtn}`}>
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            {user ? (
              <Link to="/profile" className={`${baseBtn} ${isActive('/profile') ? activeBtn : ghostBtn}`}>
                <InitialsAvatar name={user?.name} src={user?.avatar} />
                <span className="hidden sm:inline">{user?.name}</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className={`${baseBtn} ${isActive('/login') ? activeBtn : ghostBtn}`}>
                  <span className="hidden sm:inline">Login</span>
                </Link>
                <Link to="/register" className={`${baseBtn} ${isActive('/register') ? activeBtn : ghostBtn}`}>
                  <span className="hidden sm:inline">Register</span>
                </Link>
              </>
            )}

            {/* Optional: Placeholder for GoogleTranslate component if added later */}
            {/* <div className="ml-3 flex items-center"><GoogleTranslate /></div> */}
          </div>
        </div>
      </div>
    </nav>
  );
}