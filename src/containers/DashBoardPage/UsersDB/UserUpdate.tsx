import { useNavigate } from 'react-router-dom';

interface UpdateUserProps {
    userId: string;
    onUpdateSuccess: () => void;
}

const UpdateUser: React.FC<UpdateUserProps> = ({ userId }) => {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/dashboard/users/${userId}`);
    };

    return (
        <div className="py-[8px] px-[8px] rounded-[8px] bg-[#FFE4B5] cursor-pointer" onClick={handleEdit}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <g clipPath="url(#clip0_163_40127)">
                    <path d="M0.781333 12.7459C0.281202 13.2459 0.000151033 13.9241 0 14.6312L0 15.9999H1.36867C2.07585 15.9997 2.75402 15.7187 3.254 15.2186L12.1493 6.32333L9.67667 3.85066L0.781333 12.7459Z" fill="#FFA500" />
                    <path d="M15.0297 2.34334L13.6567 0.970667C13.0231 0.337086 11.9769 0.337086 11.3433 0.970667L10.0707 2.24334L12.5433 4.716L13.8159 3.44334C14.1284 3.13062 14.3047 2.69488 14.3047 2.24334C14.3047 1.79179 14.1284 1.35605 13.8159 1.04334L15.0297 2.34334Z" fill="#FFA500" />
                </g>
                <defs>
                    <clipPath id="clip0_163_40127">
                        <rect width="16" height="16" fill="white"></rect>
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
};

export default UpdateUser;
