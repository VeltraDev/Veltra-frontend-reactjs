import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import "react-toastify/dist/ReactToastify.min.css"
import { RoleForm } from '../RoleDB/RoleForm';
import ConfirmDeleteRoleModal from '../RoleDB/ConfirmDeleteRoleModal';
import { Dropdown, Menu, Checkbox, Button, Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { http } from '@/api/http';
import { FaPlus } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";
import Toast from '../Permissions/Toast';
import { LuPencil } from "react-icons/lu";
import { AiOutlineDelete } from "react-icons/ai";
interface Role {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    permissions: { id: string; name: string }[];
}

Modal.setAppElement('#root');

export default function RolePage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
    const [deleteRoleModalIsOpen, setDeleteRoleModalIsOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
    const [visibleFields, setVisibleFields] = useState<string[]>(['id', 'name', 'description', 'createdAt']);
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    useEffect(() => {
        fetchRoles(currentPage);
    }, [currentPage]);

    const fetchRoles = async (page: number) => {
        try {
            const response = await http.get(`/roles?page=${page}&limit=10&sortBy=createdAt&order=ASC`);
            setRoles(response.data.results);
            setTotalPages(Math.ceil(response.data.total / 10));
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu từ api:', error);
            setMessage('Lỗi tải dữ liệu');
            setStatus('danger');
        }
    };

    useEffect(() => {
        setFilteredRoles(
            roles.filter(role =>
                role.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [roles, searchTerm]);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const handleCloseToast = () => {
    setMessage('');
    setStatus('');
  };
    const openEditModal = (role: Role) => {
        setRoleToEdit(role);
        setModalIsOpen(true);
    };

    const closeEditModal = () => {
        setModalIsOpen(false);
        setRoleToEdit(null);
    };

    const openDeleteRoleModal = (roleId: string) => {
        setRoleToDelete(roleId);
        setDeleteRoleModalIsOpen(true);
    };

    const closeDeleteRoleModal = () => {
        setDeleteRoleModalIsOpen(false);
        setRoleToDelete(null);
    };

    const handleUpdateRole = async (values: { name: string; description: string; permissions: string[] }, removedPermissions: string[]) => {
        if (roleToEdit) {
            try {
                await http.patch(`/roles/${roleToEdit.id}`, values);
                setMessage('Role updated successfully!');
                setStatus('success');
                setTimeout(() => {
                    fetchRoles(currentPage);
                }, 500);
                setRoles(roles.map(role => role.id === roleToEdit.id ? { ...role, ...values } : role));
                closeEditModal();
                if (removedPermissions.length > 0) {
                    await handleDeletePermissions(roleToEdit.id, removedPermissions);
                }
            } catch (error) {
                setMessage('Error updating role!'); 
                setStatus('danger');
            }
        }
    };

    const handleDeleteRole = async () => {
        if (roleToDelete) {
            try {
                await http.delete(`/roles/${roleToDelete}`);
                setMessage('Xóa yêu cầu thành công');
                setStatus('success');
                setRoles(roles.filter(role => role.id !== roleToDelete));
                closeDeleteRoleModal();
                fetchRoles(currentPage);
            } catch (error) {
                setMessage('Xóa yêu cầu thất bại');
                setStatus('danger');
            }
        }
    };

    const handleDeletePermissions = async (roleId: string, permissionIds: string[]) => {
        try {
            await http.delete(`/roles/${roleId}/permissions`, {
                data: {
                    permissions: permissionIds
                }
            });
            setRoles(roles.map(role => {
                if (role.id === roleId) {
                    return {
                        ...role,
                        permissions: role.permissions.filter(permission => !permissionIds.includes(permission.id))
                    };
                }
                return role;
            }));
            fetchRoles(currentPage);
        } catch (error) {
            console.error("Error deleting permissions:", error);
        }
    };

    const handleFieldVisibilityChange = (field: string) => {
        setVisibleFields(prevFields =>
            prevFields.includes(field)
                ? prevFields.filter(f => f !== field)
                : [...prevFields, field]
        );
    };

    const menu = (
        <Menu>
            {['id', 'name', 'description', 'createdAt'].map(field => (
                <Menu.Item key={field}>
                    <Checkbox
                        checked={visibleFields.includes(field)}
                        onChange={() => handleFieldVisibilityChange(field)}
                    >
                        {field}
                    </Checkbox>
                </Menu.Item>
            ))}
        </Menu>
    );

    const getRoleClassNames = (roleName: string) => {
        if (roleName === 'ADMIN') {
            return 'font-semibold text-red-500';
        } else if (roleName === 'USER') {
            return 'font-semibold text-green-500';
        } else {
            return 'font-semibold text-blue-700';
        }
    };
    useEffect(() => {
        setFilteredRoles(
            roles.filter((role) =>
                role.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [roles, searchTerm]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.trim());
    };

    return (
        <>
            <Toast handleCloseToast={handleCloseToast} message={message} status={status} />
            <injectStyle />
            <div className="flex justify-between items-center mb-6 ">
                <input
                    type="text"
                    className="p-2 border border-gray-300 rounded w-[42.5rem] relative left-[65px] uppercase"
                    placeholder="Tìm kiếm Roles"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="container mx-auto p-4">
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeEditModal}
                    contentLabel="Role Form"
                    className="fixed inset-0 top-30 left-55 flex items-start justify-center z-50"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                >
                    <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[70vh] overflow-y-auto mt-10">
                        <button
                            onClick={closeEditModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <h2 className="text-xl font-bold mb-4">
                            {roleToEdit ? "Update Role" : "Add Role"}
                        </h2>
                        <RoleForm
                            initialValues={
                                roleToEdit
                                    ? {
                                        name: roleToEdit.name,
                                        description: roleToEdit.description,
                                        permissions: roleToEdit.permissions.map((p) => p.id),
                                    }
                                    : undefined
                            }
                            onSubmit={handleUpdateRole}
                        />
                    </div>
                </Modal>

                <ConfirmDeleteRoleModal
                    isOpen={deleteRoleModalIsOpen}
                    onRequestClose={closeDeleteRoleModal}
                    onDelete={handleDeleteRole}
                />

                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2">Danh sách Role</h1>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <Dropdown overlay={menu} trigger={['click']} className='border-white flex absolute right-[15%] hover:text-black hover:border-white !border-transparent !bg-transparent !text-black'>
                            <Button size="middle">
                                <MdOutlineSettings className='w-8 h-8 hover:bg-gray-300 rounded-md hover:text-black hover:border-white'/><DownOutlined className='text-white border-white'/>
                            </Button>
                        </Dropdown>
                        <button onClick={() => navigate('/dashboard/role/add')} className="px-4 py-2 text-green-600 hover:text-green-900 bg-green-200 rounded-md text-base flex w-[140px] absolute right-[53px]">
                            Thêm mới
                        <FaPlus className="ml-3 h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full text-base">
                        <thead>
                            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {visibleFields.includes('id') && <th className="px-6 py-3">ID</th>}
                                {visibleFields.includes('name') && <th className="px-6 py-3">Name</th>}
                                {visibleFields.includes('description') && <th className="px-6 py-3">Describle</th>}
                                {visibleFields.includes('createdAt') && <th className="px-6 py-3">Create at</th>}
                                <th className="px-6 py-3">Tool</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRoles.map((role) => (
                                <tr key={role.id}>
                                    {visibleFields.includes('id') && <td className="px-6 py-4 whitespace-nowrap">{role.id}</td>}
                                    {visibleFields.includes('name') && (
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded ${getRoleClassNames(role.name)}`}>
                                                {role.name}
                                            </span>
                                        </td>
                                    )}
                                    {visibleFields.includes('description') && (
                                        <td className="px-6 py-4 max-w-sm truncate cursor-auto" title={role.description}>
                                            {role.description}
                                        </td>
                                    )}
                                    {visibleFields.includes('createdAt') && <td className="px-6 py-4 whitespace-nowrap">{new Date(role.createdAt).toLocaleDateString()}</td>}
                                    <td className="px-6 py-4 whitespace-nowrap relative">
                                        <button className="text-orange-600 hover:text-orange-900 p-2 rounded-lg bg-orange-200 inline-block cursor-pointer mx-1" onClick={() => openEditModal(role)}>
                                            <LuPencil className="h-5 w-5" />
                                        </button>
                                        <button className="text-red-600 hover:text-red-900 p-2 rounded-lg bg-red-200 inline-block cursor-pointer mx-1" onClick={() => openDeleteRoleModal(role.id)}>
                                            <AiOutlineDelete className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-center mt-4">
                    <p className="text-sm text-gray-500"></p>
                    <div className="flex space-x-2">
                        <button
                            className="px-3 py-1 border text-sm w-[40px] h-[40px]"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            &laquo;
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                className={`w-[40px] h-[40px] px-3 py-1 text-sm ${currentPage === index + 1 ? 'bg-gray-500 text-white' : 'bg-white text-gray-700 border'}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            className="px-3 py-1 border text-sm w-[40px] h-[40px]"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                             &raquo;
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}