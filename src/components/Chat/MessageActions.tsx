import React, { useState } from 'react';
import { deleteMessage, recallMessage } from '@/redux/chatSlice';
import { useTheme, themes } from '@/contexts/ThemeContext';
import { useDispatch } from 'react-redux';

import {
  Smile,
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
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { useSocket } from '@/contexts/SocketContext';
import { Message } from '@/types';
import { AppDispatch } from '@/redux/store';

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
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const dispatch = useDispatch<AppDispatch>()
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
      await dispatch(deleteMessage(message.id)).unwrap()
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
    { icon: Forward, label: 'Forward', onClick: () => setShowForwardDialog(true) },
    { icon: Smile, label: 'React', onClick: onReact },
    { icon: Trash2, label: 'Delete', onClick: () => setShowConfirmDelete(true) },
    { icon: MoreHorizontal, label: 'More', onClick: () => setShowMore(!showMore) },
  ];

  const moreActions = [
    { icon: Copy, label: 'Copy', onClick: onCopy },
    { icon: Edit2, label: 'Edit', onClick: onEdit },
    { icon: Pin, label: 'Pin', onClick: onPin },
    { icon: XCircle, label: 'Recall', onClick: handleRecall },
  ];

  if (message.isRecalled) {
    return null;
  }

  return (
    <>
      <div className={`
        absolute ${isOwner ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} 
        top-1/2 -translate-y-1/2 mx-2 px-8
        flex items-center space-x-1
        animate-fadeIn
      `}>
        {/* Quick Actions */}
        {actions.map((action, index) => (
          <div key={index} className="group flex relative">
            <button
              onClick={action.onClick}
              className={`
                p-1.5 rounded-xl
                ${currentTheme.input} 
                hover:bg-opacity-80 
                transition-all duration-200
                group/action
              `}
            >
              <action.icon className={`w-4 h-4 ${currentTheme.text} opacity-60 group-hover/action:opacity-100`} />
            </button>
            <span className={`group-hover:opacity-100 transition-opacity ${currentTheme.tooltipBg} px-1 text-sm ${currentTheme.tooltipText} rounded-md absolute left-1/2 -translate-x-1/2 translate-y-full opacity-0  p-1 mx-auto`}>
              {action.label}
            </span>
          </div>
        ))}

        {/* More Actions */}
        {showMore && (
          <div className={`absolute top-0 right-0 mt-8 w-48 ${currentTheme.bg} shadow-lg rounded-lg z-10`}>
            {moreActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`
                  w-full flex items-center space-x-2 p-2 rounded-lg
                  ${currentTheme.hover} transition-all duration-200
                `}
              >
                <action.icon className={`w-4 h-4 ${currentTheme.iconColor}`} />
                <span className={`text-sm ${currentTheme.text}`}>{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Forward Message Dialog */}
      <ForwardMessageDialog
        isOpen={showForwardDialog}
        onClose={() => setShowForwardDialog(false)}
        onSubmit={handleForward}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Message"
        description="Are you sure you want to delete this message? This action cannot be undone."
      />
    </>
  );
}