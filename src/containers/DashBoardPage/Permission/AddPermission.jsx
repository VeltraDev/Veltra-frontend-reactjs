import React, { useState, useEffect } from 'react';
import { PermissionModel } from '../../DashBoardPage/Permission/PermissionModel';
import { submitForm, getAllForms } from '../../../utils/PermissionAPI';
import Toast from './Toast';
import { Link } from 'react-router-dom';
import { IoArrowBackOutline } from "react-icons/io5";

const AddForm = () => {
  const [form, setForm] = useState({...PermissionModel, modules: []});
  const [toast, setToast] = useState({ message: '', status: '' });
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  const [selectedModule, setSelectedModule] = useState('');
  const [filteredModules, setFilteredModules] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchAllModules = async () => {
      try {
        const response = await getAllForms(1, 1000, 'module', 'DESC');
        const allModules = response.data?.results?.map((item) => item.module) || [];
        const uniqueModules = Array.from(new Set(allModules));
        setForm((prevForm) => ({ ...prevForm, modules: uniqueModules }));
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    fetchAllModules();
  }, []);

   const handleInputChange = (e) => {
    const input = e.target.value;
    setSelectedModule(input);

   
     const matchingModules = input
      ? form.modules.filter((module) => module.toLowerCase().includes(input.toLowerCase()))
      : form.modules;
    setFilteredModules(matchingModules);
    setIsDropdownVisible(true);
  };
  const handleOptionClick = (module) => {
    setSelectedModule(module); 
    setForm((prevForm) => ({ ...prevForm, module }));
    setIsDropdownVisible(false);
  };

  const handleChangeInput = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

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
  if (!selectedModule || typeof selectedModule !== 'string') {
    setToast({ message: 'Module phải là chuỗi ký tự và không được để trống', status: 'danger' });
    return;
  }
  if (form.modules.includes(selectedModule)) {
    setToast({ message: 'Module với tên này đã tồn tại, vui lòng chọn tên module khác', status: 'danger' });
    return;
  }
  try {
    const tmpForm = {
      name: form.name,
      apiPath: form.apiPath,
      method: form.method,
      module: selectedModule,
    };

    const res = await submitForm(tmpForm);
    if (res.status === 201) {
      setToast({ message: 'Nhập mới thành công', status: 'success' });
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
                  <div className="flex w-full border-2 border-[#ccc] rounded-md overflow-hidden text-mainTitleColor my-3 h-10">
                    <label className="w-[10%] pl-2 border-r-2 border-[#ccc] flex items-center" htmlFor="name">
                       Name<span className="text-red-600">*</span>
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
                  <div className="flex w-full border-2 border-[#ccc] rounded-md overflow-hidden text-mainTitleColor my-3 h-10">
                    <label className="w-[10%] pl-2 border-r-2 border-[#ccc] flex items-center" htmlFor="name">
                       apiPath<span className="text-red-600">*</span>
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
                  <div className="flex w-full border-2 border-[#ccc] rounded-md overflow-hidden text-mainTitleColor my-3 h-10">
                    <label className="w-[10%] pl-2 border-r-2 border-[#ccc] flex items-center" htmlFor="name">
                      Method<span className="text-red-600">*</span>
                    </label>
                    <select className="w-1/2 px-2 outline-0 text-gray-500" name="method" placeholder="" value={form.method} onChange={handleChangeInput} required>
                        <option value="" className='text-gray-500'><input type="text"/>Chọn method</option>
                        {methods.map((method) => (
                          <option key={method} value={method} className='text-black'>
                            {method}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className='flex relative w-full border-2 border-[#ccc] rounded-md text-mainTitleColor my-3 h-10'>
                    <label className="w-[10%] pl-2 border-r-2 border-[#ccc] flex items-center" htmlFor="moduleInput">Module<span className="text-red-600">*</span></label>
                    <input
                      type="text"
                       className="w-1/2 px-2 outline-0"
                      id="moduleInput"
                      value={selectedModule}
                      onChange={handleInputChange}
                      onFocus={() => setIsDropdownVisible(true)}
                      onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
                      placeholder="Chọn hoặc nhập module"
                      required
                    />
                    {isDropdownVisible && (
                      <div className="absolute top-full left-28 right-0 border border-gray-300 bg-white z-50 max-h-[150px] overflow-y-auto">
                        {filteredModules.map((module, index) => (
                          <div
                            key={index}
                            onClick={() => handleOptionClick(module)}
                            style={{
                              padding: '8px',
                              cursor: 'pointer',
                              backgroundColor: selectedModule === module ? '#f0f0f0' : 'transparent'
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            {module}
                          </div>
                        ))}
                      </div>
                    )}
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
