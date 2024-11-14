import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
    Search, Filter, Download, MoreHorizontal, Edit2, Trash2,
    UserPlus, Mail, Ban, CheckCircle, XCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';

// Form schema
const userSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    role: z.enum(['user', 'admin', 'moderator']),
    status: z.enum(['active', 'inactive', 'banned'])
});

type UserFormData = z.infer<typeof userSchema>;

// Mock users data
const mockUsers = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        lastActive: '2 minutes ago',
        avatar: 'https://i.pravatar.cc/150?img=1'
    },
    // Add more mock users...
];

export default function DashboardUsers() {
    const { currentTheme } = useTheme();
    const [showAddUser, setShowAddUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema)
    });

    const onSubmit = (data: UserFormData) => {
        toast.success(`User ${selectedUser ? 'updated' : 'created'} successfully`);
        setShowAddUser(false);
        setSelectedUser(null);
        reset();
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className={`text-2xl font-bold ${currentTheme.headerText}`}>Users</h1>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.iconColor}`} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`
                pl-10 pr-4 py-2 rounded-xl w-full sm:w-auto
                ${currentTheme.input} ${currentTheme.text}
                focus:outline-none focus:ring-2 focus:ring-blue-500/50
              `}
                        />
                    </div>

                    <button
                        className={`
              flex items-center space-x-2 px-4 py-2 rounded-xl
              ${currentTheme.buttonHover} transition-colors
            `}
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                    </button>

                    <button
                        onClick={() => setShowAddUser(true)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Add User</span>
                    </button>

                    <button
                        className={`
              flex items-center space-x-2 px-4 py-2 rounded-xl
              ${currentTheme.buttonHover} transition-colors
            `}
                    >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className={`${currentTheme.bg} rounded-xl border ${currentTheme.border} overflow-hidden`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`border-b ${currentTheme.border}`}>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">User</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Role</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Last Active</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className={`border-b last:border-b-0 ${currentTheme.border} hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={user.avatar}
                                                alt={`${user.firstName} ${user.lastName}`}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <p className={`font-medium ${currentTheme.text}`}>
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className={`text-sm ${currentTheme.mutedText}`}>
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                                : user.role === 'moderator'
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                            }
                    `}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${user.status === 'active'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : user.status === 'inactive'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }
                    `}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-sm ${currentTheme.mutedText}`}>
                                        {user.lastActive}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className={`p-2 rounded-lg ${currentTheme.buttonHover}`}
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                className={`p-2 rounded-lg ${currentTheme.buttonHover}`}
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                className={`p-2 rounded-lg ${currentTheme.buttonHover}`}
                                                title="More"
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit User Modal */}
            {(showAddUser || selectedUser) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className={`${currentTheme.bg} rounded-xl max-w-md w-full`}>
                        <div className="p-6 space-y-4">
                            <h2 className={`text-xl font-semibold ${currentTheme.headerText}`}>
                                {selectedUser ? 'Edit User' : 'Add New User'}
                            </h2>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>
                                            First Name
                                        </label>
                                        <input
                                            {...register('firstName')}
                                            className={`w-full ${currentTheme.input} rounded-lg px-3 py-2`}
                                        />
                                        {errors.firstName && (
                                            <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>
                                            Last Name
                                        </label>
                                        <input
                                            {...register('lastName')}
                                            className={`w-full ${currentTheme.input} rounded-lg px-3 py-2`}
                                        />
                                        {errors.lastName && (
                                            <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>
                                        Email
                                    </label>
                                    <input
                                        {...register('email')}
                                        type="email"
                                        className={`w-full ${currentTheme.input} rounded-lg px-3 py-2`}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>
                                        Role
                                    </label>
                                    <select
                                        {...register('role')}
                                        className={`w-full ${currentTheme.input} rounded-lg px-3 py-2`}
                                    >
                                        <option value="user">User</option>
                                        <option value="moderator">Moderator</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    {errors.role && (
                                        <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>
                                        Status
                                    </label>
                                    <select
                                        {...register('status')}
                                        className={`w-full ${currentTheme.input} rounded-lg px-3 py-2`}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="banned">Banned</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddUser(false);
                                            setSelectedUser(null);
                                            reset();
                                        }}
                                        className={`px-4 py-2 rounded-lg ${currentTheme.buttonHover}`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                                    >
                                        {selectedUser ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}