// src/features/Auth/components/RegisterForm.jsx
import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { registerUser } from '../services/authService';
const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError(null); // Clear error on change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Basic validation (can be extended with a library like Zod/Formik)
        if (!formData.name || !formData.email || !formData.password || !formData.mobileNumber) {
            setError('Please fill in all required fields.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Prepare the payload (excluding confirmPassword)
            const payload = {
                name: formData.name,
                email: formData.email,
                mobileNumber: formData.mobileNumber,
                password: formData.password,
                // Add other required fields based on your full API response if needed, 
                // e.g., 'dateOfBirth', 'dlNumber', etc., or assume they are optional for now.
            };
            
            const response = await registerUser(payload);
            setSuccess(`Registration successful! User ID: ${response.id}. Awaiting admin approval.`);
            setFormData({ name: '', email: '', mobileNumber: '', password: '', confirmPassword: '' }); // Clear form
        } catch (err) {
            setError(err.message || 'An unexpected error occurred during registration.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold text-center">Register for Auto Community</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-sm font-medium text-red-500 bg-red-100 p-2 rounded">{error}</p>}
                {success && <p className="text-sm font-medium text-green-600 bg-green-100 p-2 rounded">{success}</p>}

                <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                        id="name" 
                        type="text" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        placeholder="john.doe@example.com"
                    />
                </div>
                
                <div>
                    <Label htmlFor="mobileNumber">Mobile Number</Label>
                    <Input 
                        id="mobileNumber" 
                        type="tel" 
                        value={formData.mobileNumber} 
                        onChange={handleChange} 
                        required 
                        placeholder="9876543210"
                    />
                </div>

                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input 
                        id="password" 
                        type="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                        placeholder="••••••••"
                    />
                </div>

                <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input 
                        id="confirmPassword" 
                        type="password" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        required 
                        placeholder="••••••••"
                    />
                </div>

                <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </Button>
            </form>
            
            <p className="text-center text-sm text-gray-500">
                Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login here</a>
            </p>
        </div>
    );
};

export default RegisterForm;