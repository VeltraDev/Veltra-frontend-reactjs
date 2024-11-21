import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { http } from '@/api/http';
import AvatarEditor from 'react-avatar-editor';
//import { ToastContainer, toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';
import { handleCropSave, uploadImage } from './uploadImageUtils';
import userImage from '../../images/user/User-avatar.svg';
import Toast from '../Permissions/Toast';
import { Link } from 'react-router-dom';
import { IoArrowBackOutline } from "react-icons/io5";
const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [userDisplayStatus, setUserDisplayStatus] = useState('');
  const [userIsVerified, setUserIsVerified] = useState(false);
  const [userRoleId, setUserRoleId] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [slideValue, setSlideValue] = useState(10);
  const cropRef = useRef<AvatarEditor>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await http.get(`/users/${userId}`);
        const user = response.data || {};

        setUserFirstName(user.firstName || '');
        setUserLastName(user.lastName || '');
        setUserAvatar(user.avatar || '');
        setUserDisplayStatus(user.displayStatus || '');
        setUserIsVerified(user.isVerified || false);
        setUserRoleId(user.role.id || '');

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
        toast.error('Có lỗi xảy ra khi tải thông tin người dùng!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    return () => {
      if (previewAvatar) {
        URL.revokeObjectURL(previewAvatar);
      }
    };
  }, [previewAvatar]);

  useEffect(() => {
    return () => {
      if (userAvatar && userAvatar.startsWith('blob:')) {
        URL.revokeObjectURL(userAvatar);
      }
    };
  }, [userAvatar]);
  const handleCloseToast = () => {
    setMessage('');
    setStatus('');
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewAvatar(URL.createObjectURL(file));
      setSelectedFile(file);
      setIsCropperOpen(true);
      e.target.value = '';
    }
  };

  const handleCropCancel = () => {
    setPreviewAvatar('');
    setSelectedFile(null);
    setIsCropperOpen(false);
  };

  const handleSave = async () => {
    try {
      let uploadedAvatarUrl = userAvatar;

      if (selectedFile) {
        uploadedAvatarUrl = await uploadImage(selectedFile, setUserAvatar);
      }

      await http.patch(`/users/${userId}`, {
        avatar: uploadedAvatarUrl,
        firstName: userFirstName,
        lastName: userLastName,
        displayStatus: userDisplayStatus,
        isVerified: userIsVerified,
        roleId: userRoleId,
      });

      setPreviewAvatar('');
      setSelectedFile(null);

      toast.success('Cập nhật thành công!', {
        position: 'top-right',
        autoClose: 1500,
        onClose: () => {
          navigate('/dashboard/users');
        },
      });


    } catch (error) {
      console.error('Error uploading file or updating profile:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <Link className="mb-8 bg-[#f5f5f5] shadow hover:bg-slate-600 rounded-lg w-12 h-12 flex" to="/dashboard/users">
        <IoArrowBackOutline className="h-12 w-12" />
      </Link>
      {/* Cropper Modal */}
      {isCropperOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-xs w-full flex flex-col items-center">
            <AvatarEditor
              ref={cropRef}
              image={previewAvatar}
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              border={50}
              borderRadius={150}
              color={[0, 0, 0, 0.72]}
              scale={slideValue / 10}
              rotate={0}
            />
            <div className="w-full flex justify-center items-center mt-4">
              <input
                type="range"
                min="10"
                max="50"
                value={slideValue}
                onChange={(e) => setSlideValue(Number(e.target.value))}
                className="w-4/5 mt-4"
              />
            </div>
            <div className="flex justify-between w-full mt-4">
              <button
                className="px-4 py-2 border border-gray-600 text-gray-600 rounded-md hover:bg-gray-100 transition"
                onClick={handleCropCancel}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                onClick={() => handleCropSave(cropRef, selectedFile, setUserAvatar, setSelectedFile, setIsCropperOpen)}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <Toast handleCloseToast={handleCloseToast} message={message} status={status} />
      

      {/* Main Content */}
      <div className="max-w-[1165px]">
        {loading ? (
          <div className="animate-pulse">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 bg-gray-300 rounded w-48"></div>
              <div className="h-10 bg-gray-300 rounded w-32"></div>
            </div>
            <div className="flex justify-between h-[300px]">
              <div className="p-6 w-[264px] shadow-lg bg-gray-200 rounded-[12px] flex flex-col gap-5 animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-24 mb-4"></div>
                <div className="w-[100px] h-[100px] rounded-full bg-gray-300 mb-4"></div>
                <div className="h-10 bg-gray-300 rounded w-32"></div>
              </div>
              <div className="w-[860px]">
                <div className="bg-gray-200 p-6 shadow-lg rounded-[12px]">
                  <div className="h-6 bg-gray-300 rounded w-36 mb-6"></div>
                  <div className="h-10 bg-gray-300 rounded w-full mb-6"></div>
                  <div className="h-10 bg-gray-300 rounded w-full mb-6"></div>
                  <div className="h-10 bg-gray-300 rounded w-full mb-6"></div>
                  <div className="h-10 bg-gray-300 rounded w-full mb-6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Chỉnh sửa thông tin</h2>
              <div className="flex gap-4">
                <div
                  className="flex py-2 px-4 bg-gray-100 rounded-[8px] justify-center items-center gap-2 border border-[#858D9D]"
                  onClick={() => navigate('/dashboard/users')}
                >
                  <div className="focus: cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <g clipPath="url(#clip0_167_39861)">
                        <path d="M8.94252 7.99962L15.8045 1.13762C15.926 1.01189 15.9932 0.843484 15.9916 0.668686C15.9901 0.493888 15.92 0.32668 15.7964 0.203075C15.6728 0.0794693 15.5056 0.00935665 15.3308 0.0078377C15.156 0.00631876 14.9876 0.073515 14.8619 0.194954L7.99986 7.05695L1.13786 0.194954C1.01212 0.073515 0.843721 0.00631876 0.668923 0.0078377C0.494126 0.00935665 0.326917 0.0794693 0.203312 0.203075C0.0797065 0.32668 0.00959389 0.493888 0.00807494 0.668686C0.00655599 0.843484 0.0737523 1.01189 0.195191 1.13762L7.05719 7.99962L0.195191 14.8616C0.0702103 14.9866 0 15.1562 0 15.333C0 15.5097 0.0702103 15.6793 0.195191 15.8043C0.320209 15.9293 0.489748 15.9995 0.666524 15.9995C0.8433 15.9995 1.01284 15.9293 1.13786 15.8043L7.99986 8.94229L14.8619 15.8043C14.9869 15.9293 15.1564 15.9995 15.3332 15.9995C15.51 15.9995 15.6795 15.9293 15.8045 15.8043C15.9295 15.6793 15.9997 15.5097 15.9997 15.333C15.9997 15.1562 15.9295 14.9866 15.8045 14.8616L8.94252 7.99962Z" fill="#858D9D" />
                      </g>
                      <defs>
                        <clipPath id="clip0_167_39861">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <button className=" text-[#858D9D]">Hủy</button>
                </div>
                <div
                  className="py-2 px-4 flex justify-center items-center bg-[#3858D6] rounded-[8px] gap-2"
                  onClick={handleSave}
                >
                  <div className="focus: cursor-pointer">
                  </div>
                  <button className="text-white">Lưu</button>
                </div>
              </div>
            </div>

            {/* Container */}
            <div className="flex justify-between h-[300px]">
              <div className="p-6 w-[264px] shadow-lg bg-[#ffffff] rounded-[12px] flex flex-col gap-5">
                <span className="mb-2 text-[18px] font-semibold">Ảnh đại diện</span>
                <div className="flex flex-col gap-4 justify-center items-center">
                  <div className="w-[100px] h-[100px] rounded-full bg-[#E0E2E7] flex items-center justify-center">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <img
                        src={userImage}
                        alt="avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    )}
                  </div>

                  {/* Nút chọn ảnh */}
                  <label className="text-[#3858D6] bg-[#F4ECFB] py-[10px] px-[14px] rounded-[8px] cursor-pointer font-semibold ">
                    Chọn ảnh đại diện
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                  <span></span>
                </div>
              </div>

              <div className="w-[860px]">
                <div className="bg-[#ffffff] p-6 shadow-lg rounded-[12px]">
                  <h2 className="mb-2 text-[18px] font-semibold">Thông tin người dùng</h2>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium">Họ</label>
                    <input
                      type="text"
                      value={userFirstName}
                      onChange={(e) => setUserFirstName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-[8px] focus:outline-none bg-[#F9F9FC] border-[#E0E2E7] focus:border-gray-400"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium">Tên</label>
                    <input
                      type="text"
                      value={userLastName}
                      onChange={(e) => setUserLastName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-[8px] focus:outline-none bg-[#F9F9FC] border-[#E0E2E7] focus:border-gray-400"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium">ID vai trò</label>
                    <input
                      type="text"
                      value={userRoleId}
                      onChange={(e) => setUserRoleId(e.target.value)}
                      className="w-full px-4 py-2 border rounded-[8px] focus:outline-none bg-[#F9F9FC] border-[#E0E2E7] focus:border-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default EditUser;
