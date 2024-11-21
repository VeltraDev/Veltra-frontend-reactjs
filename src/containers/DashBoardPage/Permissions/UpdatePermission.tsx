import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getFormById, updateFormById, getAllForms } from './PermissionAPI';
import { Link } from 'react-router-dom';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { TbReload } from 'react-icons/tb';
import { PermissionModel, PermissionModelPromotion } from './PermissionModel';
import Toast from './Toast';
import { IoArrowBackOutline } from "react-icons/io5";


interface FormParams {
  id: string;
}

interface Form {
  name: string;
  apiPath: string;
  method: string;
  module: string;
  modules: string[];
  createdAt?: string;
}

const UpdatePermission: React.FC = () => {
  const [form, setForm] = useState<Form>({...PermissionModel, modules: []});
  const [editedForm, setEditedForm] = useState<Form>(PermissionModelPromotion);
  const params = useParams<FormParams>();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchAllModules = async () => {
      try {
        const response = await getAllForms(1, 1000, 'module', 'DESC');
        const allModules = response.data.data?.results?.map((item: any) => item.module) || [];
        const uniqueModules = Array.from(new Set(allModules));
        setForm((prevForm) => ({ ...prevForm, modules: uniqueModules }));
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    fetchAllModules();
  }, []);

  const fetchForm = async () => {
    try {
      const res = await getFormById(params.id);
      if (res.status === 200) {
        setForm(res.data.data);
        setEditedForm({ ...res.data.data });
      }
    } catch (err) {
      console.error('Error fetching form:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForm();
  }, []);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const keys = name.split('.');

    setEditedForm((prevState) => {
      const newState = { ...prevState };
      let tempState: any = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        tempState = tempState[keys[i]];
      }

      tempState[keys[keys.length - 1]] = type === 'number' ? parseFloat(value) : value;
      return newState;
    });
  };

  const handleResetField = (e: React.MouseEvent<SVGElement>) => {
    const { name } = e.currentTarget.dataset!;
    const keys = name!.split('.');

    setEditedForm((prevState) => {
      const newState = { ...prevState };
      let tempState: any = newState;
      let formState: any = { ...form };

      for (let i = 0; i < keys.length - 1; i++) {
        tempState = tempState[keys[i]];
        formState = formState[keys[i]];
      }

      tempState[keys[keys.length - 1]] = formState[keys[keys.length - 1]];
      return newState;
    });
  };

  const handleUpdateForm = async (e: FormEvent) => {
    e.preventDefault();
    const { id, createdAt, ...tmpForm } = editedForm;
    try {
      const res = await updateFormById(params.id, tmpForm);
      if (res.status === 200) {
        setMessage('Thay đổi thông tin thành công');
        setStatus('success');
        fetchForm();
        setTimeout(() => {
          navigate('/dashboard/permission');
        }, 1300);
      }
    } catch (err) {
      setMessage('Thay đổi thông tin thất bại');
      setStatus('danger');
      console.error('Error updating form:', err);
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
      <form onSubmit={handleUpdateForm}>
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
                    {editedForm.name !== form.name && (
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
                    <input
                      type="text"
                      className={`w-1/2 px-2 outline-0 ${editedForm.name !== form.name && 'bg-[#FFC107]/[.7]'}`}
                      name="name"
                      id="name"
                      value={editedForm.name}
                      onChange={handleChangeInput}
                      placeholder="Nhập tên quyền hạn"
                      required
                    />
                  )}
                </div>

                <div className="flex w-full border-[2px] border-[#ccc] rounded-md overflow-hidden text-mainTitleColor my-3 h-10 text-base mb-3">
                  <span className="w-[10%] pl-2 border-r-[2px] border-[#ccc] flex items-center">
                    <label htmlFor="apiPath" className="cursor-pointer">
                      apiPath <span className="text-primaryColor">*</span>
                    </label>
                    {editedForm.apiPath != form.apiPath && (
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
                        editedForm.apiPath != form.apiPath && 'bg-[#FFC107]/[.7]'
                      }`}
                      name="apiPath"
                      id="apiPath"
                      value={editedForm.apiPath}
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
                    {editedForm.method != form.method && (
                      <TbReload
                        className="inline-block ml-auto mr-2 cursor-pointer"
                        data-name="method"
                        data-type="text"
                        onClick={handleResetField}
                      />
                    )}
                  </span>
                  <select 
                    className="w-1/2 px-2 outline-0" 
                    name="method" 
                    placeholder="" 
                    value={editedForm.method}  // Bind to editedForm.method
                    onChange={handleChangeInput} 
                    required
                  >
                    <option value="" className='text-gray-500'>Chọn method</option>
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
                    {editedForm.module != form.module && (
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
                        editedForm.module !== form.module && 'bg-[#FFC107]/[.7]'
                      }`}
                      name="module"
                      id="module"
                      value={editedForm.module}
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

export default UpdatePermission;
