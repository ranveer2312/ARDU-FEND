// src/features/Auth/components/LoginForm.jsx
import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { loginUser } from '../services/authService';
// Assuming you have a way to handle successful login (e.g., redirect or update context)
// import { useNavigate } from 'react-router-dom'; 

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // const navigate = useNavigate(); // Example for routing

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await loginUser(email, password);
            
            // Success: Token stored in LocalStorage by authService.js
            console.log('Login successful!', response.name);
            
            // Redirect user to the dashboard or home page
            // navigate('/dashboard'); 
            window.location.href = '/feed';

        } catch (err) {
            // Error from handleApiError will be displayed
            setError(err.message || 'An unexpected error occurred during login.');
        } finally {
            setIsLoading(false);
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
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging In...' : 'Login'}
                </Button>
            </form>
            
            <p className="text-center text-sm text-gray-500">
                Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register here</a>
            </p>
        </div>
    );
};

export default LoginForm;