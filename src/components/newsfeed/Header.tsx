import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
    Home, Search, PlusSquare, Heart, User,
    MessageCircle, Compass, Film, Settings, Bookmark,
    LogOut, Moon, Sun
} from 'lucide-react';
import CreatePostModal from './CreatePostModal';
import { toast } from 'react-hot-toast';

export default function Header() {
    const { currentTheme, theme, setTheme } = useTheme();
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const handleLogout = () => {
        toast.success('Logged out successfully');
    };

    return (
        <header className={`fixed top-0 left-0 right-0 h-16 ${currentTheme.bg} border-b ${currentTheme.border} z-40`}>
            <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">
                {/* Logo */}
                <div className={`text-2xl font-bold ${currentTheme.text}`}>
                    Instagram
                </div>

                {/* Search */}
                <div className="hidden md:block relative">
                    <input
                        type="text"
                        placeholder="Search"
                        className={`${currentTheme.input} rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        onFocus={() => setShowSearch(true)}
                    />
                    {showSearch && (
                        <div className={`absolute top-full mt-2 w-96 ${currentTheme.bg} rounded-xl shadow-lg border ${currentTheme.border} p-4`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`font-semibold ${currentTheme.text}`}>Recent</h3>
                                <button className="text-blue-500 text-sm">Clear all</button>
                            </div>
                            <div className={`text-sm ${currentTheme.mutedText} text-center`}>
                                No recent searches.
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex items-center space-x-4">
                    <button className={`p-2 rounded-xl ${currentTheme.buttonHover}`}>
                        <Home className={`w-6 h-6 ${currentTheme.iconColor}`} />
                    </button>

                    <button className={`p-2 rounded-xl ${currentTheme.buttonHover}`}>
                        <MessageCircle className={`w-6 h-6 ${currentTheme.iconColor}`} />
                    </button>

                    <button
                        onClick={() => setShowCreatePost(true)}
                        className={`p-2 rounded-xl ${currentTheme.buttonHover}`}
                    >
                        <PlusSquare className={`w-6 h-6 ${currentTheme.iconColor}`} />
                    </button>

                    <button className={`p-2 rounded-xl ${currentTheme.buttonHover}`}>
                        <Compass className={`w-6 h-6 ${currentTheme.iconColor}`} />
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`p-2 rounded-xl ${currentTheme.buttonHover}`}
                        >
                            <Heart className={`w-6 h-6 ${currentTheme.iconColor}`} />
                        </button>

                        {showNotifications && (
                            <div className={`absolute right-0 top-full mt-2 w-96 ${currentTheme.bg} rounded-xl shadow-lg border ${currentTheme.border} p-4`}>
                                <h3 className={`font-semibold ${currentTheme.text} mb-4`}>Notifications</h3>
                                <div className="space-y-4">
                                    {/* Today */}
                                    <div>
                                        <h4 className={`text-sm font-medium ${currentTheme.mutedText} mb-2`}>Today</h4>
                                        <div className={`text-sm ${currentTheme.text} text-center py-8`}>
                                            No new notifications.
                                        </div>
                                    </div>

                                    {/* This Week */}
                                    <div>
                                        <h4 className={`text-sm font-medium ${currentTheme.mutedText} mb-2`}>This Week</h4>
                                        <div className={`text-sm ${currentTheme.text} text-center py-8`}>
                                            No notifications this week.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative group">
                        <button className={`p-2 rounded-xl ${currentTheme.buttonHover}`}>
                            <User className={`w-6 h-6 ${currentTheme.iconColor}`} />
                        </button>

                        {/* Profile Dropdown */}
                        <div className={`absolute right-0 top-full mt-2 w-56 ${currentTheme.bg} rounded-xl shadow-lg border ${currentTheme.border} py-1 hidden group-hover:block`}>
                            <button className={`w-full px-4 py-2 flex items-center space-x-3 ${currentTheme.buttonHover}`}>
                                <User className={`w-4 h-4 ${currentTheme.iconColor}`} />
                                <span className={currentTheme.text}>Profile</span>
                            </button>

                            <button className={`w-full px-4 py-2 flex items-center space-x-3 ${currentTheme.buttonHover}`}>
                                <Bookmark className={`w-4 h-4 ${currentTheme.iconColor}`} />
                                <span className={currentTheme.text}>Saved</span>
                            </button>

                            <button className={`w-full px-4 py-2 flex items-center space-x-3 ${currentTheme.buttonHover}`}>
                                <Settings className={`w-4 h-4 ${currentTheme.iconColor}`} />
                                <span className={currentTheme.text}>Settings</span>
                            </button>

                            <button
                                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                                className={`w-full px-4 py-2 flex items-center space-x-3 ${currentTheme.buttonHover}`}
                            >
                                {theme === 'light' ? (
                                    <Moon className={`w-4 h-4 ${currentTheme.iconColor}`} />
                                ) : (
                                    <Sun className={`w-4 h-4 ${currentTheme.iconColor}`} />
                                )}
                                <span className={currentTheme.text}>
                                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                                </span>
                            </button>

                            <hr className={`my-1 ${currentTheme.border}`} />

                            <button
                                onClick={handleLogout}
                                className={`w-full px-4 py-2 flex items-center space-x-3 ${currentTheme.buttonHover}`}
                            >
                                <LogOut className={`w-4 h-4 ${currentTheme.iconColor}`} />
                                <span className={currentTheme.text}>Log Out</span>
                            </button>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Modals */}
            <CreatePostModal
                isOpen={showCreatePost}
                onClose={() => setShowCreatePost(false)}
            />
        </header>
    );
}