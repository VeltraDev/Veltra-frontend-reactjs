import React from 'react';
import Modal from 'react-modal';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

Modal.setAppElement('#root'); // Thiết lập phần tử gốc của ứng dụng

interface ErrorModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    errorMessage: string;
    title?: string; // Thêm props cho tiêu đề
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onRequestClose, errorMessage, title }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Error Modal"
            className="fixed inset-0 flex items-center justify-center z-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
        >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-50 relative">
                <button
                    onClick={onRequestClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
                    {title || 'Thông báo lỗi'}
                </h2>
                <p className="mb-4 text-center text-gray-700">
                    {errorMessage || 'Đã xảy ra lỗi. Vui lòng thử lại!'}
                </p>
                <div className="flex justify-center">
                    <Button
                        onClick={onRequestClose}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                    >
                        Đóng
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ErrorModal;
