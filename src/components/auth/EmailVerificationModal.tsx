// src/components/auth/EmailVerificationModal.tsx

import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { http } from '@/api/http';

Modal.setAppElement('#root'); // Thiết lập phần tử gốc của ứng dụng

interface EmailVerificationModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    email: string; // Thêm email vào props
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({ isOpen, onRequestClose, email }) => {
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState('');

    const handleResend = async () => {
        setIsResending(true);
        setResendMessage('');
        try {
            await http.post('/auth/resend-verify', { email });
            setResendMessage('Email xác minh đã được gửi lại.');
        } catch (error) {
            setResendMessage('Gửi lại email thất bại. Vui lòng thử lại.');
        } finally {
            setIsResending(false);
        }
    };

    const handleClose = () => {
        setResendMessage(''); // Đặt lại resendMessage
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel="Email Verification Modal"
            className="fixed inset-0 flex items-center justify-center z-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
        >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-50 relative">
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold mb-4">Vui lòng kiểm tra email của bạn</h2>
                <p className="mb-4">
                    Một email xác minh đã được gửi đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn để xác minh tài khoản.
                </p>
                <div className="flex justify-center text-white mb-4">
                    <Button onClick={handleResend} disabled={isResending}>
                        {isResending ? 'Đang gửi lại...' : 'Gửi lại email xác minh'}
                    </Button>
                </div>
                {resendMessage && (
                    <p className="mt-4 text-center text-sm text-gray-600">{resendMessage}</p>
                )}
            </div>
        </Modal>
    );
};

export default EmailVerificationModal;