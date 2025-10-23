// src/features/Auth/components/LoginForm.jsx
import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { loginUser } from '../services/authService';

// 🛑 Accept onLoginSuccess prop
const LoginForm = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Define a minimum delay for the animation (e.g., 2 seconds)
    const MIN_LOADER_TIME = 2000; 

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        // Start API loading phase
        setIsLoading(true);
        setError(null);
        
        const startTime = Date.now();

        try {
            await loginUser(email, password);
            
            // --- SUCCESS LOGIC ---

            // 1. Tell the parent (LoginPage) to show the Auto Rickshaw Loader
            if (onLoginSuccess) {
                onLoginSuccess();
            }

            // 2. Calculate remaining time needed for the animation
            const elapsedTime = Date.now() - startTime;
            const delay = Math.max(0, MIN_LOADER_TIME - elapsedTime);

            // 3. Wait for the required delay to ensure the animation plays out
            await new Promise(resolve => setTimeout(resolve, delay));
            
            console.log('Login successful! Redirecting...');
            
            // 4. Perform the final redirection
            window.location.href = '/feed';

        } catch (err) {
            // --- ERROR LOGIC ---
            setError(err.message || 'An unexpected error occurred during login.');
        } finally {
            // Stop API loading phase immediately on error, or after routing on success
            if (error) { // Only stop on error, success relies on redirection
                 setIsLoading(false);
            }
        }
    };

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold text-center">Login to Auto Community</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-sm font-medium text-red-500 bg-red-100 p-2 rounded">{error}</p>}

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        placeholder="john.doe@example.com"
                    />
                </div>

                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input 
                        id="password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        placeholder="••••••••"
                    />
                </div>

                <Button 
                    type="submit" 
                    className="w-full" 
                    // Button is disabled if waiting for API response OR if the loader animation has started
                    disabled={isLoading}
                >
                    {/* Display standard loading text while waiting for the API response */}
                    {isLoading ? 'Processing...' : 'Login'} 
                </Button>
            </form>
            
            <p className="text-center text-sm text-gray-500">
                Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register here</a>
            </p>
        </div>
    );
};

export default LoginForm;