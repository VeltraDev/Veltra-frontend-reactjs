import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { http } from '@/api/http';

export default function VerifyEmailPage() {
    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'alreadyVerified'>('loading');
    const [token, setToken] = useState<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        setToken(token);

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

                if (response.code === 1000) {
                    setVerificationStatus('success');
                } else if (response.code === 2002 || response.message === "Tài khoản của bạn đã được xác thực trước đó") {
                    setVerificationStatus('alreadyVerified');
                } else {
                    setVerificationStatus('error');
                }
            } catch (error: any) {
                console.error('Xác nhận email thất bại:', error);
                if (error.code === 2002 && error.message === "Tài khoản của bạn đã được xác thực trước đó") {
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
                        {token && (
                            <Button onClick={() => navigate(`/reset-password?token=${token}`)} className="mt-4 mx-8 text-white">
                                Đặt lại mật khẩu
                            </Button>
                        )}
                    </>
                );
            case 'alreadyVerified':
                return (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-white">Email Đã Được Xác Nhận</h2>
                        <p className="mb-4 text-white">Email của bạn đã được xác nhận trước đó. Bạn có thể đăng nhập vào tài khoản của mình.</p>
                        <Button onClick={() => navigate('/auth?tab=signin')}>Đăng nhập</Button>
                        {token && (
                            <Button onClick={() => navigate(`/reset-password?token=${token}`)} className="mt-4 mx-8 text-white">
                                Đặt lại mật khẩu
                            </Button>
                        )}
                    </>
                );
            case 'error':
                return (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-white">Xác Nhận Email Thất Bại</h2>
                        <p className="mb-4 text-white">Chúng tôi không thể xác nhận địa chỉ email của bạn. Có thể liên kết xác nhận đã hết hạn hoặc không hợp lệ.</p>
                        <Button onClick={() => navigate('/auth?tab=signup')}>Quay lại Đăng ký</Button>
                        {token && (
                            <Button onClick={() => navigate(`/reset-password?token=${token}`)} className="mt-4 mx-8 text-white">
                                Đặt lại mật khẩu
                            </Button>
                        )}
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