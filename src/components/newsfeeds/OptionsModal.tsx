import React, { useState } from 'react';
import { http } from '@/api/http';
import { toast } from 'react-hot-toast';
import EditPostModal from './EditPostModal';

interface OptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  postId: string;
  postToEdit: {
    id: string;
    content: string;
    attachments: { url: string; type: string }[];
  };
  onPostDelete: (postId: string) => void;
  onPostUpdated: () => void; 
}

const OptionsModal: React.FC<OptionsModalProps> = ({
  isVisible,
  onClose,
  postId,
  postToEdit,
  onPostDelete,
  onPostUpdated,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDeletePost = async () => {
    try {
      await http.delete(`/posts/${postId}`);
      toast.success('Post deleted successfully');
      onPostDelete(postId);
    } catch (err) {
      console.error('Failed to delete post:', err);
      toast.error('Failed to delete post');
    }
    onClose();
  };

  const handleEditPost = () => {
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    onClose(); 
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Options Modal */}
      <div className="bg-black bg-opacity-10 fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-[#262626] w-[200px] py-4 shadow-lg rounded-xl">
          <ul className="text-center space-y-4">
            <li
              className="cursor-pointer font-semibold text-yellow-500 dark:text-gray-300 hover:opacity-80"
              onClick={handleEditPost}
            >
              Edit
            </li>
            <li
              className="cursor-pointer text-red-400 pt-4 font-semibold hover:opacity-80 border-t border-zinc-700"
              onClick={handleDeletePost}
            >
              Delete
            </li>
            <li
              className="text-[#f5f5f5] font-semibold pt-3 cursor-pointer hover:opacity-80 border-t border-zinc-700"
              onClick={onClose}
            >
              Cancel
            </li>
          </ul>
        </div>
      </div>

      {isEditModalOpen && (
        <EditPostModal
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          postToEdit={postToEdit} 
          onPostUpdated={onPostUpdated} 
        />
      )}
    </>
  );
};

export default OptionsModal;
