import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import CreatePostModal from './CreatePostModal';
import { http } from '@/api/http'; 
import defaultAvatar from '@/images/user/defaultAvatar.png';
import {
  Image,
  AlignLeft,
  Smile,
  Calendar,
  Camera,
  MapPin,
} from 'lucide-react';

const PostForm = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAvatar = async () => {
      console.log('Fetching user avatar...');
      try {
        const accountResponse = await http.get('/auth/account');
        console.log('Account response:', accountResponse);
        const userId = accountResponse.data.user.id;

        if (userId) {
          const userResponse = await http.get(`/users/${userId}`);
          const userData = userResponse.data.avatar;
          setAvatar(userData);
        }
      } catch (error) {
        console.error('Error fetching user avatar:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserAvatar();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <>
      <div
        className={`${currentTheme.bg} border ${currentTheme.border2} rounded-xl p-4 mb-6 relative`}
      >
        {loading ? (
          <div className="animate-pulse flex mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
            <div className="flex-grow">
              <div className="w-full h-4 bg-gray-300 rounded mb-4"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-2"></div>
              <div className="flex space-x-3 mt-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        ) : (
          // Actual Post Form Content
          <div className="flex mb-4">
            <div className="mr-3">
              <img
                src={avatar || defaultAvatar}
                alt="Profile"
                className={`w-8 h-8 rounded-full relative`}
              />
            </div>
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Bạn đang nghĩ gì thế?"
                className={`w-full text-sm ${currentTheme.text} bg-transparent border-none focus:outline-none cursor-pointer`}
                onFocus={() => setIsModalOpen(true)}
                readOnly
              />
              <div className={`border ${currentTheme.border2} mt-4 mb-2`}></div>
              <div className="flex justify-between">
                <div className="flex justify-between items-center mt-3 text-sm space-x-3">
                  <button
                    className={`flex items-center text-${currentTheme.text} hover:text-opacity-80`}
                  >
                    <Image 
                      onClick={() => setIsModalOpen(true)} 
                      className="w-5 h-5 text-cyan-600" />
                  </button>
                  <button
                    className={`flex items-center text-${currentTheme.text} hover:text-opacity-80`}
                  >
                    <AlignLeft className="w-5 h-5 text-cyan-600" />
                  </button>
                  <button
                    className={`flex items-center text-${currentTheme.text} hover:text-opacity-80`}
                  >
                    <Smile className="w-5 h-5 text-cyan-600" />
                  </button>
                  <button
                    className={`flex items-center text-${currentTheme.text} hover:text-opacity-80`}
                  >
                    <Camera className="w-5 h-5 text-cyan-600" />
                  </button>
                  <button
                    className={`flex items-center text-${currentTheme.text} hover:text-opacity-80`}
                  >
                    <Calendar className="w-5 h-5 text-cyan-600" />
                  </button>
                  <button
                    className={`flex items-center text-${currentTheme.text} hover:text-opacity-80`}
                  >
                    <MapPin className="w-5 h-5 text-cyan-600" />
                  </button>
                </div>

                <button
                  className="px-4 py-2 rounded-full text-white font-semibold bg-blue-400"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default PostForm;
