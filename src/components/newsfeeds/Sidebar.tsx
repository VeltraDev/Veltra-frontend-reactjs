import React, { useState, useEffect } from 'react';
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
  LayoutDashboard,
} from 'lucide-react';
import { http } from '@/api/http';
import defaultAvatar from '@/images/user/defaultAvatar.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const { currentTheme, theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const { logout, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [role, setRole] = useState(null); // Thêm state để lưu role người dùng

  useEffect(() => {
    const fetchUser = async () => {
      console.log('Fetching user data...');
      try {
        const accountResponse = await http.get('/auth/account');
        console.log('Account response:', accountResponse);
        const userId = accountResponse.data.user.id;
        setRole(accountResponse.data.user.role?.name); // Lấy role từ API

        if (userId) {
          const userResponse = await http.get(`/users/${userId}`);
          const userData = userResponse.data.avatar;
          setAvatar(userData || defaultAvatar);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div
      className={`w-[245px] h-full p-4 fixed text-white border-r ${currentTheme.border2} flex flex-col justify-between ${currentTheme.bg}`}
    >
      <div>
        <div className={`text-2xl font-bold py-6 px-2 cursor-pointer ${currentTheme.text}`}>
          Veltra
        </div>

        <nav className="flex items-start flex-col space-y-4 mt-4 text-white">
          <button
            className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-8`}
          >
            <Home
              className={`w-[25px] h-[25px] hover:scale-110 duration-300 ${currentTheme.iconColorSideBar}`}
            />
            <span className={`${currentTheme.textNewsFeeds} text-[15px] `}>Home</span>
          </button>

          <button
            className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-10`}
          >
            <Search className={`w-[25px] h-[25px] hover:scale-110 duration-300 ${currentTheme.iconColorSideBar}`} />
            <span className={`${currentTheme.textNewsFeeds} text-[15px] `}>Search</span>
          </button>

          <button
            className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-8`}
          >
            <Compass className={`w-[25px] h-[25px] hover:scale-110 duration-300 ${currentTheme.iconColorSideBar}`} />
            <span className={`${currentTheme.textNewsFeeds} text-[15px] `}>Explore</span>
          </button>

          <button
            className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-8`}
          >
            <Video className={`w-[25px] h-[25px] hover:scale-110 duration-300 ${currentTheme.iconColorSideBar}`} />
            <span className={`${currentTheme.textNewsFeeds} text-[15px] `}>Reels</span>
          </button>

          <button
            className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-8`}
          >
            <MessageCircle className={`w-[25px] h-[25px] hover:scale-110 duration-300 ${currentTheme.iconColorSideBar}`} />
            <span className={`${currentTheme.textNewsFeeds} text-[15px] `}>Messages</span>
          </button>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-8`}
          >
            <Heart className={`w-[25px] h-[25px] hover:scale-110 duration-300 ${currentTheme.iconColorSideBar}`} />
            <span className={`${currentTheme.textNewsFeeds} text-[15px] `}>Notifications</span>
          </button>

          <button
            className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-8`}
          >
            <PlusSquare className={`w-[25px] h-[25px] hover:scale-110 duration-300 ${currentTheme.iconColorSideBar}`} />
            <span className={`${currentTheme.textNewsFeeds} text-[15px] `}>Create</span>
          </button>

          <button
            className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-8`}
            onClick={() => navigate("/settings")}
          >
            <img
              src={avatar || defaultAvatar}
              alt="Profile"
              className={`w-[25px] h-[25px] hover:scale-110 duration-300 rounded-full relative `}
            />
            <span className={currentTheme.textNewsFeeds}>Profile</span>
          </button>
        </nav>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-8`}
        >
          <Menu className={`w-6 h-6 hover:scale-110 duration-300 ${currentTheme.iconColorSideBar}`} />
          <span className={currentTheme.textNewsFeeds}>More</span>
        </button>

        {isDropdownOpen && (
          <div
            className={`absolute right-0 bottom-full mb-2 w-56 ${currentTheme.bg} rounded-xl shadow-lg border py-1 ${currentTheme.border2}`}
          >
            <button
              className={`flex items-center space-x-3 w-full px-4 py-2 ${currentTheme.buttonHover}`}
            >
              <Settings className={`w-4 h-4 ${currentTheme.iconColorSideBar}`} />
              <span className={currentTheme.text}>Settings</span>
            </button>

            {role === 'ADMIN' && ( 
              <button
                className={`flex items-center space-x-3 w-full px-4 py-2 ${currentTheme.buttonHover}`}
                onClick={() => navigate('/dashboard')}
              >
                <LayoutDashboard className={`w-4 h-4 ${currentTheme.iconColorSideBar}`} />
                <span className={currentTheme.text}>Dashboard</span>
              </button>
            )}

            <button
              className={`flex items-center space-x-3 w-full px-4 py-2 ${currentTheme.buttonHover}`}
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? (
                <Moon className={`w-4 h-4 ${currentTheme.iconColorSideBar}`} />
              ) : (
                <Sun className={`w-4 h-4 ${currentTheme.iconColorSideBar}`} />
              )}
              <span className={currentTheme.text}>Switch appearance</span>
            </button>

            <button
              className={`flex items-center space-x-3 w-full px-4 py-2 ${currentTheme.buttonHover}`}
            >
              <AlertTriangle className={`w-4 h-4 ${currentTheme.iconColorSideBar}`} />
              <span className={currentTheme.text}>Report</span>
            </button>

            <hr className={`my-1 ${currentTheme.border}`} />

            <button
              className={`flex items-center space-x-3 w-full px-4 py-2 ${currentTheme.buttonHover}`}
            >
              <StretchHorizontal
                className={`w-4 h-4 ${currentTheme.iconColorSideBar}`}
              />
              <span className={currentTheme.text}>Switch account</span>
            </button>

            <button
              onClick={handleLogout}
              className={`flex items-center space-x-3 w-full px-4 py-2 ${currentTheme.buttonHover}`}
            >
              <LogOut className={`w-4 h-4 ${currentTheme.iconColorSideBar}`} />
              <span className={currentTheme.text}>Log out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
