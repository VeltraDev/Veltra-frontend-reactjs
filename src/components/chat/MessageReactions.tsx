import React from 'react';
import { useTheme, themes } from '@/contexts/ThemeContext';

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface MessageReactionsProps {
  reactions: Reaction[];
  onReact: (emoji: string) => void;
  currentUserId: string;
}

export default function MessageReactions({
  reactions,
  onReact,
  currentUserId
}: MessageReactionsProps) {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  return (
    <div className="flex flex-wrap gap-1 mt-1.5 animate-fadeIn">
      {reactions.map((reaction, index) => {
        const hasReacted = reaction.users.includes(currentUserId);
        
        return (
          <button
            key={index}
            onClick={() => onReact(reaction.emoji)}
            className={`
              ${currentTheme.input} 
              rounded-full px-2 py-0.5 
              text-xs flex items-center space-x-1
              border ${hasReacted ? `border-${currentTheme.accent}-500` : currentTheme.border}
              transition-all duration-200 
              hover:scale-105 hover:shadow-md
              ${currentTheme.messageGlow}
              group
            `}
          >
            <span className="transform group-hover:scale-125 transition-transform">
              {reaction.emoji}
            </span>
            <span className={`${currentTheme.text} opacity-75`}>
              {reaction.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}