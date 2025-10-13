import React, { useState, useContext, createContext } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Home, Users, Plus, MessageSquare, Menu, X, Globe, LogIn, LogOut, Search, Compass, Clapperboard, Send, Heart, User, Instagram } from "lucide-react";

// --- MOCK Dependencies for Single-File Runnability ---

// 1. Mock React Router DOM components and hooks
const RouterContext = createContext(null);
const useLocation = () => useContext(RouterContext) || {
    location: { pathname: typeof window !== 'undefined' ? window.location.pathname : '/' },
    navigate: (to) => {
        try {
            if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                window.history.pushState({}, '', to);
            }
        } catch {}
    }
};

const Link = ({ to, children }) => {
    const ctx = useContext(RouterContext);
    const navigate = ctx?.navigate || ((path) => {
        try {
            if (typeof window !== 'undefined') {
                window.location.assign(path);
            }
        } catch {}
    });
    return (
        <a 
            href={to} 
            onClick={(e) => { 
                e.preventDefault(); 
                navigate(to); 
                console.log(`Navigating to ${to}`); 
            }} 
            className="block"
        >
            {children}
        </a>
    );
};

// 2. Mock AuthContext
// Added isLoggedIn and isApproved to the context shape
const AuthContext = createContext({ 
    user: null, 
    isLoggedIn: false, 
    isApproved: false, 
    login: () => {}, 
    logout: () => {} 
});
const useAuth = () => useContext(AuthContext);

const MockAuthProvider = ({ children }) => {
    // --- User State (Set to 'not approved' by default for testing) ---
    const defaultUser = {
        name: "Bharth",
        email: "bh@gmail.com",
        role: "admin", // Can be 'admin' or 'member'
        avatar: "https://placehold.co/100x100/A3E635/000?text=BH",
        id: "mock-user-12345",
        isApproved: false, // <-- IMPORTANT: Set to false initially to test pending state
    };
    
    // Set user to null initially to test login/logout flow
    const [user, setUser] = useState(defaultUser); 

    // Derived State
    const isLoggedIn = !!user;
    const isApproved = isLoggedIn && user.isApproved;

    // Mock location state (mimics react-router's location object)
    const [location, setLocation] = useState({ pathname: "/" }); 

    const navigate = (path) => setLocation({ pathname: path });

    const login = () => {
        // Simulating a successful login that returns a user object (unapproved initially)
        setUser(defaultUser); 
        navigate("/");
    };

    const logout = () => {
        setUser(null);
        navigate("/");
    };
    
    // Utility to toggle approval status for demonstration
    const toggleApproval = () => {
        if (user) {
            setUser(prev => ({
                ...prev,
                isApproved: !prev.isApproved
            }));
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, isApproved, login, logout, toggleApproval }}>
            <RouterContext.Provider value={{ location, navigate }}>
                {children}
            </RouterContext.Provider>
        </AuthContext.Provider>
    );
};

