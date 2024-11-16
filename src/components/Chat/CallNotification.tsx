import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, PhoneOff } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

interface CallNotificationProps {
    caller: {
        id: string;
        firstName: string;
        lastName: string;
    };
    onAccept: () => void;
    onReject: () => void;
}

export default function CallNotification({ caller, onAccept, onReject }: CallNotificationProps) {
    const { currentTheme } = useTheme();
    const navigate = useNavigate();

    const handleAccept = () => {
        onAccept();
        navigate(`/call/${caller.id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`
        fixed top-4 right-4 z-50 
        ${currentTheme.bg} rounded-lg shadow-lg border ${currentTheme.border}
        p-4 max-w-sm w-full
      `}
        >
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                    <Phone className="w-6 h-6 text-white" />
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
                <button
                    onClick={onReject}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center space-x-2"
                >
                    <PhoneOff className="w-4 h-4" />
                    <span>Decline</span>
                </button>
                <button
                    onClick={handleAccept}
                    className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                    <Phone className="w-4 h-4" />
                    <span>Accept</span>
                </button>
            </div>
        </motion.div>
    );
}