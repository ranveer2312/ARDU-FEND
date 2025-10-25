import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/useAuth';
import { Link } from 'react-router-dom';
import { organizationService } from '../../services/organizationService';

const OrganizationPage = () => {
    const { token } = useAuth();
    const [organizationData, setOrganizationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrganizationData = async () => {
            try {
                setLoading(true);
                const data = await organizationService.getContent(token);
                setOrganizationData(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching organization data:', err);
                // Don't show error, just use fallback content
                setOrganizationData(null);
                setError(null);
            } finally {
                setLoading(false);
            }
        };

        // Try to fetch data, but don't require it
        fetchOrganizationData();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Simple Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link to="/feed" className="text-blue-600 hover:text-blue-800 font-semibold">
                                ← Back to Feed
                            </Link>
                            <h1 className="text-xl font-bold text-gray-900">Organization</h1>
                            <div></div>
                        </div>
                    </div>
                </header>
                
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading organization information...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Simple Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link to="/feed" className="text-blue-600 hover:text-blue-800 font-semibold">
                                ← Back to Feed
                            </Link>
                            <h1 className="text-xl font-bold text-gray-900">Organization</h1>
                            <div></div>
                        </div>
                    </div>
                </header>
                
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Content</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Simple Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/feed" className="text-blue-600 hover:text-blue-800 font-semibold">
                            ← Back to Feed
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Organization</h1>
                        <div></div>
                    </div>
                </div>
            </header>
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                            {organizationData?.logo || 'ARDU'}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {organizationData?.title || 'Auto Rickshaw Drivers Union'}
                        </h1>
                        <p className="text-lg text-gray-600">
                            {organizationData?.subtitle || 'Established in 1974 • Supporting Driver Community'}
                        </p>
                    </div>
                </div>

                {/* Kannada Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">🇮🇳</span>
                        <h2 className="text-2xl font-bold text-gray-900">ಕನ್ನಡ</h2>
                    </div>
                    
                    <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                        {organizationData?.kannadaContent ? (
                            organizationData.kannadaContent.map((paragraph, index) => (
                                <p key={index} className="mb-6">
                                    {paragraph}
                                </p>
                            ))
                        ) : (
                            <p className="mb-6">
                                1974 ರಲ್ಲಿ ಸ್ಥಾಪಿತವಾದ ಆಟೋ ರಿಕ್ಷಾ ಚಾಲಕರ ಒಕ್ಕೂಟ (ARDU) ಚಾಲಕ ಸಮುದಾಯವನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ ಮತ್ತು ಅವರ ಹಕ್ಕುಗಳು ಮತ್ತು ಜವಾಬ್ದಾರಿಗಳ ಬಗ್ಗೆ ಅವರಿಗೆ ಶಿಕ್ಷಣ ನೀಡುತ್ತದೆ. ARDU ಚಾಲಕರಲ್ಲಿ ಜಾಗೃತಿ ಮೂಡಿಸಲು, ಉತ್ತಮ ಅಭ್ಯಾಸಗಳನ್ನು ಉತ್ತೇಜಿಸಲು ಮತ್ತು ಪ್ರಯಾಣಿಕರಿಗೆ ವಿಶ್ವಾಸಾರ್ಹ ಹಾಗೂ ಉನ್ನತ ಸೇವೆಯನ್ನು ಒದಗಿಸಲು ಶ್ರಮಿಸುತ್ತದೆ.
                            </p>
                        )}
                    </div>
                </div>

                {/* English Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">🌍</span>
                        <h2 className="text-2xl font-bold text-gray-900">English</h2>
                    </div>
                    
                    <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                        {organizationData?.englishContent ? (
                            organizationData.englishContent.map((paragraph, index) => (
                                <p key={index} className="mb-6">
                                    {paragraph}
                                </p>
                            ))
                        ) : (
                            <p className="mb-6">
                                Established in 1974, Auto Rickshaw Drivers Union (ARDU) supports the Driver community and educates them on their rights and responsibilities. ARDU strives to raise awareness, promote best practices amongst Drivers and provide trustworthy reliable service to commuters and to improve rider experience.
                            </p>
                        )}
                    </div>
                </div>

                {/* Key Achievements */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm p-8 text-white">
                    <h3 className="text-2xl font-bold mb-6 text-center">
                        {organizationData?.achievementsTitle || 'Key Achievements'}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {organizationData?.achievements ? (
                            organizationData.achievements.map((achievement, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-4xl mb-3">{achievement.icon}</div>
                                    <h4 className="font-semibold mb-2">{achievement.title}</h4>
                                    <p className="text-sm opacity-90">{achievement.description}</p>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="text-center">
                                    <div className="text-4xl mb-3">🏛️</div>
                                    <h4 className="font-semibold mb-2">Government Engagement</h4>
                                    <p className="text-sm opacity-90">Active collaboration with State and Central Government</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl mb-3">📱</div>
                                    <h4 className="font-semibold mb-2">Digital Innovation</h4>
                                    <p className="text-sm opacity-90">NammaYatri - World's first open source mobility app</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl mb-3">🤝</div>
                                    <h4 className="font-semibold mb-2">Community Support</h4>
                                    <p className="text-sm opacity-90">50+ years of dedicated service to driver community</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-gray-500">
                    <p>© 2024 Auto Rickshaw Drivers Union (ARDU)</p>
                    <p className="text-sm mt-1">Empowering drivers, serving communities</p>
                </div>
            </div>
        </div>
    );
};

export default OrganizationPage;
