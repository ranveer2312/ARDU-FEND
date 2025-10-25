import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Plus, MessageSquare, Building, LogIn, UserPlus } from 'lucide-react'; 
// NOTE: Assuming useAuth is available in the environment
// import { useAuth } from '../../features/Auth/AuthContext'; 

// Mock useAuth for self-contained runnable code demonstration, 
// replace with actual import if deployed in a full React environment.
const useAuth = () => {
    // Example User for demonstration:
    const user = { name: 'J. Ardu', avatar: 'https://placehold.co/40x40/4F46E5/FFFFFF?text=JA', mainAdmin: true, role: 'USER' };
    // const user = null; // Uncomment this to test logged-out state
    return { user };
};


const InitialsAvatar = ({ name = '', src, size = 'w-6 h-6' }) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`${size} rounded-full overflow-hidden bg-indigo-500 text-white flex items-center justify-center text-xs flex-shrink-0`}>
      {src ? (
        <img 
          src={src} 
          alt={name} 
          className="w-full h-full object-cover" 
          onError={(e) => { 
            e.currentTarget.style.display = 'none'; 
            // Attempt to show initials fallback if image fails to load
            const span = e.currentTarget.parentNode.querySelector('span');
            if (span) span.style.display = 'flex';
          }}
        />
      ) : (
        <span className="flex items-center justify-center h-full w-full">{initials || '?'}</span>
      )}
    </div>
  );
};

// Component renamed to Sidebar, now handles both mobile and desktop views
export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isAdmin = !!(user?.mainAdmin || String(user?.role || '').toUpperCase().includes('ADMIN'));

  // Common button styles for vertical layout (Desktop)
  const desktopBaseBtn =
    'h-10 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-3 w-full';
  const activeBtn = 'bg-indigo-600 text-white shadow';
  const ghostBtn =
    'text-gray-700 hover:text-indigo-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700';
  
  // Custom classes for the responsive sidebar container (Desktop)
  const sidebarContainerClasses = 
    "fixed top-0 left-0 h-screen w-16 md:w-56 p-2 md:p-4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transition-all duration-300 shadow-xl hidden md:block"; // <-- HIDDEN on mobile
  
  // Helper for Desktop Nav Items
  const DesktopNavItem = ({ to, icon: Icon, label }) => (
    <Link 
      to={to} 
      className={`${desktopBaseBtn} ${isActive(to) ? activeBtn : ghostBtn} justify-center md:justify-start`}
      title={label}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="hidden md:inline whitespace-nowrap">{label}</span>
    </Link>
  );

  // Mobile Bottom Navigation Bar
  const MobileBottomNav = () => {
    const mobileBaseBtn = 'flex flex-col items-center justify-center p-2 pt-2.5 h-full w-full text-xs font-medium';
    const mobileGhostBtn = 'text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400';
    
    // Links to display in the bottom bar
    const links = [
      { to: "/feed", icon: Home, label: "Home", requiresAuth: false },
      { to: "/members", icon: Users, label: "Members", requiresAuth: false },
      { to: "/upload", icon: Plus, label: "Upload", requiresAuth: true },
      ...(isAdmin ? [{ to: "/admin", icon: MessageSquare, label: "Admin", requiresAuth: true }] : []),
      ...(user ? [{ to: "/org", icon: Building, label: "Org", requiresAuth: true }] : []),
    ];

    if (!user) {
        links.push({ to: "/login", icon: LogIn, label: "Login", requiresAuth: false });
        links.push({ to: "/register", icon: UserPlus, label: "Register", requiresAuth: false });
    }


    return (
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 flex justify-around md:hidden shadow-2xl">
        {links
          .filter(link => !link.requiresAuth || user) // Filter based on authentication status
          .slice(0, 5) // Limit to 5 icons maximum for a clean bottom bar layout
          .map((item) => (
            <Link 
              key={item.to}
              to={item.to} 
              className={`${mobileBaseBtn} ${isActive(item.to) ? 'text-indigo-600 dark:text-indigo-400' : mobileGhostBtn}`}
              title={item.label}
            >
              <item.icon className="w-6 h-6 mb-0.5" />
              {/* Profile/Avatar as last item */}
              {item.to === "/profile" && user ? (
                <InitialsAvatar name={user?.name} src={user?.avatar} size="w-7 h-7" />
              ) : (
                <span className="hidden"></span>
              )}
            </Link>
          ))}
          {/* Always show the user profile or login/register as the last slot */}
          {user && (
            <Link 
              to="/profile" 
              className={`${mobileBaseBtn} ${isActive('/profile') ? 'text-indigo-600 dark:text-indigo-400' : mobileGhostBtn}`}
              title="Profile"
            >
              <InitialsAvatar name={user?.name} src={user?.avatar} size="w-7 h-7" />
              <span className="hidden"></span>
            </Link>
          )}

      </nav>
    );
  }

  // Desktop/Tablet Vertical Sidebar
  const DesktopSidebar = () => (
    <nav className={sidebarContainerClasses}>
      <div className="flex flex-col space-y-6 h-full">
        {/* Logo */}
        <div className="flex justify-center md:justify-start items-center mb-6 h-12">
          <div className="w-8 md:w-10 h-8 md:h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-lg">A</span>
          </div>
          <span className="hidden md:inline ml-3 text-xl font-extrabold text-gray-900 dark:text-white">RDU</span>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col space-y-2 flex-grow">
          {/* Main Links */}
          <DesktopNavItem to="/feed" icon={Home} label="Home" />
          <DesktopNavItem to="/members" icon={Users} label="Members" />
          <DesktopNavItem to="/upload" icon={Plus} label="Upload" />
          
          {/* Admin Link (Conditional) */}
          {isAdmin && (
            <DesktopNavItem to="/admin" icon={MessageSquare} label="Admin" />
          )}

          {/* Org Link (Conditional) */}
          {user && ( 
            <DesktopNavItem to="/org" icon={Building} label="Organization" />
          )}
        </div>

        {/* User/Auth Links (Bottom) */}
        <div className="flex flex-col space-y-2 mt-auto border-t border-gray-200 dark:border-gray-700 pt-4">
          {user ? (
            <Link 
              to="/profile" 
              className={`${desktopBaseBtn} ${isActive('/profile') ? activeBtn : ghostBtn} justify-center md:justify-start`}
              title={user?.name || "Profile"}
            >
              <InitialsAvatar name={user?.name} src={user?.avatar} />
              <span className="hidden md:inline whitespace-nowrap text-ellipsis overflow-hidden">{user?.name || 'Profile'}</span>
            </Link>
          ) : (
            <>
              <DesktopNavItem to="/login" icon={LogIn} label="Login" />
              <DesktopNavItem to="/register" icon={UserPlus} label="Register" />
            </>
          )}
        </div>
      </div>
    </nav>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileBottomNav />
    </>
  );
}
