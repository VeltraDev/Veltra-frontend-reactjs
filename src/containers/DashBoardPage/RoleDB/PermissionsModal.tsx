import React from 'react';
import Modal from 'react-modal';
import { X, Trash } from 'lucide-react';

interface PermissionsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  role: {
    id: string;
    permissions: { id: string; name: string }[];
  } | null;
  onDeletePermission: (roleId: string, permissionId: string) => void;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({ isOpen, onRequestClose, role, onDeletePermission }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="View Permissions"
      className="fixed inset-0 flex items-center justify-center z-40"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl mr-auto ml-100 relative">
        <button onClick={onRequestClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">Permissions</h2>
        {role && (
          <div className="max-h-64 overflow-y-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Permission Name
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {role.permissions.map(permission => (
                  <tr key={permission.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {permission.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => onDeletePermission(role.id, permission.id)}
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PermissionsModal;