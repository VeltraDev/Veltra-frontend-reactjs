import { Link } from 'react-router-dom';
import { HomeIcon, SearchIcon, CompassIcon, MailIcon, HeartIcon, UserCircleIcon, AlignJustify } from 'lucide-react';
import AppLogo from '../../components/common/AppLogo';

const SidebarLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
    <Link to={to} className="flex items-center p-2 hover:bg-gray-700 rounded">
        {icon}
        <span className="ml-3">{label}</span>
    </Link>
);

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-black text-white flex flex-col border-r border-gray-700">
            <Link to="/" className="flex items-center justify-center h-16 bg-black">
                <AppLogo />
            </Link>
            <nav className="flex-1 p-4 space-y-4">
                <SidebarLink to="/" icon={<HomeIcon />} label="Trang chủ" />
                <SidebarLink to="/search" icon={<SearchIcon />} label="Tìm kiếm" />
                <SidebarLink to="/explore" icon={<CompassIcon />} label="Khám phá" />
                <SidebarLink to="/chat" icon={<MailIcon />} label="Tin nhắn" />
                <SidebarLink to="/notifications" icon={<HeartIcon />} label="Thông báo" />
                <SidebarLink to="/profile" icon={<UserCircleIcon />} label="Trang cá nhân" />
                <SidebarLink to="/more" icon={<AlignJustify />} label="Xem thêm" />
            </nav>
        </aside>
    );
};

export default Sidebar;