import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { http } from '@/api/http';
import defaultAvatar from '@/images/user/defaultAvatar.png';
import { useNavigate } from 'react-router-dom';
export default function Suggestions() {
    const { currentTheme } = useTheme();
    const [userSuggestions, setUserSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                setLoading(true);

                // Fetch user suggestions
                const response = await http.get('/users?page=1&limit=6');
                console.log("Full Response:", response);

                const results = response.data?.results;
                console.log("User Suggestions:", results);
                setUserSuggestions(results);

                try {
                    const accountResponse = await http.get('/auth/account');
                    console.log('Account response:', accountResponse);
                    const userId = accountResponse.data.user.id;

                    if (userId) {
                        const userResponse = await http.get(`/users/${userId}`);
                        const userData = userResponse.data;
                        setUser(userData);
                    }
                } catch (error) {
                    console.error('Error fetching user avatar:', error);
                } finally {
                    setLoading(false);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 sticky top-11">
                <div className="space-y-4">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-[44px] h-[44px] rounded-full bg-gray-600 animate-pulse"></div>
                                <div className="space-y-2">
                                    <div className="w-32 h-4 bg-gray-600 rounded-md animate-pulse"></div>
                                    <div className="w-24 h-3 bg-gray-600 rounded-md animate-pulse"></div>
                                </div>
                            </div>
                            <div className="w-16 h-6 bg-gray-600 rounded-md animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 sticky top-11">
            {user && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <img
                            src={user.avatar || defaultAvatar}
                            alt={user.lastName}
                            className="w-[44px] h-[44px] rounded-full"
                            onClick={() => navigate("/settings")}
                        />
                        <div>
                            <h2 className={`font-semibold text-[13px] ${currentTheme.textNewsFeeds}`}>
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className={`text-[12px] ${currentTheme.mutedText}`}>
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <button className="text-xs font-semibold text-blue-500 hover:text-blue-600">
                        Switch
                    </button>
                </div>
            )}

            <div className="flex items-center justify-between">
                <h3 className={`font-semibold text-[14px] ml-2 ${currentTheme.mutedText}`}>
                    Suggested for you
                </h3>
                <button className={`text-xs font-semibold ${currentTheme.textNewsFeeds}`}>See All</button>
            </div>

            <div className="space-y-4 ml-2">
                {userSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <img
                                src={suggestion.avatar || defaultAvatar}
                                alt={suggestion.firstName}
                                className="w-[44px] h-[44px] rounded-full"
                            />
                            <div>
                                <h4 className={`text-[13px] font-semibold ${currentTheme.textNewsFeeds}`}>
                                    {suggestion.firstName} {suggestion.lastName}
                                </h4>
                                <p className={`text-xs ${currentTheme.mutedText}`}>
                                    {suggestion.email}
                                </p>
                            </div>
                        </div>
                        <button className="text-xs font-semibold text-blue-500 hover:text-blue-600">
                            Follow
                        </button>
                    </div>
                ))}
            </div>
            <div className="space-y-4">
                <nav className="flex flex-wrap gap-x-2 gap-y-1 ml-2">
                    {[
                        'About',
                        'Help',
                        'Press',
                        'API',
                        'Jobs',
                        'Privacy',
                        'Terms',
                        'Locations',
                        'Language',
                    ].map((link) => (
                        <a
                            key={link}
                            href="#"
                            className={`text-xs ${currentTheme.mutedText} hover:underline`}
                        >
                            {link}
                        </a>
                    ))}
                </nav>
                <p className={`text-xs ${currentTheme.mutedText} ml-2`}>
                    © 2024 VELTRA FROM VELTRA
                </p>
            </div>
        </div>
    );
}
