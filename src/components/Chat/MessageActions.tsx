import React, { useState } from 'react';
import { Message } from '@/redux/chatSlice';
import { useTheme, themes } from '@/contexts/ThemeContext';
import { useDispatch } from 'react-redux';
import { recallMessage, deleteMessage } from '@/redux/chatSlice';
import {
  Smile,
  Reply,
  Forward,
  Edit2,
  Trash2,
  Pin,
  MoreHorizontal,
  Copy,
  XCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ForwardMessageDialog from './ForwardMessageDialog';
import { useSocket } from '@/contexts/SocketContext';

interface MessageActionsProps {
  message: Message;
  onReply: () => void;
  onReact: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPin: () => void;
  onCopy: () => void;
  isOwner: boolean;
}

export default function MessageActions({
  message,
  onReply,
  onReact,
  onEdit,
  onDelete,
  onPin,
  onCopy,
  isOwner
}: MessageActionsProps) {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const [showMore, setShowMore] = React.useState(false);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const dispatch = useDispatch();
  const { socketService } = useSocket();

  const handleRecall = async () => {
    try {
      await dispatch(recallMessage(message.id)).unwrap();
      toast.success('Message recalled');
    } catch (error) {
      toast.error('Failed to recall message');
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteMessage(message.id)).unwrap();
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const handleForward = (targetConversationId: string) => {
    socketService.forwardMessage({
      originalMessageId: message.id,
      targetConversationId
    });
    setShowForwardDialog(false);
  };

  const actions = [
    { icon: Smile, label: 'React', onClick: onReact, showAlways: true },
    { icon: Reply, label: 'Reply', onClick: onReply, showAlways: true },
    { icon: Forward, label: 'Forward', onClick: () => setShowForwardDialog(true), showAlways: true },
    { icon: Copy, label: 'Copy', onClick: onCopy, showAlways: true },
    { icon: Edit2, label: 'Edit', onClick: onEdit, showAlways: false },
    { icon: Pin, label: 'Pin', onClick: onPin, showAlways: false },
    { icon: XCircle, label: 'Recall', onClick: handleRecall, showAlways: false },
    { icon: Trash2, label: 'Delete', onClick: handleDelete, showAlways: false },
  ];

  if (message.isRecalled) {
    return null;
  }

  return (
    <>
      <div className={`
        absolute ${isOwner ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} 
        top-1/2 -translate-y-1/2 mx-2
        flex items-center space-x-1
        animate-fadeIn
      `}>
        {/* Quick Actions */}
        {actions
          .filter(action => action.showAlways || (showMore && isOwner))
          .map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`
                p-1.5 rounded-xl
                ${currentTheme.input} 
                hover:bg-opacity-80 
                transition-all duration-200
                group/action
                tooltip-trigger
              `}
            >
              <action.icon className={`w-4 h-4 ${currentTheme.text} opacity-60 group-hover/action:opacity-100`} />
              <span className="tooltip">{action.label}</span>
            </button>
          ))}

        {/* More Actions Button */}
        {isOwner && (
          <button
            onClick={() => setShowMore(!showMore)}
            className={`
              p-1.5 rounded-xl
              ${currentTheme.input} 
              hover:bg-opacity-80 
              transition-all duration-200
              group/action
            `}
          >
            <MoreHorizontal className={`w-4 h-4 ${currentTheme.text} opacity-60 group-hover/action:opacity-100`} />
          </button>
        )}
      </div>

      {/* Forward Message Dialog */}
      <ForwardMessageDialog
        isOpen={showForwardDialog}
        onClose={() => setShowForwardDialog(false)}
        onSubmit={handleForward}
      />
    </>
  );
}