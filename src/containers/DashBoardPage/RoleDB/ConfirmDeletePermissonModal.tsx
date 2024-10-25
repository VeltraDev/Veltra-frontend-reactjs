import React from 'react';
import Modal from 'react-modal';
import { X } from 'lucide-react';

interface ConfirmDeletePermissionModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onDelete: () => void;
}

const ConfirmDeletePermissionModal: React.FC<ConfirmDeletePermissionModalProps> = ({ isOpen, onRequestClose, onDelete }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirm Delete Permission"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto relative">
        <button onClick={onRequestClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">Confirm Delete Permission</h2>
        <p>Are you sure you want to delete this permission?</p>
        <div className="flex justify-end mt-4">
          <button onClick={onRequestClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2">Cancel</button>
          <button onClick={onDelete} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeletePermissionModal;