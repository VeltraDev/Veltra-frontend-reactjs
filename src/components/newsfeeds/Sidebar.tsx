import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
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
        <div className={`text-2xl font-bold py-6 px-2 cursor-pointer ${currentTheme.text}`}
        onClick={() => navigate("/")}>
          <div className='flex items-center'>
            <svg id="SvgjsSvg1011" width="60%" height="60%" xmlns="http://www.w3.org/2000/svg" version="1.1" xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" preserveAspectRatio="xMidYMid meet" viewBox="-3.613174043542566e-15 -3.613174043542566e-15 300 61.50925827026367" overflow="visible"><defs id="SvgjsDefs1012"></defs><g id="SvgjsG1013" transform="scale(1.017018102922232)" opacity="1"><g id="SvgjsG1014" className="VOW9RncQG" transform="translate(-3.552713678800501e-15, -3.552713678800501e-15) scale(0.6048)" light-content="false" non-strokable="false" fill="#e1c523"><rect width="100" height="100" rx="10"></rect></g><g id="SvgjsG1015" className="Q7k5AmTfPK" transform="translate(11.567257295057434, 11.56288013218941) scale(0.37360911123292384)" light-content="true" non-strokable="false" fill="#ffffff"><path d="M82.859 11.738c-1.25-.488-2.852-1.23-4.262-1.172-1.398 0-2.46.719-2.5 2.54-.05 2 .68 2.71 1.551 3.038.879.328 2.059.352 2.89.719 2.551 1.078 4.762 2.98 6.102 5.379 1.36 2.379 1.922 5.219 1.489 7.941-.692 5.48-5.649 10.13-11.2 10.36-2.761.218-5.53-.65-7.75-2.231-2.23-1.602-3.8-4.012-4.449-6.59-.629-2.59-.3-5.379.871-7.64 1.192-2.27 3.16-4.04 5.399-4.891 1.058-.41 2.3-.649 3.27-1.309.25-.16.48-.36.69-.62.212-.22.411-.5.579-.84.328-.68.578-1.61.559-2.86-.02-1.02-.32-1.75-.872-2.262-.55-.531-1.351-.77-2.25-.82-1.82-.102-3.96.73-5.52 1.578-3.577 1.91-6.53 5.012-8.14 8.75-.09.211-.172.43-.25.64-2.949.122-5.898.462-8.851.462h-9.211c-.27-.7-.57-1.399-.93-2.059-1.98-3.64-5.219-6.55-9.05-8.11-1.25-.488-2.852-1.23-4.262-1.171-1.399 0-2.461.718-2.5 2.539-.051 2 .68 2.71 1.55 3.039.88.328 2.059.351 2.891.719 2.55 1.078 4.762 2.98 6.102 5.379 1.359 2.378 1.922 5.218 1.488 7.94-.488 3.86-3.102 7.302-6.54 9.079-.3.11-.66.27-1.07.48-1.14.45-2.351.739-3.601.79-2.762.218-5.531-.649-7.75-2.231-2.23-1.602-3.8-4.012-4.45-6.59-.628-2.59-.3-5.379.872-7.64 1.191-2.27 3.16-4.04 5.398-4.891 1.059-.41 2.301-.648 3.27-1.309.25-.16.48-.359.691-.62.211-.22.41-.5.578-.84.328-.68.578-1.61.559-2.86-.02-1.02-.32-1.75-.871-2.262-.551-.53-1.352-.77-2.25-.82-1.82-.101-3.961.73-5.52 1.578-3.578 1.91-6.531 5.012-8.14 8.75a18.127 18.127 0 0 0-.93 11.86c.98 3.921 3.371 7.378 6.488 9.82 3.13 2.449 7.09 3.78 11.04 3.828.738 0 1.48-.051 2.218-.141 1.648 2.371 3.5 4.61 5.059 7.031 1.468 2.281 2.93 4.57 4.41 6.852a17.265 17.265 0 0 0-2.379 3.96 18.127 18.127 0 0 0-.93 11.86c.98 3.922 3.371 7.379 6.489 9.82 3.128 2.45 7.09 3.781 11.039 3.828 4.128.031 8.289-1.39 11.488-4.012 3.21-2.609 5.48-6.34 6.3-10.41.801-4.058.18-8.39-1.8-12.039-.41-.761-.891-1.468-1.399-2.16 1.488-2.512 2.77-5.16 4.352-7.61 1.531-2.39 3.07-4.769 4.59-7.16.789.11 1.59.192 2.378.2 4.13.031 8.29-1.39 11.488-4.012 3.211-2.61 5.481-6.34 6.301-10.41.801-4.058.18-8.39-1.8-12.039-1.981-3.64-5.22-6.55-9.051-8.11zM62.211 73.379c-.691 5.48-5.648 10.129-11.199 10.359-2.762.219-5.531-.648-7.75-2.23-2.23-1.602-3.8-4.012-4.45-6.59-.628-2.59-.3-5.38.872-7.64 1.191-2.27 3.16-4.04 5.398-4.892 1.059-.41 2.301-.648 3.27-1.308.25-.16.48-.36.691-.621.211-.219.41-.5.578-.84.328-.68.578-1.61.559-2.86-.02-1.019-.32-1.75-.871-2.261-.551-.531-1.352-.77-2.25-.82-1.82-.102-3.961.73-5.52 1.578-.488.261-.968.55-1.43.859-2.511-3.93-5.3-7.68-7.058-12.09.89-.5 1.738-1.07 2.531-1.719a18.149 18.149 0 0 0 6.301-10.41c.27-1.39.371-2.8.309-4.21 5.21.038 10.41-.352 15.62.69.02 1.45.212 2.891.579 4.29.98 3.922 3.37 7.379 6.488 9.82a17.8 17.8 0 0 0 2.95 1.852c-2.622 4.07-4.97 8.32-8.512 11.8a18.587 18.587 0 0 0-2.38-1.198c-1.25-.489-2.851-1.231-4.261-1.172-1.398 0-2.461.718-2.5 2.539-.05 2 .68 2.71 1.55 3.039.88.328 2.06.351 2.891.719 2.551 1.078 4.762 2.98 6.102 5.378 1.36 2.38 1.922 5.22 1.488 7.942z"></path></g><g id="SvgjsG1016" className="text" transform="translate(186.7100033569336, 51.239999999999995) scale(1)" light-content="false" fill="#f5f5f5"><path d="M-93.21 0L-83.49 0L-62.43 -42L-72.21 -42L-84.09 -18.36C-84.93 -16.72 -85.81 -14.56 -86.73 -11.88C-86.73 -13.96 -86.91 -16.22 -87.27 -18.66L-90.75 -42L-100.23 -42Z M-66.63 0L-36.81 0L-35.25 -8.7L-55.89 -8.7L-54.39 -17.34L-43.53 -17.34L-42.03 -25.98L-52.83 -25.98L-51.51 -33.36L-32.13 -33.36L-30.63 -42L-59.25 -42Z M-31.59 0L-3.39 0L-1.83 -8.64L-20.91 -8.64L-15.03 -42L-24.21 -42Z M21.21 -33.24L32.67 -33.24L34.17 -42L2.19 -42L0.69 -33.24L12.09 -33.24L6.21 0L15.33 0Z M71.07 -29.04C71.07 -32.68 70.09 -35.75 68.13 -38.25C66.17 -40.75 63.11 -42 58.95 -42L39.15 -42L31.77 0L40.95 0L43.59 -14.88L51.63 -14.88L54.93 0L64.89 0L61.29 -15.48C64.85 -16.52 67.37 -18.34 68.85 -20.94C70.33 -23.54 71.07 -26.24 71.07 -29.04ZM56.01 -23.52L45.09 -23.52L46.77 -33.36L57.63 -33.36C58.95 -33.36 59.95 -32.94 60.63 -32.1C61.31 -31.26 61.65 -30.12 61.65 -28.68C61.65 -27.32 61.25 -26.12 60.45 -25.08C59.65 -24.04 58.17 -23.52 56.01 -23.52Z M67.65 0L77.43 0L81.87 -8.16L97.35 -8.16L98.91 0L108.27 0L99.93 -42L90.81 -42ZM86.13 -16.5L91.89 -27.06C92.41 -27.86 92.93 -28.9 93.45 -30.18C93.45 -30.1 93.63 -29 93.99 -26.88L95.91 -16.5Z"></path></g></g></svg>
          </div>
        </div>

        <nav className="flex items-start flex-col space-y-4 mt-4 text-white">
          <button
            className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-8`}
            onClick={() => navigate("/")}
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

          <Link to="/chat"
            className={`flex items-center space-x-3 p-2 rounded-xl outline-none transition-all duration-300 hover:w-full ${currentTheme.buttonHover} hover:bg-opacity-80 hover:pr-8`}
          >
            <MessageCircle className={`w-[25px] h-[25px] hover:scale-110 duration-300 ${currentTheme.iconColorSideBar}`} />
            <span className={`${currentTheme.textNewsFeeds} text-[15px] `}>Messages</span>
          </Link>

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
