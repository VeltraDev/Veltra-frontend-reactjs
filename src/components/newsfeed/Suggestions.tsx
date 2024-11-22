import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { mockSuggestions, mockUser } from '@/mocks/newsfeedData';

export default function Suggestions() {
    const { currentTheme } = useTheme();

    return (
        <div className="space-y-6">
            {/* User Profile */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img
                        src={mockUser.avatar}
                        alt={mockUser.username}
                        className="w-12 h-12 rounded-full"
                    />
                    <div>
                        <h2 className={`font-semibold ${currentTheme.text}`}>{mockUser.username}</h2>
                        <p className={`text-sm ${currentTheme.mutedText}`}>{mockUser.fullName}</p>
                    </div>
                </div>
                <button className="text-sm font-semibold text-blue-500 hover:text-blue-600">
                    Switch
                </button>
            </div>

            {/* Suggestions Header */}
            <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${currentTheme.mutedText}`}>Suggestions For You</h3>
                <button className={`text-sm font-semibold ${currentTheme.text}`}>See All</button>
            </div>

            {/* Suggestions List */}
            <div className="space-y-4">
                {mockSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <img
                                src={suggestion.avatar}
                                alt={suggestion.username}
                                className="w-8 h-8 rounded-full"
                            />
                            <div>
                                <h4 className={`text-sm font-semibold ${currentTheme.text}`}>
                                    {suggestion.username}
                                </h4>
                                <p className={`text-xs ${currentTheme.mutedText}`}>
                                    {suggestion.reason}
                                </p>
                            </div>
                        </div>
                        <button className="text-xs font-semibold text-blue-500 hover:text-blue-600">
                            Follow
                        </button>
                    </div>
                ))}
            </div>

            {/* Footer Links */}
            <div className="space-y-4">
                <nav className="flex flex-wrap gap-x-2 gap-y-1">
                    {[
                        'About',
                        'Help',
                        'Press',
                        'API',
                        'Jobs',
                        'Privacy',
                        'Terms',
                        'Locations',
                        'Language'
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
                <p className={`text-xs ${currentTheme.mutedText}`}>
                    © 2024 INSTAGRAM FROM META
                </p>
            </div>
        </div>
    );
}