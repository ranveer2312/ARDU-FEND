// src/features/Auth/components/RegisterForm.jsx
import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
// Import updateProfile alongside registerUser
import { registerUser, updateProfile } from '../services/authService'; 
import { ArrowLeft } from 'lucide-react'; // Assuming you have lucide-react for the back button icon

// Combined initial state for all fields
const initialFormData = {
    // Step 1: Basic fields (Required)
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Profile fields (Optional)
    whatsappNumber: '',
    dlNumber: '',
    fatherName: '',
    dateOfBirth: '',
    badgeNumber: '',
    address: '',
    bloodGroup: '',
    nomineeName: '',
    nomineeRelationship: '',
    nomineeContactNumber: '',
};

const RegisterForm = () => {
    const [step, setStep] = useState(1); // Start at Step 1
    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [userId, setUserId] = useState(null); // To store ID after initial registration

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError(null);
    };

    // --- STEP 1: BASIC REGISTRATION ---
    const handleBasicRegister = async (e) => {
        e.preventDefault();

        // 1. Client-Side Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!formData.name || !formData.email || !formData.password || !formData.mobileNumber) {
            setError('Please fill in all basic required fields.');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Prepare payload with only basic required fields for initial registration
            const basicPayload = {
                name: formData.name,
                email: formData.email,
                mobileNumber: formData.mobileNumber,
                password: formData.password,
            };

            // 2. Call the server to register the user
            const response = await registerUser(basicPayload);
            setUserId(response.id); 
            
            setStep(2); // Move to Profile Completion step
            
        } catch (err) {
            setError(err.message || 'Registration failed. Please check your data or try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- STEP 2: PROFILE COMPLETION (SUBMIT or SKIP) ---
    const handleProfileCompletion = async (e, skip = false) => {
        e.preventDefault();
        
        setIsLoading(true);
        setError(null);
        
        try {
            // Prepare the payload (all fields from the form data, excluding the basic/security ones)
            // We use formData directly as it holds the state from the optional inputs
            const profilePayload = {
                whatsappNumber: formData.whatsappNumber,
                dlNumber: formData.dlNumber,
                fatherName: formData.fatherName,
                dateOfBirth: formData.dateOfBirth,
                badgeNumber: formData.badgeNumber,
                address: formData.address,
                bloodGroup: formData.bloodGroup,
                nomineeName: formData.nomineeName,
                nomineeRelationship: formData.nomineeRelationship,
                nomineeContactNumber: formData.nomineeContactNumber,
            };

            if (skip) {
                // If skipping, the payload will contain empty strings, which the backend 
                // must be configured to accept on the PUT/PATCH endpoint.
                setSuccess('Basic registration successful. You can log in while awaiting admin approval.');
            } else {
                // Call the PUT/PATCH endpoint to update the user profile
                await updateProfile(userId, profilePayload);
                setSuccess('Registration and full profile submission successful! Awaiting admin approval.');
            }
            
            // Final step: show final success message
            setStep(3);
            
        } catch (err) {
            setError(err.message || 'Profile update failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- RENDER LOGIC ---
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <form onSubmit={handleBasicRegister} className="space-y-4">
                        <h2 className="text-xl font-semibold text-center mb-4">Step 1: Account Setup</h2>
                        
                        {/* Name */}
                        <div><Label htmlFor="name">Full Name</Label><Input id="name" type="text" value={formData.name} onChange={handleChange} required placeholder="John Doe"/></div>
                        {/* Email */}
                        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john.doe@example.com"/></div>
                        {/* Mobile Number */}
                        <div><Label htmlFor="mobileNumber">Mobile Number</Label><Input id="mobileNumber" type="tel" value={formData.mobileNumber} onChange={handleChange} required placeholder="9876543210"/></div>
                        {/* Password */}
                        <div><Label htmlFor="password">Password</Label><Input id="password" type="password" value={formData.password} onChange={handleChange} required placeholder="••••••••"/></div>
                        {/* Confirm Password */}
                        <div><Label htmlFor="confirmPassword">Confirm Password</Label><Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••••"/></div>
                        
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Registering...' : 'Register'}
                        </Button>
                    </form>
                );
            case 2:
                return (
                    <form onSubmit={handleProfileCompletion} className="space-y-4">
                        <h2 className="text-xl font-semibold text-center mb-4">Step 2: Profile Details (Optional)</h2>
                        <p className="text-sm text-gray-500">Fill out these details now, or **Skip for Now** to complete registration.</p>

                        <div className='space-y-4 p-4 border rounded-md'>
                            <h3 className="text-lg font-medium">Personal Information</h3>
                            
                            {/* NEW OPTIONAL FIELDS */}
                            <div><Label htmlFor="whatsappNumber">WhatsApp Number</Label><Input id="whatsappNumber" type="tel" value={formData.whatsappNumber} onChange={handleChange} placeholder="9998567777"/></div>
                            <div><Label htmlFor="dlNumber">Driver's License Number</Label><Input id="dlNumber" type="text" value={formData.dlNumber} onChange={handleChange} placeholder="DL1234567"/></div>
                            <div><Label htmlFor="fatherName">Father's Name</Label><Input id="fatherName" type="text" value={formData.fatherName} onChange={handleChange} placeholder="Richard Doe"/></div>
                            <div><Label htmlFor="dateOfBirth">Date of Birth</Label><Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange}/></div>
                            <div><Label htmlFor="address">Address</Label><Input id="address" type="text" value={formData.address} onChange={handleChange} placeholder="123 Street, City"/></div>
                            <div><Label htmlFor="bloodGroup">Blood Group</Label><Input id="bloodGroup" type="text" value={formData.bloodGroup} onChange={handleChange} placeholder="O+"/></div>
                            <div><Label htmlFor="badgeNumber">Badge Number</Label><Input id="badgeNumber" type="text" value={formData.badgeNumber} onChange={handleChange} placeholder="B123"/></div>
                        </div>

                        <div className='space-y-4 p-4 border rounded-md'>
                            <h3 className="text-lg font-medium">Nominee Information</h3>
                            <div><Label htmlFor="nomineeName">Nominee Full Name</Label><Input id="nomineeName" type="text" value={formData.nomineeName} onChange={handleChange} placeholder="Alice Doe"/></div>
                            <div><Label htmlFor="nomineeRelationship">Nominee Relationship</Label><Input id="nomineeRelationship" type="text" value={formData.nomineeRelationship} onChange={handleChange} placeholder="Sister"/></div>
                            <div><Label htmlFor="nomineeContactNumber">Nominee Contact Number</Label><Input id="nomineeContactNumber" type="tel" value={formData.nomineeContactNumber} onChange={handleChange} placeholder="8882376666"/></div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Saving Profile...' : 'Submit Profile & Finish'}
                        </Button>
                        
                        {/* SKIP BUTTON */}
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={(e) => handleProfileCompletion(e, true)} 
                            className="w-full" 
                            disabled={isLoading}
                        >
                            Skip for Now
                        </Button>

                        <Button type="button" variant="ghost" onClick={() => setStep(1)} className="w-full text-sm">
                            <ArrowLeft className="h-4 w-4 mr-2"/> Go Back to Basic Info
                        </Button>
                    </form>
                );
            case 3:
                return (
                    <div className="text-center p-6 space-y-4">
                        <h2 className="text-2xl font-bold text-green-600">Success!</h2>
                        <p className="text-lg">{success}</p>
                        <p className="text-gray-600">You can now proceed to login.</p>
                        <Button onClick={() => window.location.href='/login'} className="w-full">
                            Go to Login
                        </Button>
                    </div>
                );
            default:
                return <div>Registration Flow Error</div>;
        }
    };

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold text-center">Register for Auto Community</h1>
            <p className="text-center text-sm font-medium text-blue-600">
                Step {step} of 2
            </p>
            
            {error && <p className="text-sm font-medium text-red-500 bg-red-100 p-2 rounded">{error}</p>}

            {renderStep()}
            
            <p className="text-center text-sm text-gray-500">
                Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login here</a>
            </p>
        </div>
    );
};

export default RegisterForm;