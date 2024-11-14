import React, { useState, useEffect } from 'react';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSocket } from '@/contexts/SocketContext';
import EmojiPicker from './EmojiPicker';
import { toast } from 'react-hot-toast';

interface MessageInputProps {
    conversationId: string;
    onSendMessage: (content: string) => void;
}

export default function MessageInput({ conversationId, onSendMessage }: MessageInputProps) {
    const { currentTheme } = useTheme();
    const { socketService } = useSocket();
    const [message, setMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
            socketService.sendStopTyping(conversationId);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        socketService.sendTyping(conversationId);
    };

    const handleBlur = () => {
        socketService.sendStopTyping(conversationId);
    };

    const handleEmojiSelect = (emoji: string) => {
        setMessage(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsRecording(true);
            toast.info('Voice recording coming soon');
        } catch (error) {
            toast.error('Unable to access microphone');
        }
    };

    // Clean up typing status when component unmounts
    useEffect(() => {
        return () => {
            socketService.sendStopTyping(conversationId);
        };
    }, [conversationId]);

    return (
        <div className={`p-4 border-t ${currentTheme.border}`}>
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={`p-2 rounded-xl ${currentTheme.buttonHover}`}
                    >
                        <Smile className={currentTheme.iconColor} />
                    </button>

                    {showEmojiPicker && (
                        <div className="absolute bottom-full mb-2">
                            <EmojiPicker
                                onSelect={handleEmojiSelect}
                                onClose={() => setShowEmojiPicker(false)}
                            />
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className={`p-2 rounded-xl ${currentTheme.buttonHover}`}
                >
                    <Paperclip className={currentTheme.iconColor} />
                </button>

                <input
                    type="text"
                    value={message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Type your message..."
                    className={`
            flex-1 ${currentTheme.input} rounded-xl px-4 py-2
            focus:outline-none focus:ring-2 focus:ring-${currentTheme.accent}-500/50
            ${currentTheme.text} placeholder:${currentTheme.mutedText}
          `}
                />

                {message.trim() ? (
                    <button
                        type="submit"
                        className={`
              p-2 rounded-xl bg-gradient-to-r ${currentTheme.primary}
              transform hover:scale-105 transition-all duration-200
            `}
                    >
                        <Send className="w-6 h-6 text-white" />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={startRecording}
                        className={`p-2 rounded-xl ${currentTheme.buttonHover}`}
                    >
                        <Mic className={`w-6 h-6 ${isRecording ? 'text-red-500 animate-pulse' : currentTheme.iconColor}`} />
                    </button>
                )}
            </form>
        </div>
    );
}