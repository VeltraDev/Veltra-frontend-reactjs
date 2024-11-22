import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme, ThemeType, themes } from '@/contexts/ThemeContext';
import { Home, MessageCircle, Users, Search, Settings, LogOut, Palette, Plus } from 'lucide-react';
import CreateGroupDialog from '@/components/chat/CreateGroupDialog';

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showThemes, setShowThemes] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const currentTheme = themes[theme];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const themeOptions = Object.entries(themes).map(([key, value]) => ({
    name: value.name,
    value: key as ThemeType,
    icon: value.icon,
  }));
console.log(user)
  return (
    <>
      <div className={`w-20 h-screen ${currentTheme.bg} flex flex-col items-center py-8 relative z-30`}>
        <div className="mb-8">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${currentTheme.primary} rounded-full animate-pulse`} style={{ filter: 'blur(8px)' }} />
            <img
              src={user?.user.picture || `https://ui-avatars.com/api/?name=${user?.firstName}`}
              alt="Profile"
              className={`w-12 h-12 rounded-full relative z-10 ring-2 ring-${currentTheme.text}`}
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center space-y-4">
          <button className={`p-3 rounded-xl hover:bg-gradient-to-r ${currentTheme.hover} transition-all group relative`}>
            <Home className={`w-6 h-6 ${currentTheme.text}`} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Home
            </span>
          </button>
          <button className={`p-3 rounded-xl bg-gradient-to-r ${currentTheme.primary}`}>
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => setShowCreateGroup(true)}
            className={`p-3 rounded-xl hover:bg-gradient-to-r ${currentTheme.hover} transition-all group relative`}
          >
            <Plus className={`w-6 h-6 ${currentTheme.text}`} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Create Group
            </span>
          </button>
          <button className={`p-3 rounded-xl hover:bg-gradient-to-r ${currentTheme.hover} transition-all group relative`}>
            <Users className={`w-6 h-6 ${currentTheme.text}`} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Friends
            </span>
          </button>
          <button className={`p-3 rounded-xl hover:bg-gradient-to-r ${currentTheme.hover} transition-all group relative`}>
            <Search className={`w-6 h-6 ${currentTheme.text}`} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Search
            </span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <button
              onClick={() => setShowThemes(!showThemes)}
              className={`p-3 rounded-xl hover:bg-gradient-to-r ${currentTheme.hover} transition-all group relative`}
            >
              <Palette className={`w-6 h-6 ${currentTheme.text}`} />
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Themes
              </span>
            </button>

            {showThemes && (
              <>
                <div
                  className="fixed inset-0 z-40 "
                  onClick={() => setShowThemes(false)}
                />
                <div className={`absolute bottom-full grid grid-cols-5 w-[500px]  left-full mb-2 ml-2 ${currentTheme.bg} border ${currentTheme.border} rounded-lg p-2 w-72 z-50 shadow-xl`}>
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setTheme(option.value);
                        setShowThemes(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-gradient-to-r ${currentTheme.hover} transition-all ${theme === option.value ? `bg-gradient-to-r ${themes[option.value].primary} text-white` : currentTheme.text
                        }`}
                    >
                      <span>{option.icon}</span>
                      <span>{option.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button className={`p-3 rounded-xl hover:bg-gradient-to-r ${currentTheme.hover} transition-all group relative`}>
            <Settings className={`w-6 h-6 ${currentTheme.text}`} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Settings
            </span>
          </button>
          <button
            onClick={handleLogout}
            className={`p-3 rounded-xl hover:bg-gradient-to-r ${currentTheme.hover} transition-all group relative`}
          >
            <LogOut className={`w-6 h-6 ${currentTheme.text}`} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Logout
            </span>
          </button>
        </div>
      </div>

      <CreateGroupDialog
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
      />
    </>
  );
}