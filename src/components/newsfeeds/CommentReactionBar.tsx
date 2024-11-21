import React from 'react';
import Lottie from 'lottie-react';
import likeAnimation from '../../../public/emoji/like.json';
import loveAnimation from '../../../public/emoji/love.json';
import hahaAnimation from '../../../public/emoji/haha.json';
import wowAnimation from '../../../public/emoji/wow.json';
import sadAnimation from '../../../public/emoji/sad.json';
import angryAnimation from '../../../public/emoji/angry.json';
import { useTheme } from '@/contexts/ThemeContext';

interface ReactionBarProps {
  onReact: (type: string) => void; 
}

const reactions = [
  { type: 'like', animation: likeAnimation },
  { type: 'love', animation: loveAnimation },
  { type: 'haha', animation: hahaAnimation },
  { type: 'wow', animation: wowAnimation },
  { type: 'sad', animation: sadAnimation },
  { type: 'angry', animation: angryAnimation },
];

const CommentReactionBar: React.FC<ReactionBarProps> = ({ onReact }) => {
  const { currentTheme } = useTheme();

  return (
    <div
      className={`${currentTheme.bg} absolute top-[-45px] left-18 transform translate-x-[-50%] flex gap-2 p-2 rounded-xl shadow-lg z-50 transition-transform duration-200`}
    >
      {reactions.map((reaction) => (
        <div
          key={reaction.type}
          className="flex justify-center items-center cursor-pointer hover:scale-110 transition-transform"
          onClick={() => onReact(reaction.type)}
        >
          <Lottie
            animationData={reaction.animation}
            loop={true}
            style={{ width: 40, height: 40 }} 
          />
        </div>
      ))}
    </div>
  );
};

export default CommentReactionBar;
