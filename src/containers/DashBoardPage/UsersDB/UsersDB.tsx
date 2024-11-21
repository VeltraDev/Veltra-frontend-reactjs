import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import CaretDownIcon from '@/components/icons/CaretDownIcon';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpdateUser from './UserUpdate';
import userImage from '../../images/user/User-avatar.svg';
import Modal from 'react-modal';
import { http } from '@/api/http';

const Skeleton = ({ width, height }: { width: string, height: string }) => (
  <div
    className="bg-gray-200 animate-pulse rounded"
    style={{ width, height }}
  />
);

const UsersDashBoard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
  const sortBy = searchParams.get('sortBy') || '';
  const order = searchParams.get('order') || '';

  useEffect(() => {
    fetchUsers();
  }, [page, limit, sortBy, order, searchParams]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const params: any = { page, limit };

      if (sortBy && sortBy.trim() !== "") {
        params.sortBy = sortBy;
      }
      if (order && order.trim() !== "") {
        params.order = order;
      }

      if (sortBy && searchParams.get(sortBy)) {
        params[sortBy] = searchParams.get(sortBy);
      }

      console.log('Fetching users with params:', params);
      const response = await http.get('users', { params });

      setUsers(response.data.data.results || []);
      setTotalUsers(response.data.data.total);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);


    const newParams: any = {
      page: '1',
      limit: limit.toString(),
      sortBy,
      order,
    };

    if (sortBy && value) {
      if (['firstName', 'lastName', 'email', 'phone', 'displayStatus', 'createdAt'].includes(sortBy)) {
        newParams[sortBy] = value;
      }
    }

    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      search: searchInput,
      page: newPage.toString(),
      limit: limit.toString(),
      sortBy,
      order,
    });
  };

  const handleSort = (newSortBy: string) => {
    let newOrder = 'asc';
    if (sortBy === newSortBy) {
      newOrder = order === 'asc' ? 'desc' : 'asc';
    }


    const newParams: any = {
      ...Object.fromEntries(searchParams.entries()),
      sortBy: newSortBy,
      order: newOrder,
      page: '1',
    };

    setSearchParams(newParams);
  };

  const openDeleteModal = (userId: string) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  // Hàm xử lý xóa người dùng
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await http.delete(`users/${userToDelete}`);
      toast.success('User deleted successfully');
      // Tải lại danh sách người dùng sau khi xóa thành công
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error('Failed to delete user');
    } finally {
      closeDeleteModal();
    }
  };

  // Xử lý khi cập nhật thành công
  const handleUpdateSuccess = () => {
    toast.success('User updated successfully');
    fetchUsers();
  };

  // Phân trang và hiển thị số lượng người dùng hiện tại
  const totalPages = Math.ceil(totalUsers / limit);
  const currentPage = page || 1;
  const currentLimit = limit || 10;
  const totalUsersCount = totalUsers || 0;
  const start = totalUsersCount > 0 ? Math.max(1, (currentPage - 1) * currentLimit + 1) : 0;
  const end = totalUsersCount > 0 ? Math.min(currentPage * currentLimit, totalUsersCount) : 0;

  return (
    <div className='font-poppins p-6'>
      <ToastContainer />
      <div className='flex justify-between'>
        <div className='text-[#191C1F] font-semibold text-[24px]'>User</div>
        <button className='py-[10px] px-[18px] bg-[#3858d6] text-white rounded-[8px] flex justify-between items-center w-[128px]'>
          <div className="icon-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M15.3333 7.33334H8.66666V0.666656C8.66666 0.298469 8.36819 0 8 0C7.63181 0 7.33334 0.298469 7.33334 0.666656V7.33331H0.666656C0.298469 7.33334 0 7.63181 0 8C0 8.36819 0.298469 8.66666 0.666656 8.66666H7.33331V15.3333C7.33331 15.7015 7.63178 16 7.99997 16C8.36816 16 8.66662 15.7015 8.66662 15.3333V8.66666H15.3333C15.7015 8.66666 15.9999 8.36819 15.9999 8C16 7.63181 15.7015 7.33334 15.3333 7.33334Z" fill="white" />
            </svg>
          </div>
          <span> Add User</span>
        </button>
      </div>

      {/* Search bar */}
      <div className="mt-4 flex items-center w-1/3">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearch}
          placeholder="Search users..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="mt-6">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="flex justify-between items-center mb-4">
              <Skeleton width="60px" height="60px" />
              <Skeleton width="120px" height="20px" />
              <Skeleton width="120px" height="20px" />
              <Skeleton width="180px" height="20px" />
              <Skeleton width="100px" height="20px" />
              <Skeleton width="60px" height="20px" />
              <Skeleton width="120px" height="40px" />
            </div>
          ))}
        </div>
      ) : (
        <table className="bg-[#ffffff] rounded-xl p-6 w-full table-auto mt-6 shadow-lg">
          <thead>
            <tr className="overflow-hidden text-[14px] font-semibold">
              <th className="py-[18px] px-[22px] text-start">Avatar</th>
              <th className="py-[18px] px-[22px] text-start" onClick={() => handleSort('firstName')}>
                <div className='flex justify-start items-center cursor-pointer'>
                  <span>Họ</span>
                  {sortBy === 'firstName' ? (
                    <div className={order === 'desc' ? 'rotate-180' : ''}>
                      <CaretDownIcon />
                    </div>
                  ) : (
                    <CaretDownIcon />
                  )}
                </div>
              </th>
              <th className="py-[18px] px-[22px] text-start" onClick={() => handleSort('lastName')}>
                <div className='flex justify-start items-center cursor-pointer'>
                  <span>Tên</span>
                  {sortBy === 'lastName' ? (
                    <div className={order === 'desc' ? 'rotate-180' : ''}>
                      <CaretDownIcon />
                    </div>
                  ) : (
                    <CaretDownIcon />
                  )}
                </div>
              </th>
              <th className="py-[18px] px-[22px] text-start" onClick={() => handleSort('email')}>
                <div className='flex justify-start items-center cursor-pointer'>
                  <span>Email</span>
                  {sortBy === 'email' ? (
                    <div className={order === 'desc' ? 'rotate-180' : ''}>
                      <CaretDownIcon />
                    </div>
                  ) : (
                    <CaretDownIcon />
                  )}
                </div>
              </th>
              <th className="py-[18px] px-[22px] text-center">Ngày tạo</th>
              <th className="py-[18px] px-[22px] text-center">Vai trò</th>
              <th className="py-[18px] px-[22px] text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className='border-t border-gray-200 text-sm font-semibold text-[#667085]'>
            {users.map(item => (
              <tr className="border-b hover:bg-gray-50" key={item.id}>
                <td className='py-[18px] px-[22px]'>
                  <img className="w-8 h-8 rounded-full" src={item.avatar || userImage} alt="avatar" />
                </td>
                <td className="py-[18px] px-[22px] font-normal">{item.firstName}</td>
                <td className="py-[18px] px-[22px] font-normal">{item.lastName}</td>
                <td className="py-[18px] px-[22px] font-normal">{item.email}</td>
                <td className="py-[18px] px-[22px] font-normal text-center">{new Date(item.createdAt).toLocaleDateString('en-GB')}</td>
                <td className=" py-[18px] px-[22px] text-center justify-center items-center w-[100px] h-[50px]">
                  <div
                    className={`py-[8px] px-[10px] rounded-xl w-full text-center ${item.role.name === "ADMIN"
                        ? "text-red-500 bg-red-100"
                        : "text-blue-500 bg-blue-100"
                      }`}
                  >
                    {item.role.name}
                  </div>
                </td>
                <td>
                  <div className="flex justify-center space-x-4">
                    <UpdateUser userId={item.id} onUpdateSuccess={handleUpdateSuccess} />
                    <div className="py-[8px] px-[8px] rounded-[8px] bg-[#FEECEE] cursor-pointer" onClick={() => openDeleteModal(item.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                        <path d="M12.9997 2.66666H10.933C10.614 1.11572 9.24973 0.002 7.66632 0H6.33298C4.74957 0.002 3.38526 1.11572 3.06632 2.66666H0.999664C0.631477 2.66666 0.333008 2.96513 0.333008 3.33331C0.333008 3.7015 0.631477 4 0.999664 4H1.66632V12.6667C1.66854 14.5067 3.15963 15.9978 4.99966 16H8.99966C10.8397 15.9978 12.3308 14.5067 12.333 12.6667V4H12.9997C13.3679 4 13.6663 3.70153 13.6663 3.33334C13.6663 2.96516 13.3679 2.66666 12.9997 2.66666ZM6.33301 11.3333C6.33301 11.7015 6.03454 12 5.66635 12C5.29813 12 4.99966 11.7015 4.99966 11.3333V7.33334C4.99966 6.96516 5.29813 6.66669 5.66632 6.66669C6.03451 6.66669 6.33298 6.96516 6.33298 7.33334V11.3333H6.33301ZM8.99966 11.3333C8.99966 11.7015 8.7012 12 8.33301 12C7.96482 12 7.66635 11.7015 7.66635 11.3333V7.33334C7.66635 6.96516 7.96482 6.66669 8.33301 6.66669C8.7012 6.66669 8.99966 6.96516 8.99966 7.33334V11.3333ZM4.44701 2.66666C4.73057 1.86819 5.4857 1.33434 6.33301 1.33331H7.66635C8.51367 1.33434 9.26879 1.86819 9.55235 2.66666H4.44701Z"
                          fill="#EB3D4D" />
                      </svg>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Confirm Delete User"
        className="bg-white rounded-lg max-w-screen-xl p-4 md:p-6 2xl:p-10 mt-20 shadow-lg focus: outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ml-[200px]"
      >
        <h2 className="text-lg font-semibold mb-4">Xác nhận xóa người dùng</h2>
        <p className="mb-6">Bạn có chắc chắn muốn xóa người dùng này không?</p>
        <div className="flex justify-end space-x-4">
          <button onClick={closeDeleteModal} className="px-4 py-2 rounded-3xl bg-gray-300 hover:bg-gray-400">Hủy</button>
          <button onClick={handleDeleteUser} className="px-4 py-2 rounded-3xl bg-red-600 text-white hover:bg-red-700">Xóa</button>
        </div>
      </Modal>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 text-[14px] text-[#667085]">
        <div>
          <span>Showing {start}-{end} from {totalUsersCount}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className={`w-8 h-8 flex items-center justify-center rounded-full border ${currentPage === 1 ? 'text-gray-300 border-[#3858D6]' : 'text-blue-500 border-blue-500'}`}
          >
            <div className="icon-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20.25 12H3.75" stroke="#3858D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M10.5 5.25L3.75 12L10.5 18.75" stroke="#3858D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const pageNumber = idx + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`w-[40px] h-[40px] text-[14px] font-semibold flex items-center justify-center rounded-full border border-[#3858D6] ${pageNumber === currentPage ? 'bg-[#3858D6] text-white border-[#3858D6]' : 'text-[#8B8E99] border-[#8B8E99]'}`}
              >
                {pageNumber.toString().padStart(2, '0')}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className={`w-8 h-8 flex items-center justify-center rounded-full border ${currentPage === totalPages ? 'text-gray-300 border-[#3858D6]' : 'text-blue-500 border-blue-500'}`}
          >
            <div className="icon-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3.75 12L20.25 12" stroke="#3858D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M13.5 18.75L20.25 12L13.5 5.25" stroke="#3858D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersDashBoard;
