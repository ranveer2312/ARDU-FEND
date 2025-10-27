import React, { useState, useContext, createContext } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { 
    Home, 
    Users,       // 👥 Members icon (replaces Search)
    Plus, 
    MessageSquare, 
    Menu, 
    X, 
    Globe, 
    LogIn, 
    LogOut, 
    Compass,     // 🧭 Explore icon
    Clapperboard, 
    Send, 
    Heart, 
    User, 
    Instagram 
} from "lucide-react";

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
const AuthContext = createContext({ 
    user: null, 
    isLoggedIn: false, 
    isApproved: false, 
    login: () => {}, 
    logout: () => {} 
});
const useAuth = () => useContext(AuthContext);

const MockAuthProvider = ({ children }) => {
    const defaultUser = {
        name: "Bharth",
        email: "bh@gmail.com",
        role: "admin",
        avatar: "https://placehold.co/100x100/A3E635/000?text=BH",
        id: "mock-user-12345",
        isApproved: false,
    };
    
    const [user, setUser] = useState(defaultUser); 
    const isLoggedIn = !!user;
    const isApproved = isLoggedIn && user.isApproved;
    const [location, setLocation] = useState({ pathname: "/" }); 
    const navigate = (path) => setLocation({ pathname: path });

    const login = () => {
        setUser(defaultUser); 
        navigate("/");
    };
    const logout = () => {
        setUser(null);
        navigate("/");
    };
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

// 3. Mock shadcn/ui components
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

// --- MAINNAV COMPONENT (Updated with Members and Explore) ---
export const MainNav = () => {
    const { user, isLoggedIn, isApproved, login, logout, toggleApproval } = useAuth();
    const { location, navigate } = useLocation(); 
    const isActive = (path) => location.pathname === path;
    const handleNavigate = (e, path) => {
        e.preventDefault();
        navigate(path);
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <nav className="hidden md:flex fixed left-0 top-0 h-screen w-16 lg:w-20 bg-black text-white border-r border-neutral-800 flex-col items-center py-4 space-y-6 z-40">
                <div className="flex-1 flex flex-col items-center space-y-6">
                    <RouterNavLink to="/feed" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : 'hover:bg-neutral-900'}`} title="Home">
                        <Home className="w-6 h-6" />
                    </RouterNavLink>

                    <RouterNavLink to="/members" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : 'hover:bg-neutral-900'}`} title="Members">
                        <Users className="w-6 h-6" />
                    </RouterNavLink>

                    {/* ✅ New Section: Explore */}
                    <RouterNavLink to="/explore" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : 'hover:bg-neutral-900'}`} title="Explore">
                        <Compass className="w-6 h-6" />
                    </RouterNavLink>
                    {/* --------------------------- */}

                    <RouterNavLink to="/messages" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : 'hover:bg-neutral-900'}`} title="Messages">
                        <Send className="w-6 h-6" />
                    </RouterNavLink>

                    <RouterNavLink to="/upload" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : 'hover:bg-neutral-900'}`} title="Create">
                        <Plus className="w-6 h-6" />
                    </RouterNavLink>

                    <RouterNavLink to="/profile" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : 'hover:bg-neutral-900'}`} title="Profile">
                        <User className="w-6 h-6" />
                    </RouterNavLink>
                </div>

                <div className="mb-4">
                    <button className="p-2 rounded-lg hover:bg-neutral-900" title="More">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </nav>

            {/* Mobile Bottom Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-black text-white border-t border-neutral-800 z-40">
                <div className="h-full max-w-xl mx-auto px-4 flex items-center justify-between">
                    <RouterNavLink to="/feed" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : ''}`} title="Home">
                        <Home className="w-6 h-6" />
                    </RouterNavLink>

                    <RouterNavLink to="/members" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : ''}`} title="Members">
                        <Users className="w-6 h-6" />
                    </RouterNavLink>
                    
                    {/* ✅ New Section: Explore */}
                    <RouterNavLink to="/explore" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'bg-neutral-800' : ''}`} title="Explore">
                        <Compass className="w-6 h-6" />
                    </RouterNavLink>
                    {/* --------------------------- */}

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
    const { location } = useContext(RouterContext);
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
                <div className="max-w-4xl mx-auto p-4 md:p-8">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-indigo-100 dark:border-indigo-900 min-h-[300px] flex flex-col justify-center items-center text-center">
                        <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400">
                            {isLoggedIn && isApproved ? `Dashboard Content` : `Access Restricted`}
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-lg">
                            {contentMessage}
                        </p>
                        {isLoggedIn && isApproved && (
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
                                This simulates the main application content for the page: <strong className="font-mono text-indigo-500">{location?.pathname}</strong>
                            </p>
                        )}
                        {/* Mock Toggle Button for testing */}
                        <div className="mt-8">
                            <MockAuthToggle />
                        </div>
                    </div>
                </div>
            </div>
        </MockAuthProvider>
    );
}

// Mock Component for Toggling Auth/Approval Status
const MockAuthToggle = () => {
    const { isLoggedIn, isApproved, login, logout, toggleApproval, user } = useAuth();

    return (
        <div className="space-y-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 text-sm">
            <p className="font-semibold text-gray-700 dark:text-gray-300">Mock Auth Controls (for testing):</p>
            <div className="flex space-x-2">
                {isLoggedIn ? (
                    <Button onClick={logout} variant="destructive" size="sm">
                        <LogOut className="w-4 h-4" /> Logout
                    </Button>
                ) : (
                    <Button onClick={login} variant="default" size="sm">
                        <LogIn className="w-4 h-4" /> Login
                    </Button>
                )}
                {isLoggedIn && (
                    <Button onClick={toggleApproval} variant="ghost" size="sm" className={isApproved ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}>
                        {isApproved ? 'Unapprove User' : 'Approve User'}
                    </Button>
                )}
            </div>
            {isLoggedIn && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    Status: **{isApproved ? 'Approved' : 'Awaiting Approval'}**
                </p>
            )}
        </div>
    );
};