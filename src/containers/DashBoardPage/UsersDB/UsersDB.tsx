import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CaretDownIcon from '@/components/icons/CaretDownIcon';
import 'react-toastify/dist/ReactToastify.css';
import UpdateUser from './UserUpdate';
import userImage from '../../images/user/User-avatar.svg';
import Modal from 'react-modal';
import { http } from '@/api/http';
import Toast from '../Permissions/Toast';
import { AiOutlineDelete } from "react-icons/ai";
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
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
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

      setUsers(response.data.results || []);
      setTotalUsers(response.data.total);
    } catch (error) {
      // console.error("Error fetching users:", error);
      // toast.error('Failed to load users');
      console.error('Error fetching forms:', error);
      setMessage('Lỗi tải dữ liệu');
      setStatus('danger');
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
      sortBy: 'firstName', // Mặc định tìm kiếm theo firstName
      order,
    };

    // Nếu có giá trị, áp dụng tìm kiếm cả `firstName` và `lastName`
    if (value.trim()) {
      newParams.firstName = value;
      newParams.lastName = value;
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
      setMessage('Xóa yêu cầu thành công');
      setStatus('success');
      fetchUsers();
    } catch (error) {
      setMessage('Xóa yêu cầu thất bại');
      setStatus('danger');
    } finally {
      closeDeleteModal();
    }
  };
  const handleCloseToast = () => {
      setMessage('');
      setStatus('');
    };
  const handleUpdateSuccess = () => {
    setMessage('User updated successfully');
    setStatus('success');
    fetchUsers();
  };

  const totalPages = Math.ceil(totalUsers / limit);
  const currentPage = page || 1;
  const currentLimit = limit || 10;
  const totalUsersCount = totalUsers || 0;
  const start = totalUsersCount > 0 ? Math.max(1, (currentPage - 1) * currentLimit + 1) : 0;
  const end = totalUsersCount > 0 ? Math.min(currentPage * currentLimit, totalUsersCount) : 0;

  return (
    <div className='font-poppins p-6'>
      <Toast handleCloseToast={handleCloseToast} message={message} status={status}/>
      <div className="mt-4 flex items-center w-[42.5rem] pb-10">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearch}
          placeholder="Tìm kiếm Users"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none"
        />
      </div>
      <div className='flex justify-between '>
        <div className='text-[#191C1F] font-semibold text-[24px]'>Danh sách User</div>
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
            <tr className="overflow-hidden text-[14px] font-semibold border-b-gray-500 bg-gray-100">
              <th className="py-[18px] px-[22px] text-start">Avatar</th>
              <th className="py-[18px] px-[22px] text-start" onClick={() => handleSort('firstName')}>
                <div className='flex justify-start items-center cursor-pointer'>
                  <span>FirstName</span>
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
                  <span>LastName</span>
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
              <th className="py-[18px] px-[22px] text-center">Create at</th>
              <th className="py-[18px] px-[22px] text-center">Role</th>
              <th className="py-[18px] px-[22px] text-center">Tool</th>
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
                        ? "text-red-500 "
                        : "text-blue-500 "
                      }`}
                  >
                    {item.role.name}
                  </div>
                </td>
                <td>
                  <div className="flex justify-center space-x-4">
                    <UpdateUser userId={item.id} onUpdateSuccess={handleUpdateSuccess} />
                    <div className="text-red-600 hover:text-red-900 p-2 rounded-lg bg-red-200 inline-block cursor-pointer mx-1" onClick={() => openDeleteModal(item.id)}>
                      <AiOutlineDelete className="h-5 w-5" />
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
      <div className="flex items-center mt-6 text-[14px] text-[#667085] align-middle justify-center">
        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className={`w-[40px] h-[40px] w-8 h-8 flex items-center justify-center border ${currentPage === 1 ? 'text-black border-gray-300' : 'text-black border-gray-300'}`}
          >
            &laquo;
          </button>
          {[...Array(totalPages)].map((_, idx) => {
            const pageNumber = idx + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`w-[40px] h-[40px] w-[40px] h-[40px] text-[14px] font-semibold flex items-center justify-center border border-[#3858D6] ${pageNumber === currentPage ? 'bg-gray-600 text-white border-[#3858D6]' : 'text-[#8B8E99] border-[#8B8E99]'}`}
              >
                {pageNumber.toString().padStart(2, '0')}
              </button>
            );
          })}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className={`w-[40px] h-[40px] w-8 h-8 flex items-center justify-center border ${currentPage === totalPages ? 'text-black border-gray-300' : 'text-black border-gray-300'}`}
          >
             &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};
export default UsersDashBoard;
