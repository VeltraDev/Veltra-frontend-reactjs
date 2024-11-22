import React from 'react';
import Lottie from 'lottie-react';
import likeAnimation from '../../../public/emoji/like.json';
import loveAnimation from '../../../public/emoji/love.json';
import hahaAnimation from '../../../public/emoji/haha.json';
import wowAnimation from '../../../public/emoji/wow.json';
import sadAnimation from '../../../public/emoji/sad.json';
import angryAnimation from '../../../public/emoji/angry.json';
import { useTheme } from '@/contexts/ThemeContext';

const reactions = [
  { type: 'like', animation: likeAnimation },
  { type: 'love', animation: loveAnimation },
  { type: 'haha', animation: hahaAnimation },
  { type: 'wow', animation: wowAnimation },
  { type: 'sad', animation: sadAnimation },
  { type: 'angry', animation: angryAnimation },
];

export default function ReactionBar({ onReact }: { onReact: (type: string) => void }) {
    const { currentTheme } = useTheme();
  return (
    <div
      className={`${currentTheme.bg} absolute top-[-45px] left-[40%] transform translate-x-0 flex gap-3 p-4 rounded-2xl shadow-lg z-50 transition-transform duration-200 ease-in-out scale-100`}
    >
      {reactions.map((reaction) => (
        <div
          key={reaction.type}
          className="w-5 h-5 flex justify-center items-center cursor-pointer hover:scale-110 transition-transform mx-1"
          onClick={() => onReact(reaction.type)}
          style={{
            transform: 'scale(2)', 
          }}
        >
          <Lottie
            animationData={reaction.animation}
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ))}
    </div>
  );
}
