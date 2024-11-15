import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { X } from 'lucide-react';

const EMOJI_CATEGORIES = {
    'Smileys & People': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘'],
    'Animals & Nature': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'],
    'Food & Drink': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝'],
    'Activities': ['⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏'],
    'Objects': ['⌚️', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀'],
};

interface EmojiPickerProps {
    onSelect: (emoji: string) => void;
    onClose: () => void;
}

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
    const { theme } = useTheme();
    const [activeCategory, setActiveCategory] = React.useState(Object.keys(EMOJI_CATEGORIES)[0]);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-72">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Emojis</h3>
                <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto scrollbar-custom p-2 border-b border-gray-200 dark:border-gray-700">
                {Object.keys(EMOJI_CATEGORIES).map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`flex-shrink-0 px-3 py-1 rounded-lg text-sm mr-2 transition-colors ${activeCategory === category
                                ? 'bg-blue-500 text-white'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Emoji Grid */}
            <div className="p-2 h-48 overflow-y-auto scrollbar-custom">
                <div className="grid grid-cols-8 gap-1">
                    {EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES].map((emoji, index) => (
                        <button
                            key={index}
                            onClick={() => onSelect(emoji)}
                            className="p-1 text-xl hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}