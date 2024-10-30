import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getFormById, updateFormById, getAllForms } from '../../../utils/PermissionAPI';
import { Link } from 'react-router-dom';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { TbReload } from 'react-icons/tb';
import { PermissionModel, PermissionModelPromotion } from './PermissionModel';
import Toast from './Toast';
import { IoArrowBackOutline } from "react-icons/io5";

const formEdit = () => {
  const [form, setForm] = useState({...PermissionModel, modules: []});
  const [editedform, setEditedform] = useState(PermissionModelPromotion);
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  const [selectedModule, setSelectedModule] = useState('');
  const [filteredModules, setFilteredModules] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchAllModules = async () => {
      try {
        const response = await getAllForms(1, 1000, 'module', 'DESC');
        const allModules = response.data.data?.results?.map((item) => item.module) || [];
        const uniqueModules = Array.from(new Set(allModules));
        setForm((prevForm) => ({ ...prevForm, modules: uniqueModules }));
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    fetchAllModules();
  }, []);

  const fetchform = async () => {
    try {
      const res = await getFormById(params.id);
      console.log(res)
      if (res.status === 200) {
        setForm(res.data.data);
        setEditedform(JSON.parse(JSON.stringify(res.data.data)));
      }
    } catch (err) {
      console.error('Error fetching form:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchform();
  }, []);

  const handleChangeInput = (e) => {
    const { name, value, type } = e.target;
    const keys = name.split('.');
    {
      setEditedform((prevState) => {
        const newState = { ...prevState };
        let tempState = newState;

        for (let i = 0; i < keys.length - 1; i++) {
          tempState = tempState[keys[i]];
        }

        tempState[keys[keys.length - 1]] =
          type === 'number' ? parseFloat(value) : value;

        return newState;
      });
    }
  };

  const handleResetField = (e) => {
    const { name } = e.target.dataset;
    const keys = name.split('.');
    {
      setEditedform((prevState) => {
        const newState = { ...prevState };
        let tempState = newState;
        let formState = { ...form };

        for (let i = 0; i < keys.length - 1; i++) {
          tempState = tempState[keys[i]];
        }

        for (let i = 0; i < keys.length - 1; i++) {
          formState = formState[keys[i]];
        }

        tempState[keys[keys.length - 1]] = formState[keys[keys.length - 1]];

        return newState;
      });
    }
  };

  const handleUpdateform = async (e) => {
    e.preventDefault();
    const { id, createdAt, ...tmpform } = editedform;
    try {
      const res = await updateFormById(params.id, tmpform);
      if (res.status === 200) {
        setMessage('Thay đổi thông tin thành công');
        setStatus('success');
        fetchform();
      }
    } catch (err) {
      setMessage('Thay đổi thông tin thất bại');
      setStatus('danger');
      console.error('Error create form:', err);
    } finally {
      setTimeout(() => {
        handleCloseToast();
      }, 5000);
    }
  };

  const handleCloseToast = () => {
    setMessage('');
    setStatus('');
  };



  return (
    <section className="container mt-10">
      <Toast
        handleCloseToast={handleCloseToast}
        message={message}
        status={status}
      />
      <Link
        className="mb-8 bg-[#f5f5f5] shadow hover:bg-slate-600 rounded-lg w-12 h-12 flex"
        to="/dashboard/permission"
      >
        <IoArrowBackOutline className="h-12 w-12" />
      </Link>
      <form onSubmit={handleUpdateform}>
        <div>
          <div className="flex justify-between">
            <p className="text-mainTitleColor text-mainTitle uppercase">
              Cập nhập Permission
            </p>

            <button
              type="submit"
              className="uppercase px-5 py-2 flex items-center rounded-md bg-[#604CC3] hover:bg-[#604CC3]/[.8] transition-all duration-200 ease-in font-bold text-white text-[15px] tracking-wider shadow-slate-400 shadow"
            >
              Lưu
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5 mt-5">
            <p className="text-mainTitleColor font-semibold text-[18px] uppercase">
              Thông tin cơ bản
            </p>
            <hr />

            <div className="grid grid-cols-12 mt-5 gap-3">
              <div className="col-span-12">
                <div className="flex w-full border-[2px] border-[#ccc] rounded-md overflow-hidden text-mainTitleColor my-3 h-10 text-base mb-3">
                  <span className="w-[10%] pl-2 border-r-[2px] border-[#ccc] flex items-center">
                    <label className="cursor-pointer" htmlFor="name">
                      Name <span className="text-primaryColor">*</span>
                    </label>
                    {editedform.name != form.name && (
                      <TbReload
                        className="inline-block ml-auto mr-2 cursor-pointer"
                        data-name="name"
                        data-type="text"
                        onClick={handleResetField}
                      />
                    )}
                  </span>
                  {isLoading ? (
                    <span className="animate-sweep-to-right block w-full h-6 bg-slate-400"></span>
                  ) : (
                    <>
                      <input
                        type="text"
                        className={`w-1/2 px-2 outline-0 ${
                          editedform.name != form.name && 'bg-[#FFC107]/[.7]'
                        }`}
                        name="name"
                        id="name"
                        value={editedform.name}
                        onChange={handleChangeInput}
                        data-tooltip-id="name"
                        placeholder="Nhập tên quyền hạn"
                        required
                      />
                    </>
                  )}
                </div>

                <div className="flex w-full border-[2px] border-[#ccc] rounded-md overflow-hidden text-mainTitleColor my-3 h-10 text-base mb-3">
                  <span className="w-[10%] pl-2 border-r-[2px] border-[#ccc] flex items-center">
                    <label htmlFor="apiPath" className="cursor-pointer">
                      apiPath <span className="text-primaryColor">*</span>
                    </label>
                    {editedform.apiPath != form.apiPath && (
                      <TbReload
                        className="inline-block ml-auto mr-2 cursor-pointer"
                        data-name="apiPath"
                        data-type="text"
                        onClick={handleResetField}
                      />
                    )}
                  </span>
                  {isLoading ? (
                    <span className="animate-sweep-to-right block w-full h-6 bg-slate-400"></span>
                  ) : (
                    <input
                      type="text"
                      className={`w-1/2 px-2 outline-0 ${
                        editedform.apiPath != form.apiPath && 'bg-[#FFC107]/[.7]'
                      }`}
                      name="apiPath"
                      id="apiPath"
                      value={editedform.apiPath}
                      onChange={handleChangeInput}
                      placeholder="/api/v1/"
                      required
                    />
                  )}
                </div>

                <div className="flex w-full border-[2px] border-[#ccc] rounded-md overflow-hidden text-mainTitleColor my-3 h-10 text-base mb-3">
                  <span className="w-[10%] pl-2 border-r-[2px] border-[#ccc] flex items-center">
                    <label htmlFor="method" className="cursor-pointer">
                      Method <span className="text-primaryColor">*</span>
                    </label>
                    {editedform.method != form.method && (
                      <TbReload
                        className="inline-block ml-auto mr-2 cursor-pointer"
                        data-name="method"
                        data-type="text"
                        onClick={handleResetField}
                      />
                    )}
                  </span>
                  <select className="w-1/2 px-2 outline-0" name="method" placeholder="" value={form.method} onChange={handleChangeInput} required>
                        <option value="" className='text-gray-500'><input type="text"/>Chọn method</option>
                        {methods.map((method) => (
                          <option key={method} value={method} className='text-black'>
                            {method}
                          </option>
                        ))}
                  </select>
                </div>

                <div className="flex w-full border-[2px] border-[#ccc] rounded-md overflow-hidden text-mainTitleColor my-3 h-10 text-base mb-3">
                  <span className="w-[10%] pl-2 border-r-[2px] border-[#ccc] flex items-center">
                    <label htmlFor="module" className="cursor-pointer">
                      Module <span className="text-primaryColor">*</span>
                    </label>
                    {editedform.module != form.module && (
                      <TbReload
                        className="inline-block ml-auto mr-2 cursor-pointer"
                        data-name="module"
                        data-type="text"
                        onClick={handleResetField}
                      />
                    )}
                  </span>
                  {isLoading ? (
                    <span className="animate-sweep-to-right block w-full h-6 bg-slate-400"></span>
                  ) : (
                    <select
                      className={`w-1/2 px-2 outline-0 uppercase ${
                        editedform.module !== form.module && 'bg-[#FFC107]/[.7]'
                      }`}
                      name="module"
                      id="module"
                      value={editedform.module}
                      onChange={handleChangeInput}
                      required
                    >
                      <option value="" className='text-gray-500'>Chọn module</option>
                      {(form.modules || []).map((module, index) => (
                        <option key={index} value={module}>
                          {module}
                        </option>
                      ))}
                    </select>
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

export default formEdit;
