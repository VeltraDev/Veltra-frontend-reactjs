import { useNavigate } from 'react-router-dom';
import { LuPencil } from "react-icons/lu";
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
        <div className="text-orange-600 hover:text-orange-900 p-2 rounded-lg bg-orange-200 inline-block cursor-pointer mx-1" onClick={handleEdit}>
            <LuPencil className="h-5 w-5" />
        </div>
    );
};

export default UpdateUser;
