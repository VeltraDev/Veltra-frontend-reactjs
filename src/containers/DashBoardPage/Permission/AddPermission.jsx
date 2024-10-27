import React, { useState } from 'react';
import { PermissionModel } from '../../DashBoardPage/Permission/PermissionModel';
import { submitForm } from '../../../utils/PermissionAPI';
import Toast from './Toast';
import { useNavigate } from 'react-router';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { IoArrowBackOutline } from "react-icons/io5";

const AddForm = () => {
  const [form, setForm] = useState(PermissionModel);
  const [imagePreview, setImagePreview] = useState({ poster: '', image: '', hover_image: '' });
  const [toast, setToast] = useState({ message: '', status: '' });
  const navigate = useNavigate();

  const handleChangeInput = (e) => {
    const { name, value, files, type } = e.target;
    if (files) {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));
      setImagePreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Kiểm tra dữ liệu đầu vào
  const errors = [];
  if (!form.name || typeof form.name !== 'string') {
    setToast({ message: 'Tên quyền hạn phải là chuỗi ký tự và không được để trống', status: 'danger' });
    return;
  }
  if (!form.apiPath || typeof form.apiPath !== 'string') {
    setToast({ message: 'API path phải là chuỗi ký tự và không được để trống', status: 'danger' });
    return;
  }
  if (!form.method || typeof form.method !== 'string') {
    setToast({ message: 'Method phải là chuỗi ký tự và không được để trống', status: 'danger' });
    return;
  }
  if (!form.module || typeof form.module !== 'string') {
    setToast({ message: 'Module phải là chuỗi ký tự và không được để trống', status: 'danger' });
    return;
  }

  if (errors.length > 0) {
    setToast({ message: errors.join(', '), status: 'danger' });
    return;
  }

  // Lấy accessToken
  const accessToken = JSON.parse(localStorage.getItem('data'))?.access_token;

  try {
    // Upload files and prepare form data
    const [posterRes, imageRes, hoverImageRes] = await Promise.all([
    ]);

    const fileUploadRegex = /[^/]*$/;
    const tmpForm = {
      name: form.name,
      apiPath: form.apiPath,
      method: form.method,
      module: form.module,
    };

    const res = await submitForm(tmpForm);
    if (res.status === 201) {
      setToast({ message: 'Nhập mới thành công', status: 'success' });
      setImagePreview({ poster: '', image: '', hover_image: '' });
    }
  } catch (error) {
    console.error('Error creating form:', error);
    setToast({ message: 'Nhập thất bại', status: 'danger' });
  } finally {
    setTimeout(() => setToast({ message: '', status: '' }), 5000);
  }
};


  return (
    <section className='mt-10'>
      <Toast {...toast} handleCloseToast={() => setToast({ message: '', status: '' })} />
      <Link
        className="mb-8 bg-[#f5f5f5] shadow hover:bg-slate-600 rounded-lg w-12 h-12 flex"
        to="/dashboard/permission"
      >
        <IoArrowBackOutline className="h-12 w-12" />
      </Link>
      <form onSubmit={handleSubmit}>
        <div className="container">
          <div className="flex justify-between">
            <p className="text-mainTitleColor text-mainTitle uppercase">Nhập Permission</p>
            <button type="submit" className="uppercase px-5 py-2 rounded-md bg-[#604CC3] hover:bg-[#604CC3]/[.8] font-bold text-white shadow-md">
              Lưu
            </button>
          </div>
        </div>

        <div className="container mt-5">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-mainTitleColor font-semibold text-[18px] uppercase">Thông tin cơ bản</p>
            <hr />
            <div className="grid grid-cols-12 mt-5 gap-3">
                <div className="col-span-12 mb-3">
                  <div className="flex w-full border-2 border-[#ccc] rounded-md overflow-hidden text-mainTitleColor">
                    <label className="w-[10%] pl-2 border-r-2 border-[#ccc]" htmlFor="name">
                       Name<span className="text-primaryColor">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-1/2 px-2 outline-0"
                        name="name"
                        id="name"
                        value={form.name}
                        onChange={handleChangeInput}
                        placeholder="Nhập tên quyền hạn"
                        required
                    />
                  </div>
                  <div className="flex w-full border-2 border-[#ccc] rounded-md overflow-hidden text-mainTitleColor">
                    <label className="w-[10%] pl-2 border-r-2 border-[#ccc]" htmlFor="name">
                       apiPath<span className="text-primaryColor">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-1/2 px-2 outline-0"
                        name="apiPath"
                        id="apiPath"
                        value={form.apiPath}
                        onChange={handleChangeInput}
                        placeholder="/api/v1/"
                        required
                    />
                  </div>
                  <div className="flex w-full border-2 border-[#ccc] rounded-md overflow-hidden text-mainTitleColor">
                    <label className="w-[10%] pl-2 border-r-2 border-[#ccc]" htmlFor="name">
                       Method<span className="text-primaryColor">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-1/2 px-2 outline-0 uppercase"
                        name="method"
                        id="method"
                        value={form.method}
                        onChange={handleChangeInput}
                        placeholder="Nhập method"
                        required
                    />
                  </div>
                  <div className="flex w-full border-2 border-[#ccc] rounded-md overflow-hidden text-mainTitleColor">
                        <label className="w-[10%] pl-2 border-r-2 border-[#ccc]" htmlFor="name">
                       Module<span className="text-primaryColor">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-1/2 px-2 outline-0 uppercase"
                        name="module"
                        id="module"
                        value={form.module}
                        onChange={handleChangeInput}
                        placeholder="Nhập module"
                        required
                    />
                  </div> 
                </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AddForm;
