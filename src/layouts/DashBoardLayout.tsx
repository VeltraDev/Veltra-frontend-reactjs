import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard,
    BarChart2,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    Bell,
    Search
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function DashboardLayout() {
    const { currentTheme } = useTheme();
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [notifications] = React.useState([
        { id: 1, title: 'New user registered', time: '2 minutes ago' },
        { id: 2, title: 'Server update completed', time: '1 hour ago' },
        { id: 3, title: 'Database backup', time: '3 hours ago' }
    ]);

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
        { path: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
        { path: '/dashboard/users', icon: Users, label: 'Users' },
        { path: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
        { path: '/dashboard/settings', icon: Settings, label: 'Settings' }
    ];

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${currentTheme.bg} border-r ${currentTheme.border}
        `}
            >
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h1 className={`text-xl font-bold ${currentTheme.headerText}`}>
                            Admin Dashboard
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-xl
                  transition-colors duration-200
                  ${isActive
                                        ? 'bg-blue-500 text-white'
                                        : `${currentTheme.buttonHover} ${currentTheme.text}`
                                    }
                `}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className={`p-4 border-t ${currentTheme.border}`}>
                        <div className="flex items-center space-x-3 p-2">
                            <img
                                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}`}
                                alt={user?.firstName}
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${currentTheme.text} truncate`}>
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className={`text-xs ${currentTheme.mutedText} truncate`}>
                                    {user?.email}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className={`p-2 rounded-lg ${currentTheme.buttonHover}`}
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className={`h-16 ${currentTheme.bg} border-b ${currentTheme.border} flex items-center justify-between px-4`}>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`p-2 rounded-lg ${currentTheme.buttonHover} lg:hidden`}
                        >
                            <Menu className={`w-5 h-5 ${currentTheme.iconColor}`} />
                        </button>

                        <div className="relative hidden md:block">
                            <Search className={`w-5 h-5 ${currentTheme.iconColor} absolute left-3 top-1/2 -translate-y-1/2`} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className={`
                  pl-10 pr-4 py-2 rounded-lg
                  ${currentTheme.input} ${currentTheme.text}
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50
                `}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <div className="relative group">
                            <button className={`p-2 rounded-lg ${currentTheme.buttonHover} relative`}>
                                <Bell className={`w-5 h-5 ${currentTheme.iconColor}`} />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                            </button>

                            {/* Notifications Dropdown */}
                            <div className={`
                absolute right-0 top-full mt-2 w-80
                ${currentTheme.bg} rounded-xl shadow-lg border ${currentTheme.border}
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transform transition-all duration-300 ease-in-out
                z-50
              `}>
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className={`font-semibold ${currentTheme.headerText}`}>Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b last:border-b-0 ${currentTheme.border} hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
                                        >
                                            <p className={`${currentTheme.text} font-medium`}>{notification.title}</p>
                                            <p className={`text-sm ${currentTheme.mutedText}`}>{notification.time}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                    <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}