import React from 'react';
import { Message } from '@/redux/chatSlice';
import { useTheme, themes } from '@/contexts/ThemeContext';
import { MessageCircle, ChevronRight } from 'lucide-react';

interface ReplyThreadProps {
  replies: Message[];
  onViewThread: () => void;
}

export default function ReplyThread({ replies, onViewThread }: ReplyThreadProps) {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  if (replies.length === 0) return null;

  return (
    <button
      onClick={onViewThread}
      className={`
        flex items-center space-x-2 mt-1
        text-sm ${currentTheme.text}
        opacity-75 hover:opacity-100
        transition-opacity duration-200
      `}
    >
      <MessageCircle className="w-4 h-4" />
      <span>{replies.length} repl{replies.length === 1 ? 'y' : 'ies'}</span>
      <ChevronRight className="w-4 h-4" />
    </button>
  );
}