import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="w-1/5 p-4">
            <nav className="flex flex-col space-y-4">
                <Link
                    to="/settings"
                    className={`text-lg py-3 rounded-xl flex gap-3 text-center justify-start ${
                        location.pathname === '/settings' 
                            ? 'text-[#1c2b33] bg-[#dee3e9]'
                            : 'text-[#dee3e9] hover:bg-gray-700'
                    }`}
                >
                    <div className='ml-3 mt-[1px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 23 22" fill="none">
                            <path d="M19.7778 20.9997V18.7775C19.7778 17.5987 19.3095 16.4683 18.476 15.6348C17.6425 14.8013 16.5121 14.333 15.3333 14.333H6.44444C5.2657 14.333 4.13524 14.8013 3.30175 15.6348C2.46825 16.4683 2 17.5987 2 18.7775V20.9997" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10.889 9.88889C13.3436 9.88889 15.3335 7.89904 15.3335 5.44444C15.3335 2.98985 13.3436 1 10.889 1C8.43443 1 6.44458 2.98985 6.44458 5.44444C6.44458 7.89904 8.43443 9.88889 10.889 9.88889Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className=' font-semibold'>Thông tin cá nhân</div>
                </Link>

                <Link
                    to="/settings/change-password"
                    className={`text-lg py-3 rounded-xl flex gap-3 text-center justify-start ${
                        location.pathname === '/settings/change-password'
                            ? 'text-[#1c2b33] bg-[#dee3e9]'
                            : 'text-[#dee3e9] hover:bg-gray-700'
                    }`}
                >
                    <div className='ml-3 text-center mt-[2px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M17.2273 9.36H15.5852V4.04C15.5852 2.36088 14.2016 1 12.4943 1H6.50568C4.79844 1 3.41477 2.36088 3.41477 4.04V9.36H1.77273C1.34531 9.36 1 9.69963 1 10.12V19.24C1 19.6604 1.34531 20 1.77273 20H17.2273C17.6547 20 18 19.6604 18 19.24V10.12C18 9.69963 17.6547 9.36 17.2273 9.36ZM5.15341 4.04C5.15341 3.30612 5.75952 2.71 6.50568 2.71H12.4943C13.2405 2.71 13.8466 3.30612 13.8466 4.04V9.36H5.15341V4.04ZM16.2614 18.29H2.73864V11.07H16.2614V18.29ZM8.82386 14.9887V16.2475C8.82386 16.352 8.9108 16.4375 9.01705 16.4375H9.98295C10.0892 16.4375 10.1761 16.352 10.1761 16.2475V14.9887C10.3755 14.848 10.5243 14.6487 10.6011 14.4194C10.6779 14.1902 10.6788 13.943 10.6036 13.7132C10.5284 13.4835 10.3811 13.2831 10.1828 13.141C9.98444 12.9989 9.74539 12.9223 9.5 12.9223C9.25461 12.9223 9.01556 12.9989 8.81724 13.141C8.61892 13.2831 8.47157 13.4835 8.3964 13.7132C8.32123 13.943 8.32212 14.1902 8.39893 14.4194C8.47575 14.6487 8.62453 14.848 8.82386 14.9887Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <div className=' font-semibold'>Thay đổi mật khẩu</div>
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;