// 3. Mock shadcn/ui components (Button, Avatar)
const Button = ({ children, onClick, variant, size, className, ...props }) => {
    const baseStyle = "px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2";
    
    let style = "";
    switch (variant) {
        case "default":
            style = "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md";
            break;
        case "ghost":
            style = "text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300";
            break;
        case "destructive":
            style = "bg-red-600 text-white hover:bg-red-700 shadow-md";
            break;
        default:
            style = "bg-gray-200 text-gray-800 hover:bg-gray-300";
    }

    const sizeClass = size === "sm" ? "h-9 text-sm" : "h-10";

    return (
        <button 
            onClick={onClick} 
            className={`${baseStyle} ${style} ${sizeClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

const Avatar = ({ children, className }) => (
    <div className={`rounded-full overflow-hidden ${className}`}>
        {children}
    </div>
);

const AvatarImage = ({ src, alt }) => (
    <img src={src} alt={alt} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
);

const AvatarFallback = ({ children, className }) => (
    <div className={`w-full h-full flex items-center justify-center bg-gray-300 text-gray-700 ${className}`}>
        {children}
    </div>
);

// 4. Mock GoogleTranslate component
const GoogleTranslate = () => (
    <div className="flex items-center space-x-1 text-sm text-gray-500 hover:text-indigo-600 transition p-2">
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">EN</span>
    </div>
);

// --- MAINNAV COMPONENT (Adapted with approval logic) ---

export const MainNav = () => {
    // Retrieve user, approval status, and auth actions from context
    const { user, isLoggedIn, isApproved, login, logout, toggleApproval } = useAuth();
    const { location, navigate } = useLocation(); 

    // Helper to check the current path against a given path
    const isActive = (path) => location.pathname === path;

    // Handler to simulate navigation
    const handleNavigate = (e, path) => {
        e.preventDefault();
        navigate(path);
    };

    return (
        <>
            {/* Desktop/Tablet: Left Sidebar */}
            <nav className="hidden md:flex fixed left-0 top-0 h-screen w-16 lg:w-20 bg-black text-white border-r border-neutral-800 flex-col items-center py-4 space-y-6 z-40">
                {/* Brand */}
                {/* <div className="mt-2 mb-4">
                    <Instagram className="w-7 h-7 lg:w-8 lg:h-8" />
                </div> */}

                {/* Primary */}
                <div className="flex-1 flex flex-col items-center space-y-6">
                    <RouterNavLink to="/feed" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : 'hover:bg-neutral-900'}`} title="Home">
                        <Home className="w-6 h-6" />
                    </RouterNavLink>
                    <RouterNavLink to="/search" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : 'hover:bg-neutral-900'}`} title="Search">
                        <Search className="w-6 h-6" />
                    </RouterNavLink>
                    <RouterNavLink to="/explore" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : 'hover:bg-neutral-900'}`} title="Explore">
                        <Compass className="w-6 h-6" />
                    </RouterNavLink>
                    <RouterNavLink to="/reels" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : 'hover:bg-neutral-900'}`} title="Reels">
                        <Clapperboard className="w-6 h-6" />
                    </RouterNavLink>
                    <RouterNavLink to="/messages" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : 'hover:bg-neutral-900'}`} title="Messages">
                        <Send className="w-6 h-6" />
                    </RouterNavLink>
                    <RouterNavLink to="/activity" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : 'hover:bg-neutral-900'}`} title="Activity">
                        <Heart className="w-6 h-6" />
                    </RouterNavLink>
                    <RouterNavLink to="/upload" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : 'hover:bg-neutral-900'}`} title="Create">
                        <Plus className="w-6 h-6" />
                    </RouterNavLink>
                    <RouterNavLink to="/profile" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : 'hover:bg-neutral-900'}`} title="Profile">
                        <User className="w-6 h-6" />
                    </RouterNavLink>
                </div>

                {/* Footer */}
                <div className="mb-4">
                    <button className="p-2 rounded-lg hover:bg-neutral-900" title="More">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </nav>

            {/* Mobile: Bottom Tab Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-black text-white border-t border-neutral-800 z-40">
                <div className="h-full max-w-xl mx-auto px-4 flex items-center justify-between">
                    <RouterNavLink to="/feed" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : ''}`} title="Home">
                        <Home className="w-6 h-6" />
                    </RouterNavLink>
                    <RouterNavLink to="/search" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : ''}`} title="Search">
                        <Search className="w-6 h-6" />
                    </RouterNavLink>
                    <RouterNavLink to="/upload" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : ''}`} title="Create">
                        <Plus className="w-6 h-6" />
                    </RouterNavLink>
                    <RouterNavLink to="/activity" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : ''}`} title="Activity">
                        <Heart className="w-6 h-6" />
                    </RouterNavLink>
                    <RouterNavLink to="/profile" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : ''}`} title="Profile">
                        <User className="w-6 h-6" />
                    </RouterNavLink>
                </div>
            </nav>
        </>
    );
};

// --- Main Application Wrapper ---

export default function App() {
    // Get the current location for content display
    const { location } = useContext(RouterContext);
    
    // Get auth status for displaying a tailored message
    const { isLoggedIn, isApproved } = useAuth();

    let contentMessage = `Current Page: ${location?.pathname || '/'}`;
    if (isLoggedIn && !isApproved) {
        contentMessage = "Welcome, your account is currently awaiting administrative approval. You will gain access to the dashboard once approved.";
    } else if (!isLoggedIn) {
        contentMessage = "Please log in to access the dashboard content.";
    }

    return (
        <MockAuthProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
                <MainNav />
                
                {/* Content Area to display current active link */}
                <div className="max-w-4xl mx-auto p-4 md:p-8">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-indigo-100 dark:border-indigo-900 min-h-[300px] flex flex-col justify-center items-center text-center">
                        <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400">
                            {isLoggedIn && isApproved ? `Dashboard Content` : `Access Restricted`}
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-lg">
                            {contentMessage}
                        </p>
                        
                        {/* Display content only if approved */}
                        {isLoggedIn && isApproved && (
                             <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
                                This simulates the main application content for the page: <strong className="font-mono text-indigo-500">{location?.pathname}</strong>
                            </p>
                        )}
                        
                    </div>
                </div>
            </div>
        </MockAuthProvider>
    );
}
