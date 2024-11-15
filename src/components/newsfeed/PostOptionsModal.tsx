import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
    Flag, Bookmark, VolumeX, UserMinus, Share2, Link,
    MessageCircle, QrCode, Star, AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PostOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    isOwnPost?: boolean;
}

export default function PostOptionsModal({ isOpen, onClose, isOwnPost = false }: PostOptionsModalProps) {
    const { currentTheme } = useTheme();

    const handleAction = (action: string) => {
        toast.success(`${action} action triggered`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${currentTheme.bg} rounded-xl max-w-sm w-full overflow-hidden`}>
                {isOwnPost ? (
                    <>
                        <button
                            onClick={() => handleAction('Edit')}
                            className={`w-full p-4 flex items-center justify-center ${currentTheme.text} font-semibold border-b ${currentTheme.border}`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleAction('Archive')}
                            className={`w-full p-4 flex items-center justify-center ${currentTheme.text} font-semibold border-b ${currentTheme.border}`}
                        >
                            Archive
                        </button>
                        <button
                            onClick={() => handleAction('Hide like count')}
                            className={`w-full p-4 flex items-center justify-center ${currentTheme.text} font-semibold border-b ${currentTheme.border}`}
                        >
                            Hide like count
                        </button>
                        <button
                            onClick={() => handleAction('Turn off commenting')}
                            className={`w-full p-4 flex items-center justify-center ${currentTheme.text} font-semibold border-b ${currentTheme.border}`}
                        >
                            Turn off commenting
                        </button>
                        <button
                            onClick={() => handleAction('Delete')}
                            className="w-full p-4 flex items-center justify-center text-red-500 font-semibold border-b border-gray-200 dark:border-gray-700"
                        >
                            Delete
                        </button>
                    </>
                ) : (
                    <>
                        {[
                            { icon: Flag, label: 'Report', color: 'text-red-500' },
                            { icon: Bookmark, label: 'Save' },
                            { icon: QrCode, label: 'QR code' },
                            { icon: Share2, label: 'Share to...' },
                            { icon: Link, label: 'Copy link' },
                            { icon: VolumeX, label: 'Mute' },
                            { icon: UserMinus, label: 'Unfollow' },
                            { icon: MessageCircle, label: 'About this account' },
                        ].map(({ icon: Icon, label, color }) => (
                            <button
                                key={label}
                                onClick={() => handleAction(label)}
                                className={`w-full p-4 flex items-center space-x-3 ${currentTheme.buttonHover} ${color || currentTheme.text}`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </>
                )}

                <button
                    onClick={onClose}
                    className={`w-full p-4 flex items-center justify-center ${currentTheme.text} font-semibold border-t ${currentTheme.border}`}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}