import React from 'react';
import { useTheme, themes } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className={`rounded-lg shadow-lg p-6 w-full max-w-md ${currentTheme.bg}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-semibold ${currentTheme.text}`}>{title}</h2>
            <button onClick={onClose} className={`p-2 rounded-full ${currentTheme.buttonHover}`}>
              <X className={`w-5 h-5 ${currentTheme.iconColor}`} />
            </button>
          </div>
          <p className={`mb-4 ${currentTheme.text}`}>{description}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${currentTheme.buttonHover}`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;