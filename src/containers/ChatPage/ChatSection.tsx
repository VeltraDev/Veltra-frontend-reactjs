
import { useAppDispatch, useAppSelector } from '@/app/store';
import { useSocket } from '@/context/SocketContext';
import { updateMessagesAndConversations } from '@/features/chatSlice';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import ChatHeader from "../../components/Chat/ChatHeader";
import ChatInput from "../../components/Chat/ChatInput";
import MessageList from '../../components/Chat/MessageList';
import { useAuth } from '@/context/AuthContext';

function ChatSection() {
    const dispatch = useAppDispatch();
    const { socketService } = useSocket();
    const [isConnected, setIsConnected] = useState(false);
    const [typingUser, setTypingUser] = useState(null); 
    const conversation = useAppSelector((state) => state.chat.activeConversation);
    const token = localStorage.getItem('accessToken');
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!socketService) return;

        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);

        socketService.onConnect(handleConnect);
        socketService.onDisconnect(handleDisconnect);

        setIsConnected(socketService.isConnected());

        return () => {
            socketService.offConnect(handleConnect);
            socketService.offDisconnect(handleDisconnect);
        };
    }, [socketService]);

    useEffect(() => {
        if (!socketService || !conversation?.id) return;

        const removeMessageListener = socketService.onReceiveMessage((message) => {
            dispatch(updateMessagesAndConversations(message));
            toast.success('New message received!');
        });

        const removeTypingInfoListener = socketService.onTypingInfo((conversationId, user) => {
            if (conversationId === conversation.id && user.id !== currentUser.id) {
                setTypingUser(user);
            }
        });

        const removeStopTypingListener = socketService.onStopTyping((conversationId) => {
            if (conversationId === conversation.id) {
                setTypingUser(null);
            }
        });

        // New listener for stopTypingInfo
        const removeStopTypingInfoListener = socketService.onStopTypingInfo((conversationId, user) => {
            if (conversationId === conversation.id) {
                setTypingUser(null); 
            }
        });

        return () => {
            removeMessageListener();
            removeTypingInfoListener();
            removeStopTypingListener();
            removeStopTypingInfoListener(); 
        };
    }, [socketService, conversation?.id, dispatch]);

    const handleSendMessage = async (content: string) => {
        if (!socketService || !conversation?.id) return;

        try {
            await socketService.sendMessage({
                conversationId: conversation.id,
                content
            });
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    if (!token) {
        return <div>Please login to continue</div>;
    }

    if (!socketService || !isConnected) {
        return <div>Connecting...</div>;
    }

    return (
        <div className="flex-1 font-nanum max-w-[1049px] flex flex-col h-screen">
            <ChatHeader user={conversation} typingUser={typingUser} />
            <MessageList typingUser={typingUser} />
            <ChatInput
                conversationId={conversation?.id}
                onSendMessage={handleSendMessage}
                onTyping={() => socketService.emitTyping(conversation.id)}
                onStopTyping={() => socketService.emitStopTyping(conversation.id)}
            />
        </div>
    );
}

export default ChatSection;

