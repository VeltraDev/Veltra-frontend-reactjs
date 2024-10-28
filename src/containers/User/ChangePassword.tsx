import { useState, useEffect } from 'react';
import http from '@/utils/http';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Sidebar from './SideBar';

const ChangePassword = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await http.get('/auth/account');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Tất cả các trường đều bắt buộc phải nhập!", {
        position: "top-right",
        autoClose: 3000,
      });
      
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (newPassword === currentPassword) {
      toast.error("Mật khẩu mới không được trùng với mật khẩu hiện tại!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      await http.put('/users/update-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      toast.success("Đổi mật khẩu thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.response && error.response.data && error.response.data.message) {
        error.response.data.message.forEach((msg) => {
          toast.error(msg, {
            position: "top-right",
            autoClose: 5000,
          });
        });
      } else {
        toast.error("Có lỗi xảy ra khi đổi mật khẩu!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-r from-[#3a343e] via-[#142f4e] via-30% to-[#145450] to-90% py-10">
      <ToastContainer />
      <Sidebar/>

      <div className="bg-[#1c2b33] p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#cccccc]">
            {loading ? <Skeleton width={200} /> : "Đổi mật khẩu"}
          </h2>
        </div>

        <div className="flex gap-8">
          <div className="flex-1 bg-[#1c2b33] border border-gray-600 p-6 rounded-lg shadow-md">
            <h3 className="text-lg text-[#cccccc] font-semibold mb-4">
              {loading ? <Skeleton width={150} /> : "Thông tin mật khẩu"}
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-1">
                  {loading ? <Skeleton width={100} /> : "Mật khẩu hiện tại"}
                </label>
                {loading ? (
                  <Skeleton height={40} />
                ) : (
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border bg-[#243949] text-[#cccccc] border-gray-600 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-1">
                  {loading ? <Skeleton width={100} /> : "Mật khẩu mới"}
                </label>
                {loading ? (
                  <Skeleton height={40} />
                ) : (
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border bg-[#243949] text-[#cccccc] border-gray-600 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-1">
                  {loading ? <Skeleton width={150} /> : "Xác nhận mật khẩu mới"}
                </label>
                {loading ? (
                  <Skeleton height={40} />
                ) : (
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border bg-[#243949] text-[#cccccc] border-gray-600 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  />
                )}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleChangePassword}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-[50px] hover:bg-indigo-700"
                  disabled={loading}
                >
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
