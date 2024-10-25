import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit, Trash, Eye, X } from 'lucide-react';
import http from "@/utils/http";
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RoleForm } from '../../containers/DashBoardPage/RoleDB/RoleForm';
import ConfirmDeleteRoleModal from '../../containers/DashBoardPage/RoleDB/ConfirmDeleteRoleModal';
import ConfirmDeletePermissionModal from '../../containers/DashBoardPage/RoleDB/ConfirmDeletePermissonModal';
import PermissionsModal from '../../containers/DashBoardPage/RoleDB/PermissionsModal';

interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  permissions: { id: string; name: string }[];
}

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZiN2VjOGE2LWQ2YTQtNDUyNy1iODgyLWFiYzYyNzIxOTA2YiIsImVtYWlsIjoidHJhbnF1YW5taWthekBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJUcuG6p24gTmd1eeG7hW4gTWluaCIsImxhc3ROYW1lIjoiUXXDom4iLCJyb2xlIjp7ImlkIjoiNWM1Zjg2YzgtMWQ4ZS00ZTYyLThkOTctOGIyNjE1NGJhM2IxIiwibmFtZSI6IkFETUlOIn0sImlhdCI6MTcyOTg1NjMxMSwiZXhwIjoxNzI5ODU4MTExfQ.U5S0OJ8gSwnZ5tpJ1Crdzu20S6On9w33tk4ijvL4FsY';

Modal.setAppElement('#root');

export default function RolePage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [deleteRoleModalIsOpen, setDeleteRoleModalIsOpen] = useState(false);
  const [deletePermissionModalIsOpen, setDeletePermissionModalIsOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [permissionsModalIsOpen, setPermissionsModalIsOpen] = useState(false);
  const [roleToViewPermissions, setRoleToViewPermissions] = useState<Role | null>(null);
  const [permissionToDelete, setPermissionToDelete] = useState<{ roleId: string; permissionId: string } | null>(null);

  useEffect(() => {
    fetchRoles(currentPage);
  }, [currentPage]);

  const fetchRoles = async (page: number) => {
    try {
      const response = await http.get(`/roles?page=${page}&limit=10&sortBy=createdAt&order=ASC`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRoles(response.data.data.results);
      setTotalPages(Math.ceil(response.data.data.total / 10));
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ api:', error);
    }
  };

  useEffect(() => {
    setFilteredRoles(roles);
  }, [roles]);

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

  const openPermissionsModal = (role: Role) => {
    setRoleToViewPermissions(role);
    setPermissionsModalIsOpen(true);
  };

  const closePermissionsModal = () => {
    setPermissionsModalIsOpen(false);
    setRoleToViewPermissions(null);
  };

  const openDeletePermissionModal = (roleId: string, permissionId: string) => {
    setPermissionToDelete({ roleId, permissionId });
    setDeletePermissionModalIsOpen(true);
  };

  const closeDeletePermissionModal = () => {
    setDeletePermissionModalIsOpen(false);
    setPermissionToDelete(null);
  };

  const handleUpdateRole = async (values: { name: string; description: string; permissions: string[] }) => {
    if (roleToEdit) {
      try {
        await http.patch(`/roles/${roleToEdit.id}`, values, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.success("Role updated successfully!");
        setRoles(roles.map(role => role.id === roleToEdit.id ? { ...role, ...values } : role));
        closeEditModal();
        fetchRoles(currentPage); // Render lại dữ liệu sau khi cập nhật
      } catch (error) {
        toast.error("Error updating role!");
        console.error("Error updating role:", error);
      }
    }
  };

  const handleDeleteRole = async () => {
    if (roleToDelete) {
      try {
        await http.delete(`/roles/${roleToDelete}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.success("Role deleted successfully!");
        setRoles(roles.filter(role => role.id !== roleToDelete));
        closeDeleteRoleModal();
        fetchRoles(currentPage); // Render lại dữ liệu sau khi xóa
      } catch (error) {
        toast.error("Error deleting role!");
        console.error("Error deleting role:", error);
      }
    }
  };

  const handleDeletePermission = async () => {
    if (permissionToDelete) {
      const { roleId, permissionId } = permissionToDelete;
      try {
        await http.delete(`/roles/${roleId}/permissions`, {
          data: {
            permissions: [permissionId]
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.success("Permission deleted successfully!");
        setRoles(roles.map(role => {
          if (role.id === roleId) {
            return {
              ...role,
              permissions: role.permissions.filter(permission => permission.id !== permissionId)
            };
          }
          return role;
        }));
        closeDeletePermissionModal(); // Đóng modal sau khi xóa permission
        closePermissionsModal(); // Đóng modal permissions
        fetchRoles(currentPage); // Render lại dữ liệu sau khi xóa permission
      } catch (error) {
        toast.error("Error deleting permission!");
        console.error("Error deleting permission:", error);
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto p-4 bg-gray-50">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeEditModal}
          contentLabel="Update Role"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto relative">
            <button onClick={closeEditModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">Update Role</h2>
            {roleToEdit && (
              <RoleForm
                initialValues={{
                  name: roleToEdit.name,
                  description: roleToEdit.description,
                  permissions: roleToEdit.permissions.map(p => p.id), // Fetch and set permissions if needed
                }}
                onSubmit={handleUpdateRole}
              />
            )}
          </div>
        </Modal>

        <ConfirmDeleteRoleModal
          isOpen={deleteRoleModalIsOpen}
          onRequestClose={closeDeleteRoleModal}
          onDelete={handleDeleteRole}
        />

        <ConfirmDeletePermissionModal
          isOpen={deletePermissionModalIsOpen}
          onRequestClose={closeDeletePermissionModal}
          onDelete={handleDeletePermission}
        />

        <PermissionsModal
          isOpen={permissionsModalIsOpen}
          onRequestClose={closePermissionsModal}
          role={roleToViewPermissions}
          onDeletePermission={openDeletePermissionModal}
        />

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Role</h1>
          <div className="text-sm text-gray-500">
            Dashboard &gt; Role List
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="space-x-2">
            {['All'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-md ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <Link
            to="/dashboard/role/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Add Role
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Created At</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoles.map((role) => (
                <tr key={role.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{role.name}</td>
                  <td className="px-6 py-4">{role.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(role.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap relative">
                    <button className="text-blue-600 hover:text-blue-900 mr-2" onClick={() => openEditModal(role)}>
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-2" onClick={() => openPermissionsModal(role)}>
                      <Eye className="h-5 w-5" />
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
              className="px-3 py-1 border rounded-md"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 border rounded-md"
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