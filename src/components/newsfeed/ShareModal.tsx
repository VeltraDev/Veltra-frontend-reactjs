import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
    X, Link2, MessageCircle, Send, Facebook, Twitter,
    Instagram, Mail, QrCode
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    postId: string;
}

export default function ShareModal({ isOpen, onClose, postId }: ShareModalProps) {
    const { currentTheme } = useTheme();
    const [copied, setCopied] = useState(false);

    const shareOptions = [
        { icon: MessageCircle, label: 'Share to Direct', onClick: () => handleShare('direct') },
        { icon: Facebook, label: 'Share to Facebook', onClick: () => handleShare('facebook') },
        { icon: Twitter, label: 'Share to Twitter', onClick: () => handleShare('twitter') },
        { icon: Instagram, label: 'Share to Instagram Stories', onClick: () => handleShare('instagram') },
        // { icon: WhatsApp, label: 'Share to WhatsApp', onClick: () => handleShare('whatsapp') },
        { icon: Mail, label: 'Share via Email', onClick: () => handleShare('email') },
        { icon: QrCode, label: 'QR Code', onClick: () => handleShare('qr') },
    ];

    const handleShare = (platform: string) => {
        toast.success(`Sharing to ${platform}...`);
        onClose();
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(`https://example.com/p/${postId}`);
            setCopied(true);
            toast.success('Link copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Failed to copy link');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${currentTheme.bg} rounded-xl max-w-sm w-full overflow-hidden`}>
                {/* Header */}
                <div className={`p-4 border-b ${currentTheme.border} flex items-center justify-between`}>
                    <h2 className={`text-lg font-semibold ${currentTheme.text}`}>Share</h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full ${currentTheme.buttonHover}`}
                    >
                        <X className={`w-5 h-5 ${currentTheme.iconColor}`} />
                    </button>
                </div>

                {/* Share Options */}
                <div className="p-4 space-y-4">
                    {/* Copy Link */}
                    <div className={`flex items-center space-x-3 p-3 rounded-xl ${currentTheme.input}`}>
                        <input
                            type="text"
                            value={`https://example.com/p/${postId}`}
                            readOnly
                            className={`flex-1 bg-transparent ${currentTheme.text} focus:outline-none`}
                        />
                        <button
                            onClick={handleCopyLink}
                            className={`px-4 py-2 rounded-lg ${copied ? 'bg-green-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                                } transition-colors`}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>

                    {/* Share Platforms */}
                    <div className="grid grid-cols-2 gap-3">
                        {shareOptions.map((option) => (
                            <button
                                key={option.label}
                                onClick={option.onClick}
                                className={`
                  flex items-center space-x-3 p-3 rounded-xl
                  ${currentTheme.buttonHover}
                  transition-all duration-200
                  hover:scale-105
                `}
                            >
                                <option.icon className={`w-5 h-5 ${currentTheme.iconColor}`} />
                                <span className={`text-sm ${currentTheme.text}`}>{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cancel Button */}
                <button
                    onClick={onClose}
                    className={`w-full p-4 border-t ${currentTheme.border} ${currentTheme.text} font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}