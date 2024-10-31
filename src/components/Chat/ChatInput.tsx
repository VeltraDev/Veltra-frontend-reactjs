import React, { useState, useEffect, useRef } from 'react';
import { SmileIcon } from 'lucide-react';
import { useSocket } from '@/context/SocketContext';
import { useAppSelector } from '@/app/store';

interface ChatInputProps {
    conversationId?: string;
    onTyping: () => void;
    onStopTyping: () => void;
    onSendMessage: (content: string) => void;
}

export default function ChatInput({
    conversationId,
    onTyping,
    onStopTyping,
    onSendMessage
}: ChatInputProps) {
    const [inputMessage, setInputMessage] = useState("");
    const { socketService } = useSocket();
    const [typing, setTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastTypingTime = useRef(0); // Track the last typing time without triggering re-renders
    const activeConversation = useAppSelector((state) => state.chat.activeConversation);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || !conversationId) return;

        onSendMessage(inputMessage.trim());
        setInputMessage("");
        setTyping(false);
        socketService.emitStopTyping(activeConversation.id); // Stop typing on message send
    };

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);

        if (!typing) {
            setTyping(true);
            socketService.emitTyping(activeConversation.id); // Emit typing event when user starts typing
        }

        // Update the last typing time
        lastTypingTime.current = new Date().getTime();

        // Clear the previous timeout to avoid multiple timers
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // Set a new timeout to emit stopTyping if no typing activity within 1 second
        typingTimeoutRef.current = setTimeout(() => {
            const timeNow = new Date().getTime();
            const timeDiff = timeNow - lastTypingTime.current;
            if (timeDiff >= 1000 && typing) {
                socketService.emitStopTyping(activeConversation.id);
                setTyping(false);
            }
        }, 1000);
    };

    useEffect(() => {
        // Cleanup typing timeout on component unmount
        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, []);

    return (
        <form onSubmit={handleSubmit} className="relative flex p-2 px-4 leading-5 mt-2">
            <span className="absolute inset-y-0 flex items-center left-4">
                <SmileIcon className="text-white hover:bg-gray-300 focus:outline-none" />
            </span>
            <input
                type="text"
                value={inputMessage}
                onChange={onChangeHandler}
                onBlur={() => {
                    socketService.emitStopTyping(activeConversation.id);
                    setTyping(false);
                }}
                placeholder="Nhắn tin..."
                disabled={!conversationId}
                className="w-full focus:outline-none placeholder-gray-400 text-white border-secondary border-[2px] text-sm pl-12 bg-black rounded-3xl py-3"
            />
            <button type="submit" className="absolute right-7 flex items-center inset-y-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
            </button>
        </form>
    );
}
