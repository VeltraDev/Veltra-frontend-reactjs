import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import http from '@/utils/http';

export default function VerifyEmailPage() {
    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'alreadyVerified'>('loading');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        const verifyEmail = async () => {
            if (!token) {
                setVerificationStatus('error');
                return;
            }

            try {
                const response = await http.post(
                    `auth/verify-email`,
                    { token: token },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.data.code === 1000) {
                    setVerificationStatus('success');
                } else if (response.data.code === 1001 || response.data.message === "Tài khoản của bạn đã được xác thực trước đó") {
                    setVerificationStatus('alreadyVerified');
                } else {
                    setVerificationStatus('error');
                }
            } catch (error: any) {
                if (error.response && error.response.data.message === "Tài khoản của bạn đã được xác thực trước đó") {
                    setVerificationStatus('alreadyVerified');
                } else {
                    setVerificationStatus('error');
                }
            }
        };

        verifyEmail();
    }, [location.search]);

    const renderContent = () => {
        switch (verificationStatus) {
            case 'loading':
                return <p className="text-white">Đang xác nhận địa chỉ email của bạn...</p>;
            case 'success':
                return (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-white">Xác Nhận Email Thành Công!</h2>
                        <p className="mb-4 text-white">Email của bạn đã được xác nhận. Bạn có thể đăng nhập vào tài khoản của mình ngay bây giờ.</p>
                        <Button onClick={() => navigate('/sign-in')}>Đăng nhập</Button>
                    </>
                );
            case 'alreadyVerified':
                return (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-white">Email Đã Được Xác Nhận</h2>
                        <p className="mb-4 text-white">Email của bạn đã được xác nhận trước đó. Bạn có thể đăng nhập vào tài khoản của mình.</p>
                        <Button onClick={() => navigate('/sign-in')}>Đăng nhập</Button>
                    </>
                );
            case 'error':
                return (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-white">Xác Nhận Email Thất Bại</h2>
                        <p className="mb-4 text-white">Chúng tôi không thể xác nhận địa chỉ email của bạn. Có thể liên kết xác nhận đã hết hạn hoặc không hợp lệ.</p>
                        <Button onClick={() => navigate('/sign-up')}>Quay lại Đăng ký</Button>
                    </>
                );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black">
            <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
                {renderContent()}
            </div>
        </div>
    );
}
