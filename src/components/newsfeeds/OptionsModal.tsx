import React from 'react';
import { http } from '@/api/http'; 
import { toast } from 'react-hot-toast';

interface OptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  postId: string;
  onPostDelete: (postId: string) => void; 
  onPostEdit: (postId: string) => void; 
}

const OptionsModal: React.FC<OptionsModalProps> = ({
  isVisible,
  onClose,
  postId,
  onPostDelete,
  onPostEdit,
}) => {
  if (!isVisible) return null;

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
    toast.info('Opening edit modal...');
    onPostEdit(postId); 
    onClose(); 
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#262626] dark:bg-gray-800 w-[300px] p-4 shadow-lg rounded-3xl">
        <ul className="text-center space-y-4">
          <li
            className="cursor-pointer  font-semibold text-yellow-700 dark:text-gray-300 hover:opacity-80 "
            onClick={handleEditPost}
          >
            Edit
          </li>
          <li
            className="cursor-pointer text-red-500 font-semibold hover:opacity-80 "
            onClick={handleDeletePost}
          >
            Delete
          </li>
          <li
            className="text-gray-500 font-semibold cursor-pointer hover:opacity-80"
            onClick={onClose}
          >
            Cancel
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OptionsModal;
