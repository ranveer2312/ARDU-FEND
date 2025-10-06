// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './features/Auth/RegisterPage'; 

function App() {
    return (
        <Router>
            <Routes>
                {/* 🆕 NEW: Redirects root path to /register */}
                <Route path="/" element={<Navigate to="/register" replace />} /> 
                
                {/* Public Routes */}
                <Route path="/register" element={<RegisterPage />} />
                
                {/* ... other routes (e.g., /login) */}
            </Routes>
        </Router>
    );
}

export default App;