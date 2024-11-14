import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
    User, Lock, Bell, Globe, Palette, Shield,
    CreditCard, HelpCircle, LogOut, ChevronRight,
    Moon, Sun, Smartphone
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';

const profileSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    bio: z.string().max(160, 'Bio must be less than 160 characters'),
    notifications: z.object({
        email: z.boolean(),
        push: z.boolean(),
        marketing: z.boolean()
    })
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function DashboardSettings() {
    const { currentTheme, theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = React.useState('profile');

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            bio: 'Web3 enthusiast and blockchain developer',
            notifications: {
                email: true,
                push: true,
                marketing: false
            }
        }
    });

    const onSubmit = (data: ProfileFormData) => {
        toast.success('Settings updated successfully');
    };

    const settingsSections = [
        {
            id: 'profile',
            icon: User,
            title: 'Profile',
            description: 'Manage your personal information'
        },
        {
            id: 'security',
            icon: Lock,
            title: 'Security',
            description: 'Protect your account'
        },
        {
            id: 'notifications',
            icon: Bell,
            title: 'Notifications',
            description: 'Choose what you want to be notified about'
        },
        {
            id: 'appearance',
            icon: Palette,
            title: 'Appearance',
            description: 'Customize the look and feel'
        },
        {
            id: 'privacy',
            icon: Shield,
            title: 'Privacy',
            description: 'Control your privacy settings'
        },
        {
            id: 'billing',
            icon: CreditCard,
            title: 'Billing',
            description: 'Manage your billing information'
        }
    ];

    return (
        <div className="flex min-h-[calc(100vh-4rem)]">
            {/* Settings Navigation */}
            <div className={`w-80 border-r ${currentTheme.border} p-6`}>
                <h2 className={`text-xl font-bold ${currentTheme.headerText} mb-6`}>Settings</h2>
                <nav className="space-y-2">
                    {settingsSections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveTab(section.id)}
                            className={`
                w-full p-3 rounded-xl flex items-center space-x-3
                transition-colors duration-200
                ${activeTab === section.id
                                    ? 'bg-blue-500 text-white'
                                    : `${currentTheme.buttonHover} ${currentTheme.text}`
                                }
              `}
                        >
                            <section.icon className="w-5 h-5" />
                            <div className="flex-1 text-left">
                                <p className="font-medium">{section.title}</p>
                                <p className={`text-sm ${activeTab === section.id ? 'text-blue-100' : currentTheme.mutedText
                                    }`}>
                                    {section.description}
                                </p>
                            </div>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    ))}
                </nav>
            </div>

            {/* Settings Content */}
            <div className="flex-1 p-6">
                {activeTab === 'profile' && (
                    <div className="max-w-2xl">
                        <h2 className={`text-2xl font-bold ${currentTheme.headerText} mb-6`}>Profile Settings</h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Avatar */}
                            <div className="flex items-center space-x-4">
                                <img
                                    src="https://i.pravatar.cc/150?img=1"
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full"
                                />
                                <button
                                    type="button"
                                    className={`px-4 py-2 rounded-xl ${currentTheme.buttonHover}`}
                                >
                                    Change Avatar
                                </button>
                            </div>

                            {/* Name Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>
                                        First Name
                                    </label>
                                    <input
                                        {...register('firstName')}
                                        className={`
                      w-full px-4 py-2 rounded-xl
                      ${currentTheme.input} ${currentTheme.text}
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    `}
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
                                        className={`
                      w-full px-4 py-2 rounded-xl
                      ${currentTheme.input} ${currentTheme.text}
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    `}
                                    />
                                    {errors.lastName && (
                                        <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>
                                    Email
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    className={`
                    w-full px-4 py-2 rounded-xl
                    ${currentTheme.input} ${currentTheme.text}
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  `}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Bio */}
                            <div>
                                <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>
                                    Bio
                                </label>
                                <textarea
                                    {...register('bio')}
                                    rows={4}
                                    className={`
                    w-full px-4 py-2 rounded-xl
                    ${currentTheme.input} ${currentTheme.text}
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  `}
                                />
                                {errors.bio && (
                                    <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
                                )}
                            </div>

                            {/* Notification Preferences */}
                            <div>
                                <h3 className={`text-lg font-semibold ${currentTheme.headerText} mb-4`}>
                                    Notification Preferences
                                </h3>
                                <div className="space-y-3">
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            {...register('notifications.email')}
                                            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                        />
                                        <span className={currentTheme.text}>Email Notifications</span>
                                    </label>
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            {...register('notifications.push')}
                                            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                        />
                                        <span className={currentTheme.text}>Push Notifications</span>
                                    </label>
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            {...register('notifications.marketing')}
                                            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                        />
                                        <span className={currentTheme.text}>Marketing Emails</span>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'appearance' && (
                    <div className="max-w-2xl">
                        <h2 className={`text-2xl font-bold ${currentTheme.headerText} mb-6`}>
                            Appearance Settings
                        </h2>

                        <div className="space-y-6">
                            {/* Theme Selector */}
                            <div>
                                <h3 className={`text-lg font-semibold ${currentTheme.headerText} mb-4`}>
                                    Theme
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setTheme('light')}
                                        className={`
                      p-4 rounded-xl border ${currentTheme.border}
                      ${theme === 'light' ? 'ring-2 ring-blue-500' : ''}
                      flex items-center space-x-3
                    `}
                                    >
                                        <Sun className="w-5 h-5" />
                                        <span>Light</span>
                                    </button>
                                    <button
                                        onClick={() => setTheme('dark')}
                                        className={`
                      p-4 rounded-xl border ${currentTheme.border}
                      ${theme === 'dark' ? 'ring-2 ring-blue-500' : ''}
                      flex items-center space-x-3
                    `}
                                    >
                                        <Moon className="w-5 h-5" />
                                        <span>Dark</span>
                                    </button>
                                </div>
                            </div>

                            {/* Layout Options */}
                            <div>
                                <h3 className={`text-lg font-semibold ${currentTheme.headerText} mb-4`}>
                                    Layout
                                </h3>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center space-x-3">
                                            <Smartphone className="w-5 h-5" />
                                            <span>Compact Mode</span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}