import { useEffect, useState, useRef } from 'react';
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
import { MdOutlineSettings } from "react-icons/md";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

export default function Permission() {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formIdToDelete, setFormIdToDelete] = useState(null);
  const [isAscending, setIsAscending] = useState(true);
  const pageSize = 10;
  const { id } = useParams();
  const [visibleFilters, setVisibleFilters] = useState([
    'form.name',
    'form.apiPath',
    'form.method',
    'form.module',
    'form.createAt',
  ]);
  const [showFilterComponent, setShowFilterComponent] = useState(false);
  const filterComponentRef = useRef(null);
  const toggleFilter = (filter) => {
      setVisibleFilters((prevFilters) =>
        prevFilters.includes(filter)
          ? prevFilters.filter((f) => f !== filter)
          : [...prevFilters, filter]
      );
    };
  const toggleFilterComponent = () => {
    setShowFilterComponent(true);
  };

  const labelMapping = {
  'Name': 'form.name',
  'ApiPath': 'form.apiPath',
  'Method': 'form.method',
  'Module': 'form.module',
  'CreateAt': 'form.createAt'
};

  const handleClickOutside = (event) => {
    if (
      filterComponentRef.current &&
      !filterComponentRef.current.contains(event.target)
    ) {
      setShowFilterComponent(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    setIsLoading(true);
    try {
      const res = await getAllForms(1, 1000, 'module', 'DESC');
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

  const sortForms = () => {
    const sortedForms = [...forms].sort((a, b) => {
      if (a.name < b.name) return isAscending ? -1 : 1;
      if (a.name > b.name) return isAscending ? 1 : -1;
      return 0;
    });
    setForms(sortedForms);
  };

  const handleSortAscending = () => {
    setIsAscending(true);
    sortForms();
  };

  const handleSortDescending = () => {
    setIsAscending(false);
    sortForms();
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
    return format(new Date(isoDate), 'dd/MM/yyyy');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteClick = (id) => {
    setFormIdToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    handleDeleteForm(formIdToDelete);
    setShowDeleteConfirm(false);
    setFormIdToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setFormIdToDelete(null);
  };

  const filteredForms = forms.filter((form) =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedForms = filteredForms.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredForms.length / pageSize);

  const getMethodColorClass = (method) => {
    switch (method) {
      case 'GET':
        return 'text-green-600';
      case 'POST':
        return 'text-yellow-500';
      case 'DELETE':
        return 'text-red-600';
      case 'PUT':
        return 'text-blue-600';
      case 'PATCH':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <section className=''>
      <Toast handleCloseToast={handleCloseToast} message={message} status={status} />
      <input
            type="text"
            className="p-2 border border-gray-300 rounded w-[42.5rem] relative left-[65px]"
            placeholder="Tìm kiếm theo tên"
            value={searchTerm}
            onChange={handleSearchChange}
          />
      <div className="mt-5 bg-white rounded-2xl h-max py-5 shadow-md ml-[64px] mr-[8px]">
        <div className="flex items-center justify-between px-5">
          <p className="text-mainTitleColor font-semibold text-[18px]">
            Danh sách Permission
          </p>
          <div className="flex absolute right-[18%]">
            <div className="cursor-pointer hover:bg-gray-300 rounded-md mr-2" onClick={handleSortDescending}>
              <FaChevronDown className='w-7 h-7 ' />
            </div>
            <div className="cursor-pointer hover:bg-gray-300 rounded-md ml-2" onClick={handleSortAscending}>
              <FaChevronUp className='w-7 h-7 ' />
            </div>
          </div>
          <div className="absolute right-[27%] cursor-pointer">
            {!showFilterComponent && (<MdOutlineSettings className='w-8 h-8 hover:bg-gray-300 rounded-md' onClick={toggleFilterComponent}/> )}
              {showFilterComponent && ( <div className="bg-white border-2 rounded-md top-[69px] relative ">
                <div className="filter-component w-[150px] h-[167px]" ref={filterComponentRef}>
                  {Object.keys(labelMapping).map((label) => (
                    <div key={label} className='py-1 pl-2 border-b-gray-500 border-b-2 hover:bg-gray-300'>
                      <label>
                        <input
                          type="checkbox"
                          checked={visibleFilters.includes(labelMapping[label])}
                          onChange={() => toggleFilter(labelMapping[label])}
                        />
                        {"  "}{label}
                      </label>
                    </div>
                  ))}
                </div>
              </div> )}
          </div>
          <Link className="text-green-600 hover:text-green-900 p-2 rounded-lg bg-green-200 flex font-semibold" to={`/dashboard/permission/addpermission`}>
             Thêm mới
            <FaPlus className="ml-3 h-5 w-5" />
          </Link>
        </div>
        <div className="overflow-x-auto mt-5">
          <table className="divide-y divide-gray-200 w-[1078px]">
            <thead className="bg-[#f5f5f5] filtered-results">
              <tr>
                <th className="pl-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">STT</th>
                {visibleFilters.includes('form.name') && <th className="pl-7 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>}
                {visibleFilters.includes('form.apiPath') && <th className="pl-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">apiPath</th>}
                {visibleFilters.includes('form.method') && <th className="pl-1 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>}
                {visibleFilters.includes('form.module') && <th className="pl-10 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Module</th>}
                {visibleFilters.includes('form.createAt') && <th className="pl-9 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>}
                <th className="pl-19 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tool</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">Đang tải dữ liệu...</td>
                </tr>
              ) : paginatedForms.length > 0 ? (
                paginatedForms.map((form, index) => (
                  <tr key={form.id} className="filtered-results">
                    <td className="pl-6 py-4 whitespace-nowrap text-base text-gray-500">{startIndex + index + 1}</td>
                    {visibleFilters.includes('form.name') && <td className="pl-3 py-4 whitespace-nowrap text-base text-gray-500">{form.name.length > 15 ? `${form.name.slice(0, 15)}...` : form.name}</td>}
                    {visibleFilters.includes('form.apiPath') && <td className="pl-3 py-4 whitespace-nowrap text-base text-gray-500">{form.apiPath.length > 20 ? `${form.apiPath.slice(0, 20)}...` : form.apiPath}</td>}
                    {visibleFilters.includes('form.method') && <td className={`py-4 whitespace-nowrap text-base font-bold ${getMethodColorClass(form.method)}`}>{form.method}</td>}
                    {visibleFilters.includes('form.module') && <td className="pl-10 py-4 whitespace-nowrap text-base text-gray-500">{form.module}</td>}
                    {visibleFilters.includes('form.createAt') && <td className="pl-9 py-4 whitespace-nowrap text-base text-gray-500">{formatDate(form.createdAt)}</td>}
                    <td className="pl-13 py-4 whitespace-nowrap text-base font-medium">
                      <Link className="text-orange-600 hover:text-orange-900 p-2 rounded-lg bg-orange-200 inline-block cursor-pointer mx-1" to={`/dashboard/permission/updatepermission/${form.id}`}>
                        <LuPencil className="h-5 w-5" />
                      </Link>
                      <span className="text-red-600 hover:text-red-900 p-2 rounded-lg bg-red-200 inline-block cursor-pointer mx-1" onClick={() => handleDeleteClick(form.id)}>
                        <AiOutlineDelete className="h-5 w-5" />
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
      </div>
       {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <p className="text-gray-800 text-lg mb-4">Bạn có chắc chắn muốn xóa permission này không?</p>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={confirmDelete}>Có</button>
              <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded" onClick={cancelDelete}>Không</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
