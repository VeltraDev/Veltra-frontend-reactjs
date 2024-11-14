import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Conversation } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'react-hot-toast';
import {
    Phone, Video, Search, MoreVertical,
    MessageSquare, Star, Archive, Bell, BellOff, Info,
    Share2, Shield, ArrowLeft, Users
} from 'lucide-react';
import UserStatus from './UserStatus';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
    conversation: Conversation;
    onToggleChatList?: () => void;
    onToggleGroupInfo: () => void;
    onToggleThread: () => void;
    isMuted: boolean;
    isStarred: boolean;
    isArchived: boolean;
    onToggleMute: () => void;
    onToggleStar: () => void;
    onToggleArchive: () => void;
}

export default function ChatHeader({
    conversation,
    onToggleChatList,
    onToggleGroupInfo,
    onToggleThread,
    isMuted,
    isStarred,
    isArchived,
    onToggleMute,
    onToggleStar,
    onToggleArchive
}: ChatHeaderProps) {
    const { currentTheme } = useTheme();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const [showMoreActions, setShowMoreActions] = useState(false);

    const isAdmin = conversation?.admin?.id === currentUser?.id;
    const isGroup = conversation?.isGroup;
    const otherUser = !isGroup ? conversation.users.find(u => u.id !== currentUser?.id) : null;


    const navigate = useNavigate()
    const handleVideoCall = () => {
        if (conversation.isGroup) {
            toast.error('Video calls are not available in group chats');
            return;
        }
        navigate(`/call/${conversation.id}`);
    };
    const handleVoiceCall = () => toast.info('Voice call feature coming soon');
    const handleSearch = () => toast.info('Search feature coming soon');
    const handleShare = () => toast.info('Share feature coming soon');
    const handleReport = () => toast.info('Report feature coming soon');

    return (
        <div className={`px-4 py-3 ${currentTheme.bg} border-b ${currentTheme.border} flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
                <button
                    onClick={onToggleChatList}
                    className={`lg:hidden p-2 rounded-xl ${currentTheme.buttonHover}`}
                >
                    <ArrowLeft className={`w-5 h-5 ${currentTheme.iconColor}`} />
                </button>

                <div
                    className="flex items-center space-x-3 cursor-pointer group"
                    onClick={onToggleGroupInfo}
                >
                    <div className="relative">
                        <img
                            src={conversation.picture || `https://ui-avatars.com/api/?name=${conversation.name}`}
                            alt={conversation.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
                        />
                        {isGroup ? (
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                                <Users className="w-3 h-3 text-white" />
                            </div>
                        ) : otherUser && (
                            <UserStatus
                                userId={otherUser.id}
                                className="absolute -bottom-1 -right-1"
                            />
                        )}
                    </div>

                    <div>
                        <h2 className={`font-semibold ${currentTheme.headerText} flex items-center space-x-2`}>
                            <span>{conversation.name}</span>
                            {isGroup && isAdmin && (
                                <span className="text-xs text-blue-500">(Admin)</span>
                            )}
                        </h2>
                        <p className={`text-sm ${currentTheme.mutedText}`}>
                            {isGroup ? (
                                `${conversation.users.length} members`
                            ) : otherUser && (
                                <UserStatus userId={otherUser.id} showText />
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={handleVoiceCall}
                    className={`p-2 rounded-xl ${currentTheme.buttonHover} hidden sm:block`}
                    title="Voice Call"
                >
                    <Phone className={`w-5 h-5 ${currentTheme.iconColor}`} />
                </button>

                <button
                    onClick={handleVideoCall}
                    className={`p-2 rounded-xl ${currentTheme.buttonHover} hidden sm:block`}
                    title="Video Call"
                >
                    <Video className={`w-5 h-5 ${currentTheme.iconColor}`} />
                </button>

                <button
                    onClick={handleSearch}
                    className={`p-2 rounded-xl ${currentTheme.buttonHover}`}
                    title="Search in Chat"
                >
                    <Search className={`w-5 h-5 ${currentTheme.iconColor}`} />
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowMoreActions(!showMoreActions)}
                        className={`p-2 rounded-xl ${currentTheme.buttonHover} ${showMoreActions ? 'bg-blue-500/10' : ''
                            }`}
                    >
                        <MoreVertical className={`w-5 h-5 ${showMoreActions ? 'text-blue-500' : currentTheme.iconColor
                            }`} />
                    </button>

                    {showMoreActions && (
                        <div className={`
              absolute right-0 top-full mt-2 w-56
              ${currentTheme.bg} rounded-xl shadow-lg
              border ${currentTheme.border}
              py-1 z-50
            `}>
                            {[
                                { icon: Info, label: 'View Info', onClick: onToggleGroupInfo },
                                { icon: isMuted ? Bell : BellOff, label: isMuted ? 'Unmute' : 'Mute', onClick: onToggleMute },
                                { icon: Star, label: isStarred ? 'Unstar' : 'Star', onClick: onToggleStar },
                                { icon: Archive, label: isArchived ? 'Unarchive' : 'Archive', onClick: onToggleArchive },
                                { icon: MessageSquare, label: 'Start Thread', onClick: onToggleThread },
                                { icon: Shield, label: 'Report', onClick: handleReport },
                                { icon: Share2, label: 'Share Chat', onClick: handleShare }
                            ].map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        item.onClick();
                                        setShowMoreActions(false);
                                    }}
                                    className={`
                    w-full px-4 py-2 text-left flex items-center space-x-3
                    ${currentTheme.buttonHover} transition-colors
                  `}
                                >
                                    <item.icon className={`w-4 h-4 ${currentTheme.iconColor}`} />
                                    <span className={currentTheme.text}>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}