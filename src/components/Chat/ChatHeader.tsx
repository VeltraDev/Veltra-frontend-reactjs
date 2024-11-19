import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme } from '@/contexts/ThemeContext';
import {
    Menu, Phone, Video, Search, Info,
    MoreVertical, ArrowLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import UserStatus from './UserStatus';

interface ChatHeaderProps {
    onToggleGroupInfo: () => void;
    onToggleChatList?: () => void;
}

export default function ChatHeader({ onToggleGroupInfo, onToggleChatList }: ChatHeaderProps) {
    const { currentTheme } = useTheme();
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootState) => state.auth.user?.user);
    const conversation = useSelector((state: RootState) => state.chat.activeConversation);
    const onlineUsers = useSelector((state: RootState) => state.chat.onlineUsers);

    const handleVideoCall = async () => {
        if (!conversation || !currentUser) return;

        if (conversation.isGroup) {
            toast.error('Video calls are not available in group chats');
            return;
        }

        const otherUser = conversation.users.find((u: any) => u.id !== currentUser.id);
        if (!otherUser) {
            toast.error('Cannot find user to call');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            stream.getTracks().forEach(track => track.stop());
            navigate(`/call/${conversation.id}`);
        } catch (err) {
            console.error('Media permission error:', err);
            toast.error('Please allow camera and microphone access to make a call');
        }
    };




    // Tìm người dùng khác nếu không phải nhóm
    const otherUser = conversation?.isGroup === false && currentUser
        ? conversation.users?.find((u: any) => u.id !== currentUser.id)
        : null;




    // Kiểm tra trạng thái online của otherUser
    const isOnline = otherUser
        ? onlineUsers.some((user: any) => user.id === otherUser.id)
        : false;

   




    return (
        <div className={`p-4 border-b ${currentTheme.border} flex items-center justify-between bg-opacity-90 backdrop-blur-sm`}>
            <div className="flex items-center space-x-4">
                <button
                    onClick={onToggleChatList}
                    className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                {/* Avatar */}
                {conversation && (
                    <div className="relative">
                        <img
                            src={
                                conversation.isGroup
                                    ? conversation.picture || `https://ui-avatars.com/api/?name=${conversation.name}`
                                    : otherUser?.picture || `https://ui-avatars.com/api/?name=${otherUser?.name}`
                            }
                            alt={conversation.isGroup ? conversation.name : otherUser?.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        {!conversation.isGroup && (
                            <div className={`
            absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full
            ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
            border-2 border-white dark:border-gray-900
            transition-all duration-200
          `} />
                        )}

                    </div>
                )}

                {/* Info */}
                {conversation && (
                    <div>
                        <h2 className={`font-semibold ${currentTheme.text}  overflow-hidden text-ellipsis whitespace-nowrap max-w-96`}>
                            {conversation.isGroup ? conversation.name : `${otherUser?.firstName ?? 'No First Name'} ${otherUser?.lastName ?? 'No Last Name'}` || "No User"}
                        </h2>
                        <p className={`text-sm ${currentTheme.mutedText}`}>
                            {conversation.isGroup
                                ? `${conversation.users?.length || 0} members`
                                : otherUser ? (isOnline ? 'Online' : 'Offline') : 'User not found'}
                        </p>

                    </div>
                )}


            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
                {!conversation.isGroup && (
                    <>
                        <button
                            className={`p-2 rounded-xl ${currentTheme.buttonHover}`}
                            onClick={() => toast.info('Voice call coming soon')}
                        >
                            <Phone className={`w-5 h-5 ${currentTheme.iconColor}`} />
                        </button>
                        <button
                            className={`p-2 rounded-xl ${currentTheme.buttonHover}`}
                            onClick={handleVideoCall}
                        >
                            <Video className={`w-5 h-5 ${currentTheme.iconColor}`} />
                        </button>
                    </>
                )}
                <button
                    className={`p-2 rounded-xl ${currentTheme.buttonHover}`}
                    onClick={() => toast.info('Search coming soon')}
                >
                    <Search className={`w-5 h-5 ${currentTheme.iconColor}`} />
                </button>
                <button
                    className={`p-2 rounded-xl ${currentTheme.buttonHover}`}
                    onClick={onToggleGroupInfo}
                >
                    <Info className={`w-5 h-5 ${currentTheme.iconColor}`} />
                </button>
                <button
                    className={`p-2 rounded-xl ${currentTheme.buttonHover}`}
                    onClick={() => toast.info('More options coming soon')}
                >
                    <MoreVertical className={`w-5 h-5 ${currentTheme.iconColor}`} />
                </button>
            </div>
        </div>
    );
}
