import React, { useState, useRef } from 'react';
import { Send, Smile, Paperclip, Mic, X, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSocket } from '@/contexts/SocketContext';
import EmojiPicker from './EmojiPicker';
import { fileService } from '@/services/api/fileService';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';



export default function MessageInput() {
    const { currentTheme } = useTheme();
    const { chatSocketService } = useSocket();
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const conversationId = useSelector((state: RootState) => state.chat.activeConversation.id);
    const handleSubmit = async (e: React.FormEvent) => {
        console.log(conversationId)
        e.preventDefault();

        if (!conversationId) {
            toast.error('Conversation ID is missing');
            return;
        }

        if (!message.trim() && selectedFiles.length === 0) {
            return;
        }

        try {
            setIsUploading(true);
            const uploadedFiles = [];

            // Upload files if any
            if (selectedFiles.length > 0) {
                for (const file of selectedFiles) {
                    const result = await fileService.upload(file);
                    uploadedFiles.push({
                        url: result.data.url,
                        type: file.type.startsWith('image/') ? 'image' as const : 'document' as const
                    });
                }
            }

            // Prepare message payload
            const messagePayload = {
                conversationId,
                content: message.trim(),
                files: uploadedFiles.length > 0 ? uploadedFiles : undefined
            };

            // Send message
            await chatSocketService.sendMessage(messagePayload);

            // Reset state
            setMessage('');
            setSelectedFiles([]);
            setShowEmojiPicker(false);

        } catch (error: any) {
            console.error('Error sending message:', error);
            toast.error(error.message || 'Failed to send message');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        try {
            // Validate each file
            files.forEach(file => {
                fileService.validateFile(file);
            });

            // Validate total number of files
            if (files.length > 10) {
                throw new Error('Maximum 10 files allowed');
            }

            setSelectedFiles(prev => [...prev, ...files]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleTyping = () => {
        if (conversationId) {
            chatSocketService.sendTyping(conversationId);
        }
    };

    return (
        <div className={`p-4 border-t ${currentTheme.border}`}>
            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                        <div
                            key={index}
                            className={`
                relative group rounded-lg overflow-hidden
                ${file.type.startsWith('image/') ? 'w-20 h-20' : 'p-3 bg-gray-100 dark:bg-gray-800'}
              `}
                        >
                            {file.type.startsWith('image/') ? (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <ImageIcon className="w-5 h-5" />
                                    <span className="text-sm truncate max-w-[100px]">{file.name}</span>
                                </div>
                            )}
                            <button
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

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
                                onSelect={(emoji) => {
                                    setMessage(prev => prev + emoji);
                                    setShowEmojiPicker(false);
                                }}
                                onClose={() => setShowEmojiPicker(false)}
                            />
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-2 rounded-xl ${currentTheme.buttonHover}`}
                >
                    <Paperclip className={currentTheme.iconColor} />
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        handleTyping();
                    }}
                    placeholder="Type your message..."
                    className={`
            flex-1 ${currentTheme.input} rounded-xl px-4 py-2
            focus:outline-none focus:ring-2 focus:ring-blue-500/50
            ${currentTheme.text} placeholder:${currentTheme.mutedText}
          `}
                    disabled={isUploading}
                />

                {(message.trim() || selectedFiles.length > 0) ? (
                    <button
                        type="submit"
                        disabled={isUploading}
                        className={`
              p-2 rounded-xl bg-gradient-to-r ${currentTheme.primary}
              transform hover:scale-105 transition-all duration-200
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                    >
                        {isUploading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send className="w-6 h-6 text-white" />
                        )}
                    </button>
                ) : (
                    <button
                        type="button"
                        className={`p-2 rounded-xl ${currentTheme.buttonHover}`}
                    >
                        <Mic className={`w-6 h-6 ${currentTheme.iconColor}`} />
                    </button>
                )}
            </form>
        </div>
    );
}