import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send, MoreHorizontal } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { mockStories } from '@/mock/newsfeedData';

interface StoryViewerProps {
    isOpen: boolean;
    onClose: () => void;
    initialStoryId?: string;
}

export default function StoryViewer({ isOpen, onClose, initialStoryId }: StoryViewerProps) {
    const { currentTheme } = useTheme();
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (initialStoryId) {
            const index = mockStories.findIndex(story => story.id === initialStoryId);
            if (index !== -1) setCurrentStoryIndex(index);
        }
    }, [initialStoryId]);

    useEffect(() => {
        if (!isOpen || isPaused) return;

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    // Move to next story
                    if (currentStoryIndex < mockStories.length - 1) {
                        setCurrentStoryIndex(prev => prev + 1);
                        return 0;
                    } else {
                        onClose();
                        return prev;
                    }
                }
                return prev + 1;
            });
        }, 30);

        return () => clearInterval(timer);
    }, [isOpen, currentStoryIndex, isPaused]);

    const handlePrevious = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
            setProgress(0);
        }
    };

    const handleNext = () => {
        if (currentStoryIndex < mockStories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
            setProgress(0);
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    const currentStory = mockStories[currentStoryIndex];

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            {currentStoryIndex > 0 && (
                <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
            )}
            {currentStoryIndex < mockStories.length - 1 && (
                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            )}

            {/* Story Content */}
            <div
                className="relative max-w-md w-full h-[80vh] bg-black"
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700">
                    <div
                        className="h-full bg-white transition-all duration-300 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Story Header */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img
                            src={currentStory.userAvatar}
                            alt={currentStory.username}
                            className="w-8 h-8 rounded-full border-2 border-white"
                        />
                        <span className="text-white font-semibold">{currentStory.username}</span>
                    </div>
                    <button className="text-white hover:text-gray-300">
                        <MoreHorizontal className="w-6 h-6" />
                    </button>
                </div>

                {/* Story Image */}
                <img
                    src={currentStory.userAvatar} // In real app, this would be story.image
                    alt="Story"
                    className="w-full h-full object-cover"
                />

                {/* Story Actions */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Send message"
                        className="flex-1 bg-white/10 text-white placeholder-white/70 rounded-full px-4 py-2 focus:outline-none"
                    />
                    <button className="text-white hover:text-gray-300">
                        <Heart className="w-6 h-6" />
                    </button>
                    <button className="text-white hover:text-gray-300">
                        <Send className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}