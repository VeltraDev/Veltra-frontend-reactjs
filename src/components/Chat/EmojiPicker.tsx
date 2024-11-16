import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { X, Search, Clock, Star } from 'lucide-react';
import { emojiService } from '@/services/api/emojiService';
import { motion, AnimatePresence } from 'framer-motion';

interface EmojiPickerProps {
    onSelect: (emoji: string) => void;
    onClose: () => void;
}

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
    const { currentTheme } = useTheme();
    const [categories, setCategories] = useState<any[]>([]);
    const [emojis, setEmojis] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [recentEmojis, setRecentEmojis] = useState<string[]>(() => {
        const saved = localStorage.getItem('recentEmojis');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const result = await emojiService.getCategories();
            setCategories(result);
            if (result.length > 0) {
                setActiveCategory(result[0].slug);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchEmojis = async () => {
            if (searchTerm) {
                const results = await emojiService.search(searchTerm);
                setEmojis(results);
            } else if (activeCategory) {
                const results = await emojiService.getEmojis(activeCategory);
                setEmojis(results);
            }
        };
        fetchEmojis();
    }, [activeCategory, searchTerm]);

    const handleEmojiSelect = (emoji: string) => {
        // Update recent emojis
        const newRecent = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 20);
        setRecentEmojis(newRecent);
        localStorage.setItem('recentEmojis', JSON.stringify(newRecent));

        onSelect(emoji);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`${currentTheme.bg} rounded-xl shadow-lg border ${currentTheme.border} w-72`}
        >
            {/* Header */}
            <div className="p-3 border-b  border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className={`text-sm font-medium ${currentTheme.text}`}>Emojis</h3>
                <button
                    onClick={onClose}
                    className={`p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
                >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
            </div>

            {/* Search */}
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${currentTheme.iconColor}`} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search emojis..."
                        className={`
              w-full pl-9 pr-4 py-1.5 rounded-lg text-sm
              ${currentTheme.input} ${currentTheme.text}
              focus:outline-none focus:ring-2 focus:ring-blue-500/50
            `}
                    />
                </div>
            </div>

            {/* Categories */}
     
            {!searchTerm && (
                <div className="flex overflow-x-auto scrollbar-custom p-2 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveCategory('recent')}
                        className={`
              flex-shrink-0 px-3 py-1 rounded-lg text-sm mr-2 transition-colors
              ${activeCategory === 'recent'
                                ? 'bg-blue-600 text-white dark:bg-blue-500'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }
            `}
                    >
                        <Clock className="w-4 h-4" />
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.slug}
                            onClick={() => setActiveCategory(category.slug)}
                            className={`
                  flex-shrink-0 px-3 py-1 rounded-lg text-sm mr-2 transition-colors
                  ${activeCategory === category.slug
                                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }
                `}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            )}


            {/* Emoji Grid */}
            <div className="p-2 h-48 overflow-y-auto scrollbar-custom">
                <div className="grid grid-cols-8 gap-1">
                    <AnimatePresence mode="wait">
                        {activeCategory === 'recent' ? (
                            recentEmojis.map((emoji, index) => (
                                <motion.button
                                    key={`recent-${index}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    whileHover={{ scale: 1.2 }}
                                    onClick={() => handleEmojiSelect(emoji)}
                                    className="p-1 text-xl hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                >
                                    {emoji}
                                </motion.button>
                            ))
                        ) : (
                            emojis?.map((emoji, index) => (
                                <motion.button
                                    key={emoji.slug || index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    whileHover={{ scale: 1.2 }}
                                    onClick={() => handleEmojiSelect(emoji.character)}
                                    className="p-1 text-xl hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                >
                                    {emoji.character}
                                </motion.button>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}