// src/App.js - Use the correct Default Imports

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/Auth/AuthContext';

// ✅ CORRECT: Default imports for components that use 'export default'
import RegisterPage from './features/Auth/RegisterPage'; 
import LoginPage from './features/Auth/LoginPage'; 
import ProfilePage from "./features/Profile/ProfilePage";

// 🛑 Reverting back to NAMED IMPORTS based on previous successful compilation
import { FeedPage } from './features/Feed';     
import { UploadPage } from './features/Upload'; 

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} /> 
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    
                    <Route path="/dashboard" element={<h1>Dashboard (Protected)</h1>} />
                    <Route path="/feed" element={<FeedPage />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;