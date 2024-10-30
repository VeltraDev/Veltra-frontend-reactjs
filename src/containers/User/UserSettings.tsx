import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import http from '@/utils/http';
import userImage from '../images/user/User-avatar.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AvatarEditor from "react-avatar-editor";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Sidebar from './SideBar';

import { handleCropSave, uploadImage } from '../DashBoardPage/UsersDB/uploadImageUtils'; 

const UserSettings = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [displayStatus, setDisplayStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [slideValue, setSlideValue] = useState(10);

  const cropRef = useRef<AvatarEditor>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accountResponse = await http.get('/auth/account');
        const userId = accountResponse.data.data.user.id;

        if (userId) {
          const userResponse = await http.get(`/users/${userId}`);
          const user = userResponse.data.data || {};
          setAvatar(user.avatar || userImage);
          setFirstName(user.firstName || '');
          setLastName(user.lastName || '');
          setDisplayStatus(user.displayStatus || '');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewAvatar(URL.createObjectURL(file));
      setSelectedFile(file);
      setIsCropperOpen(true);
      if (inputRef.current) inputRef.current.value = ''; 
    }
  };

  const handleSave = async () => {
    try {
      let uploadedAvatarUrl = avatar;

      if (selectedFile) {

        uploadedAvatarUrl = await uploadImage(selectedFile, setAvatar);
      }

      await http.patch('/users/update-profile', {
        avatar: uploadedAvatarUrl,
        firstName,
        lastName,
        displayStatus,
      });

      setAvatar(uploadedAvatarUrl);
      setPreviewAvatar('');
      setSelectedFile(null);

      toast.success("Cập nhật thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error uploading file or updating profile:', error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-r from-[#3a343e] via-[#142f4e] via-30% to-[#145450] to-90% py-10">
       <ToastContainer />
        <Sidebar/>

      {isCropperOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#1c2b33] p-5 rounded-lg shadow-lg max-w-md w-full flex flex-col items-center">
            <AvatarEditor
              ref={cropRef}
              image={previewAvatar}
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
              border={50}
              borderRadius={150}
              color={[0, 0, 0, 0.72]}
              scale={slideValue / 10}
              rotate={0}
            />

            <input
              type="range"
              min="10"
              max="50"
              value={slideValue}
              onChange={(e) => setSlideValue(Number(e.target.value))}
              className="w-4/5 mt-4 accent-indigo-600 h-1"
            />

            <div className="flex justify-between w-full mt-4">
              <button
                className="px-4 py-2 border border-gray-600 text-gray-600 rounded-md hover:bg-gray-100 transition"
                onClick={() => setIsCropperOpen(false)}
              >
                Thoát
              </button>

              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                onClick={() => handleCropSave(cropRef, selectedFile, setAvatar, setSelectedFile, setIsCropperOpen)}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#1c2b33]  p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#cccccc]">
            {loading ? <Skeleton width={200} /> : "Thay đổi thông tin"}
          </h2>
          <div className="flex gap-4">
            <div
              className="flex py-2 px-4 bg-gray-100 rounded-[50px] justify-center items-center gap-2 border border-[#858D9D] focus: cursor-pointer"
              onClick={() => navigate('/nav-home')}
            >
              <div className=''>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <g clip-path="url(#clip0_167_39861)">
                    <path d="M8.94252 7.99962L15.8045 1.13762C15.926 1.01189 15.9932 0.843484 15.9916 0.668686C15.9901 0.493888 15.92 0.32668 15.7964 0.203075C15.6728 0.0794693 15.5056 0.00935665 15.3308 0.0078377C15.156 0.00631876 14.9876 0.073515 14.8619 0.194954L7.99986 7.05695L1.13786 0.194954C1.01212 0.073515 0.843721 0.00631876 0.668923 0.0078377C0.494126 0.00935665 0.326917 0.0794693 0.203312 0.203075C0.0797065 0.32668 0.00959389 0.493888 0.00807494 0.668686C0.00655599 0.843484 0.0737523 1.01189 0.195191 1.13762L7.05719 7.99962L0.195191 14.8616C0.0702103 14.9866 0 15.1562 0 15.333C0 15.5097 0.0702103 15.6793 0.195191 15.8043C0.320209 15.9293 0.489748 15.9995 0.666524 15.9995C0.8433 15.9995 1.01284 15.9293 1.13786 15.8043L7.99986 8.94229L14.8619 15.8043C14.9869 15.9293 15.1564 15.9995 15.3332 15.9995C15.51 15.9995 15.6795 15.9293 15.8045 15.8043C15.9295 15.6793 15.9997 15.5097 15.9997 15.333C15.9997 15.1562 15.9295 14.9866 15.8045 14.8616L8.94252 7.99962Z" fill="#858D9D"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_167_39861">
                      <rect width="16" height="16" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <button className=" text-[#858D9D]">Cancel</button>
            </div>

            <div className="py-2 px-4 flex justify-center items-center bg-[#3858D6] rounded-[50px] gap-2 focus: cursor-pointer"
                onClick={handleSave}            
            >
              <div className=''>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M7.99985 10.6667C8.73624 10.6667 9.3332 10.0697 9.3332 9.33334C9.3332 8.59696 8.73624 8 7.99985 8C7.26346 8 6.6665 8.59696 6.6665 9.33334C6.6665 10.0697 7.26346 10.6667 7.99985 10.6667Z" fill="white"/>
                  <path d="M15.024 2.748L13.252 0.976C13.0747 0.801469 12.8783 0.647406 12.6667 0.516656V2C12.6644 3.84003 11.1733 5.33113 9.33331 5.33334H6.66666C4.82662 5.33113 3.33553 3.84003 3.33334 2V0C1.49331 0.00221875 0.00221875 1.49331 0 3.33334V12.6667C0.00221875 14.5067 1.49331 15.9978 3.33334 16H12.6667C14.5067 15.9978 15.9978 14.5067 16 12.6667V5.10469C16.0025 4.22028 15.651 3.37166 15.024 2.748ZM8 12C6.52725 12 5.33334 10.8061 5.33334 9.33334C5.33334 7.86059 6.52725 6.66669 8 6.66669C9.47275 6.66669 10.6667 7.86059 10.6667 9.33334C10.6667 10.8061 9.47275 12 8 12Z" fill="white"/>
                  <path d="M6.6665 3.99997H9.33315C10.4377 3.99997 11.3332 3.10453 11.3332 1.99997V0.0426562C11.1882 0.0190312 11.0419 0.00478125 10.8952 0H4.6665V2C4.6665 3.10453 5.56194 3.99997 6.6665 3.99997Z" fill="white"/>
                </svg>
              </div>
              <button
               className='text-[#ffffff]'
                disabled={loading}
              >
               Lưu thông tin
              </button>
            </div>  
          </div>
        </div>

        <div className="flex gap-8">
          {/* Avatar section */}
          <div className="flex flex-col items-center gap-4 bg-[#1c2b33] border-gray-600 border p-6 rounded-lg shadow w-64">
            <span className="text-lg text-[#cccccc]  font-semibold">
              {loading ? <Skeleton width={100} /> : "Avatar"}
            </span>
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden shadow-md">
              {loading ? (
                <Skeleton circle={true} height={96} width={96} />
              ) : (
                <img
                  src={avatar || userImage} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {loading ? (
              <Skeleton width={120} height={40} />
            ) : (
              <button
                onClick={() => inputRef.current.click()}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-[50px] hover:bg-indigo-100 font-semibold" 
              >
                Chọn ảnh đại diện 
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <div className="flex-1 bg-[#1c2b33] border border-gray-600 p-6 rounded-lg shadow-md">
            <h3 className="text-lg text-[#cccccc] font-semibold mb-4">
              {loading ? <Skeleton width={150} /> : "Thông tin cá nhân"}
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-1">
                  {loading ? <Skeleton width={100} /> : "Họ"}
                </label>
                {loading ? (
                  <Skeleton height={40} />
                ) : (
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full focus:outline-none px-4 py-2 border bg-[#243949] text-[#cccccc] border-gray-600 rounded-md focus:ring-gray-500 focus:border-gray-500"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-1">
                  {loading ? <Skeleton width={100} /> : "Tên"}
                </label>
                {loading ? (
                  <Skeleton height={40} />
                ) : (
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 focus:outline-none border border-gray-600 bg-[#243949] text-[#cccccc] rounded-md focus:ring-gray-500 focus:border-gray-500"
                  />
                )}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#cccccc] mb-1">
                  {loading ? <Skeleton width={150} /> : "Trạng thái"}
                </label>
                {loading ? (
                  <Skeleton height={40} />
                ) : (
                  <input
                    value={displayStatus}
                    onChange={(e) => setDisplayStatus(e.target.value)}
                    className="w-full focus:outline-none px-4 py-2 bg-[#243949] text-[#cccccc] border border-gray-600 rounded-md focus:ring-gray-500 focus:border-gray-500"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
