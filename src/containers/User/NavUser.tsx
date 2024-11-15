import React, { useState, useRef, useEffect } from 'react';
import { createPopper } from '@popperjs/core';
import { http } from '@/api/http';
import userImage from '../images/user/User-avatar.svg';
import { useNavigate } from 'react-router-dom';

const DropdownNavbarComponent: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownToggleRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        dropdownToggleRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !dropdownToggleRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (dropdownToggleRef.current && dropdownRef.current) {
      createPopper(dropdownToggleRef.current, dropdownRef.current, {
        placement: 'bottom-start',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 10],
            },
          },
        ],
      });
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accountResponse = await http.get('/auth/account');
        const userId = accountResponse.data.data.user.id;

        if (userId) {
          const userResponse = await http.get(`/users/${userId}`);
          const user = userResponse.data.data || {};
          setAvatar(user.avatar || null);
          console.log(user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="px-10 py-2 mx-auto bg-[#242526] border-b border-[#ccc]">
      <nav className="border-gray-200">
        <div className="container mx-auto flex items-center justify-between">
          <a href="#" className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 64 64">
              <linearGradient linearGradient id="XsTRcLoXx-vG_AiVGAoRha_EoRYuY9CMBZV_gr1" x1="32" x2="32" y1="10.06" y2="39.393" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#e6abff"></stop><stop offset="1" stop-color="#6dc7ff"></stop></linearGradient><polygon fill="url(#XsTRcLoXx-vG_AiVGAoRha_EoRYuY9CMBZV_gr1)" points="39.004,10.06 32,22.06 24.996,10.06 14.879,10.06 32,39.393 49.121,10.06"></polygon><linearGradient id="XsTRcLoXx-vG_AiVGAoRhb_EoRYuY9CMBZV_gr2" x1="32" x2="32" y1="59.06" y2="9.06" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1a6dff"></stop><stop offset="1" stop-color="#c822ff"></stop></linearGradient><path fill="url(#XsTRcLoXx-vG_AiVGAoRhb_EoRYuY9CMBZV_gr2)" d="M32,59.06c-0.355,0-0.685-0.188-0.863-0.496l-28.018-48c-0.181-0.31-0.183-0.691-0.004-1.002	S3.624,9.06,3.982,9.06h21.014c0.355,0,0.685,0.188,0.863,0.496L32,20.076l6.141-10.521c0.179-0.308,0.508-0.496,0.863-0.496h21.014	c0.358,0,0.688,0.191,0.867,0.502s0.177,0.692-0.004,1.002l-28.018,48C32.685,58.871,32.355,59.06,32,59.06z M5.724,11.06L32,56.076	L58.276,11.06H39.578l-6.715,11.504c-0.357,0.615-1.369,0.615-1.727,0L24.422,11.06H5.724z"></path>
            </svg>
            <span className="self-center text-lg font-semibold whitespace-nowrap text-[#ffffff]">VELTRA</span>
          </a>
          <button
            ref={dropdownToggleRef}
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-full md:w-auto focus:outline-none"
          >
            <img
              src={avatar || userImage}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
          </button>
          <div
            ref={dropdownRef}
            className={`${isDropdownOpen ? 'block' : 'hidden'} bg-white text-base z-10 list-none divide-y divide-gray-100 rounded shadow my-4 w-44`}
          >
            <ul className="py-1" onClick={() => navigate('/settings')}>
              <li>
                <a href="/settings" className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2">Cài đặt</a>
              </li>
            </ul>
            <div className="py-1" onClick={() => navigate('/')}>
              <div className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2">
                Đăng xuất
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default DropdownNavbarComponent;
