import React, { useRef } from 'react';
import { Image, File, Link, MapPin } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'react-hot-toast';

interface AttachmentMenuProps {
    onClose: () => void;
    onSelectFiles: (files: FileList | null) => void;
}

export default function AttachmentMenu({ onClose, onSelectFiles }: AttachmentMenuProps) {
    const { theme } = useTheme();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageClick = () => {
        imageInputRef.current?.click();
    };

    const handleLocationShare = () => {
        toast.info('Location sharing coming soon');
    };

    const handleLinkShare = () => {
        toast.info('Link sharing coming soon');
    };

    return (
        <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[180px]">
            <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => onSelectFiles(e.target.files)}
                className="hidden"
                multiple
            />
            <input
                type="file"
                ref={imageInputRef}
                accept="image/*"
                onChange={(e) => onSelectFiles(e.target.files)}
                className="hidden"
                multiple
            />

            {[
                { icon: Image, label: 'Photos & Videos', onClick: handleImageClick },
                { icon: File, label: 'Documents', onClick: handleFileClick },
                { icon: Link, label: 'Share Link', onClick: handleLinkShare },
                { icon: MapPin, label: 'Location', onClick: handleLocationShare },
            ].map((item, index) => (
                <button
                    key={index}
                    onClick={item.onClick}
                    className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <item.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                </button>
            ))}
        </div>
    );
}