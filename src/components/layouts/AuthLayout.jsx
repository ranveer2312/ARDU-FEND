// src/components/layouts/AuthLayout.jsx
import React from 'react';
// Assuming your background image is placed here: src/core/assets/background.png
// You will need to make sure the image is correctly imported/referenced.

/**
 * A layout component for authentication pages (Login, Register) 
 * that applies the specific background image/style.
 */
const AuthLayout = ({ children }) => {
    // NOTE: Replace 'bg-auth-pattern' with the actual class/style that points 
    // to your image. For Tailwind, you usually configure this in tailwind.config.js 
    // or use a direct style with a base64 or public path.
    
    // For simplicity, we'll use a CSS class approach here, assuming you add 
    // 'bg-auth-pattern' to your global CSS or extend tailwind.config.js.
    // If using the provided image (image_ce6a2d.png), you should place it 
    // in the public/ folder or configure it in Tailwind.
    
    // As you requested the style of the image, we'll use the Tailwind classes 
    // that mimic a fixed, centered, full-cover background.
    const backgroundStyle = {
        // Use the relative path to the image, assuming it's in the public folder 
        // or a configured asset path, or use the image provided: 

// [Image of background image]
 
        // If the image is in the public folder:
        backgroundImage: 'url(/assets/background.png)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-4" 
            style={backgroundStyle}
        >
            <div className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl rounded-xl">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;