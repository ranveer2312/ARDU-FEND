import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './features/Auth/RegisterPage'; 
import LoginPage from './features/Auth/LoginPage'; // 1. IMPORT LOGIN PAGE
import { FeedPage } from './features/Feed';
import { UploadPage } from './features/Upload';

function App() {
    return (
        <Router>
            <Routes>
                {/* 🆕 NEW: Redirects root path to /register or /login as default */}
                <Route path="/" element={<Navigate to="/login" replace />} /> 
                
                {/* Public Routes */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} /> {/* 2. ADD LOGIN ROUTE */}
                
                {/* Placeholder for protected routes (will use an AuthGuard later) */}
                <Route path="/dashboard" element={<h1>Dashboard (Protected)</h1>} />
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/upload" element={<UploadPage />} />
                
                {/* ... other routes */}
            </Routes>
        </Router>
    );
}

export default App;
