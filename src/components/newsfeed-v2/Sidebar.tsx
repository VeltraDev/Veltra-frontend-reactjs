import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  MessageCircle,
  Search,
  PlusSquare,
  Heart,
  Compass,
  LogOut,
  Menu,
  Settings,
  Bookmark,
  Moon,
  Sun,
  AlertTriangle,
  StretchHorizontal,
  Video,
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const { currentTheme, theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const { logout, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  return (
    <div
      className={`w-[245px] h-full p-4 fixed text-white border-r ${currentTheme.border2} flex flex-col justify-between ${currentTheme.bg}`}
    >
      {/* Logo và Navigation */}
      <div>
        <div className={`text-2xl font-bold py-6 px-2 ${currentTheme.text}`}>
          Veltra
        </div>

        <nav className="flex items-start flex-col space-y-4 mt-4 text-white">
          <button
            className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-8`}
          >
            <Home className={`w-6 h-6 ${currentTheme.iconColor}`} />
            <span className={currentTheme.text}>Trang chủ</span>
          </button>

          <button
            className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-10`}
          >
            <Search className={`w-6 h-6 ${currentTheme.iconColor}`} />
            <span className={currentTheme.text}>Tìm kiếm</span>
          </button>

          <button
            className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-8`}
          >
            <Compass className={`w-6 h-6 ${currentTheme.iconColor}`} />
            <span className={currentTheme.text}>Khám phá</span>
          </button>

          <button
            className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-8`}
          >
            <Video className={`w-6 h-6 ${currentTheme.iconColor}`} />
            <span className={currentTheme.text}>Reels</span>
          </button>

          <button
            className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-8`}
          >
            <MessageCircle className={`w-6 h-6 ${currentTheme.iconColor}`} />
            <span className={currentTheme.text}>Tin nhắn</span>
          </button>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-8`}
          >
            <Heart className={`w-6 h-6 ${currentTheme.iconColor}`} />
            <span className={currentTheme.text}>Thông báo</span>
          </button>

          <button
            className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-8`}
          >
            <PlusSquare className={`w-6 h-6 ${currentTheme.iconColor}`} />
            <span className={currentTheme.text}>Tạo</span>
          </button>

          <button
            className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-8`}
          >
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${user?.firstName}`
              }
              alt="Profile"
              className={`w-6 h-6 rounded-full relative ring-2 ring-${currentTheme.text}`}
            />
            <span className={currentTheme.text}>Trang cá nhân</span>
          </button>
        </nav>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-8`}
        >
          <Menu className={`w-6 h-6 ${currentTheme.iconColor}`} />
          <span className={currentTheme.text}>Xem thêm</span>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            className={`absolute right-0 bottom-full mb-2 w-56 ${currentTheme.bg} rounded-xl shadow-lg border py-1 ${currentTheme.border2}`}
          >
            <button
              className={`flex items-center space-x-3 w-full px-4 py-2 ${currentTheme.buttonHover}`}
            >
              <Settings className={`w-4 h-4 ${currentTheme.iconColor}`} />
              <span className={currentTheme.text}>Cài đặt</span>
            </button>

            <button
              className={`flex items-center space-x-3 w-full px-4 py-2 ${currentTheme.buttonHover}`}
            >
              <Bookmark className={`w-4 h-4 ${currentTheme.iconColor}`} />
              <span className={currentTheme.text}>Đã lưu</span>
            </button>

            <button
              className={`flex items-center space-x-3 w-full px-4 py-2 ${currentTheme.buttonHover}`}
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? (
                <Moon className={`w-4 h-4 ${currentTheme.iconColor}`} />
              ) : (
                <Sun className={`w-4 h-4 ${currentTheme.iconColor}`} />
              )}
              <span className={currentTheme.text}>Chuyển chế độ</span>
            </button>

            <button
              className={`flex items-center space-x-3 w-full px-4 py-2 ${currentTheme.buttonHover}`}
            >
              <AlertTriangle className={`w-4 h-4 ${currentTheme.iconColor}`} />
              <span className={currentTheme.text}>Báo cáo sự cố</span>
            </button>

            <hr className={`my-1 ${currentTheme.border}`} />

            <button
              className={`flex items-center space-x-3 w-full px-4 py-2 ${currentTheme.buttonHover}`}
            >
              <StretchHorizontal
                className={`w-4 h-4 ${currentTheme.iconColor}`}
              />
              <span className={currentTheme.text}>Chuyển tài khoản</span>
            </button>

            <button
              onClick={handleLogout}
              className={`flex items-center space-x-3 w-full px-4 py-2 ${currentTheme.buttonHover}`}
            >
              <LogOut className={`w-4 h-4 ${currentTheme.iconColor}`} />
              <span className={currentTheme.text}>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
