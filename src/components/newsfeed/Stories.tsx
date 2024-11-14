import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { mockStories } from '@/mock/newsfeedData';

export default function Stories() {
    const { currentTheme } = useTheme();
    const [scrollPosition, setScrollPosition] = useState(0);

    const scroll = (direction: 'left' | 'right') => {
        const container = document.getElementById('stories-container');
        if (container) {
            const scrollAmount = direction === 'left' ? -320 : 320;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            setScrollPosition(container.scrollLeft + scrollAmount);
        }
    };

    return (
        <div className={`${currentTheme.bg} border ${currentTheme.border} rounded-xl p-4 mb-6 relative`}>
            {/* Navigation Buttons */}
            {scrollPosition > 0 && (
                <button
                    onClick={() => scroll('left')}
                    className={`absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 shadow-lg z-10 ${currentTheme.buttonHover}`}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            )}
            <button
                onClick={() => scroll('right')}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 shadow-lg z-10 ${currentTheme.buttonHover}`}
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Stories Container */}
            <div
                id="stories-container"
                className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth"
            >
                {/* Add Story Button */}
                <div className="flex-shrink-0">
                    <button className="flex flex-col items-center space-y-2">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${currentTheme.buttonHover}`}>
                            <PlusCircle className={`w-8 h-8 ${currentTheme.text}`} />
                        </div>
                        <span className={`text-xs ${currentTheme.text}`}>Add story</span>
                    </button>
                </div>

                {/* Story Items */}
                {mockStories.map((story) => (
                    <button
                        key={story.id}
                        className="flex flex-col items-center space-y-2 flex-shrink-0"
                    >
                        <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
                            <div className="w-full h-full rounded-full p-0.5 bg-white">
                                <img
                                    src={story.userAvatar}
                                    alt={story.username}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </div>
                        <span className={`text-xs ${currentTheme.text} truncate w-20 text-center`}>
                            {story.username}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}