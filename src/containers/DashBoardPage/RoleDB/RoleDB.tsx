import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit, Trash, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.min.css"
import { injectStyle } from "react-toastify/dist/inject-style";
import { RoleForm } from '../RoleDB/RoleForm';
import ConfirmDeleteRoleModal from '../RoleDB/ConfirmDeleteRoleModal';
import { Dropdown, Menu, Checkbox, Button, Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { http } from '@/api/http';

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

    useEffect(() => {
        fetchRoles(currentPage);
    }, [currentPage]);

    const fetchRoles = async (page: number) => {
        try {
            const response = await http.get(`/roles?page=${page}&limit=10&sortBy=createdAt&order=ASC`);
            setRoles(response.data.data.results);
            setTotalPages(Math.ceil(response.data.data.total / 10));
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu từ api:', error);
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
                console.log("Role updated successfully:", values);
                toast.success("Role updated successfully!");
                setTimeout(() => {
                    fetchRoles(currentPage);
                }, 500);
                setRoles(roles.map(role => role.id === roleToEdit.id ? { ...role, ...values } : role));
                closeEditModal();

                // Remove unselected permissions, if any
                if (removedPermissions.length > 0) {
                    await handleDeletePermissions(roleToEdit.id, removedPermissions);
                }
            } catch (error) {
                toast.error("Error updating role!");
                console.error("Error updating role:", error);
            }
        }
    };

    const handleDeleteRole = async () => {
        if (roleToDelete) {
            try {
                await http.delete(`/roles/${roleToDelete}`);
                console.log("Role deleted successfully:", roleToDelete);
                toast.success("Role deleted successfully!");
                setRoles(roles.filter(role => role.id !== roleToDelete));
                closeDeleteRoleModal();
                fetchRoles(currentPage);
            } catch (error) {
                toast.error("Error deleting role!");
                console.error("Error deleting role:", error);
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
            return 'bg-red-50 text-red-700';
        } else if (roleName === 'USER') {
            return 'bg-green-50 text-green-700';
        } else {
            return 'bg-blue-50 text-blue-700';
        }
    };

    return (
        <>
            <ToastContainer />
            <injectStyle />
            <div className="container mx-auto p-4 bg-gray-50">
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
                    <h1 className="text-2xl font-bold mb-2">Role</h1>
                    <div className="text-sm text-gray-500">
                        Dashboard &gt; Role List
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <Input.Search
                        placeholder="Search by role name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: 300, fontSize: '1rem' }}
                    />
                    <div className="flex items-center space-x-4">
                        <Dropdown overlay={menu} trigger={['click']}>
                            <Button size="middle">
                                Select Fields <DownOutlined />
                            </Button>
                        </Dropdown>
                        <button onClick={() => navigate('/dashboard/role/add')} className="px-4 py-2 bg-blue-600 text-white rounded-md text-base">
                            Add Role
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full text-base">
                        <thead>
                            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {visibleFields.includes('id') && <th className="px-6 py-3">ID</th>}
                                {visibleFields.includes('name') && <th className="px-6 py-3">Name</th>}
                                {visibleFields.includes('description') && <th className="px-6 py-3">Description</th>}
                                {visibleFields.includes('createdAt') && <th className="px-6 py-3">Created At</th>}
                                <th className="px-6 py-3">Action</th>
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
                                        <button className="text-blue-600 hover:text-blue-900 mr-2" onClick={() => openEditModal(role)}>
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button className="text-red-600 hover:text-red-900" onClick={() => openDeleteRoleModal(role.id)}>
                                            <Trash className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-500">Showing {currentPage} of {totalPages} pages</p>
                    <div className="flex space-x-2">
                        <button
                            className="px-3 py-1 border rounded-md text-sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                className={`px-3 py-1 rounded-md text-sm ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            className="px-3 py-1 border rounded-md text-sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}