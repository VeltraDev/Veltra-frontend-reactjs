import { useEffect, useState } from 'react';
import {
  getAllForms,
  deleteFormById,
} from '../../../utils/PermissionAPI';
import Toast from './Toast';
import Paginator from './Paginator';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { AiOutlineDelete } from "react-icons/ai";
import { LuPencil } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import { useParams } from 'react-router-dom';

export default function Permission () {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { id } = useParams();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    setIsLoading(true);
    try {
      const res = await getAllForms(1, 10, 'module', 'DESC');
      const reversedForms = Array.isArray(res.data.data.results)
        ? [...res.data.data.results].reverse()
        : [];
      setForms(reversedForms);
    } catch (error) {
      console.error('Error fetching forms:', error);
      setMessage('Lỗi tải dữ liệu');
      setStatus('danger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteForm = async (id) => {

    try {
      const res = await deleteFormById(id);
      if (res.status === 200) {
        fetchForms();
        setMessage('Xóa yêu cầu thành công');
        setStatus('success');
      } else {
        setMessage('Xóa yêu cầu thất bại');
        setStatus('danger');
      }
    } catch (err) {
      console.error('Error deleting form:', err);
      setMessage('Xóa yêu cầu thất bại');
      setStatus('danger');
    } finally {
      setTimeout(() => {
        setMessage('');
        setStatus('');
      }, 5000);
    }
  };

  const handleCloseToast = () => {
    setMessage('');
    setStatus('');
  };

  const formatDate = (isoDate) => {
    return format(new Date(isoDate), 'dd/MM/yyyy HH:mm:ss');
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedForms = forms.slice(startIndex, endIndex);
  const totalPages = Math.ceil(forms.length / pageSize);
  return (
    <section className=''>
      <Toast
        handleCloseToast={handleCloseToast}
        message={message}
        status={status}
      />
      <div className="mt-5 bg-white rounded-2xl h-max py-5 shadow-md ml-[64px] mr-[8px]">
        <div className="flex items-center">
          <p className="text-mainTitleColor font-semibold text-[18px] px-5 mr-8">
            Danh sách Permission
          </p>
          <Paginator
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          <Link className="text-green-600 hover:text-green-900 p-2 rounded-lg bg-green-200 inline-block absolute right-14" to={`/dashboard/permission/addpermission`}>
            <FaPlus className="h-5 w-5" />
          </Link>
        </div>
        <div className="overflow-x-auto ">
          <table className="divide-y divide-gray-200 mt-5">
            <thead className="bg-[#f5f5f5]">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold whitespace-nowrap text-gray-500 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  apiPath
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tool
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : paginatedForms.length > 0 ? (
                paginatedForms.map((form, index) => (
                  <tr key={form.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                      {form.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                      {form.apiPath}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                      {form.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                      {form.module}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                      {formatDate(form.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium">
                      {/* <Link className="text-green-600 hover:text-green-900 p-2 rounded-lg bg-green-200 inline-block" to={`/dashboard/permission/addpermission`}>
                        <FaPlus className="h-5 w-5" />
                      </Link> */}
                      <Link
                        className="text-orange-600 hover:text-orange-900 p-2 rounded-lg bg-orange-200 inline-block"
                        to={`/dashboard/permission/updatepermission/${form.id}`}
                      >
                        {form.status === 'success' ? (
                          <LuPencil className="h-5 w-5" />
                        ) : (
                          <LuPencil className="h-5 w-5" />
                        )}
                      </Link>
                      <span
                        className="text-red-600 hover:text-red-900 p-2 rounded-lg bg-red-200 inline-block cursor-pointer"
                        onClick={() => handleDeleteForm(form.id)}
                      >
                        <AiOutlineDelete className="h-5 w-5" />
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
