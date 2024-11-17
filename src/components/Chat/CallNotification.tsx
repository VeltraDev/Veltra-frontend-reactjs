import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Phone, PhoneOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface CallNotificationProps {
    caller: {
        id: string;
        firstName: string;
        lastName: string;
        avatar?: string | null;
    };
    conversationId: string;
    onAccept: () => void;
    onReject: () => void;
}

export default function CallNotification({
    caller,
    conversationId,
    onAccept,
    onReject
}: CallNotificationProps) {
    const { currentTheme } = useTheme();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`
        ${currentTheme.bg} rounded-xl shadow-lg border ${currentTheme.border}
        p-4 max-w-sm w-full
      `}
        >
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <img
                        src={caller.avatar || `https://ui-avatars.com/api/?name=${caller.firstName}`}
                        alt={`${caller.firstName} ${caller.lastName}`}
                        className="w-12 h-12 rounded-full ring-2 ring-blue-500"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                        <Phone className="w-3 h-3 text-white" />
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className={`font-semibold ${currentTheme.text}`}>
                        Incoming Video Call
                    </h3>
                    <p className={`text-sm ${currentTheme.mutedText}`}>
                        From {caller.firstName} {caller.lastName}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onReject}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center space-x-2"
                >
                    <PhoneOff className="w-4 h-4" />
                    <span>Decline</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAccept}
                    className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                    <Phone className="w-4 h-4" />
                    <span>Accept</span>
                </motion.button>
            </div>
        </motion.div>
    );
}