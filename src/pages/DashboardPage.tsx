import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  BarChart3, LineChart, PieChart, Activity, Users, MessageSquare,
  TrendingUp, TrendingDown, DollarSign, Clock, Calendar, Filter,
  ChevronDown, ArrowUpRight, ArrowDownRight, Layers
} from 'lucide-react';

// Mock data for charts
const mockData = {
  userGrowth: [120, 132, 145, 162, 178, 194, 213, 229, 245, 261, 275, 290],
  messageStats: [1850, 1920, 1880, 2100, 2150, 2300, 2400, 2350, 2500, 2450, 2600, 2700],
  engagementRate: [45, 42, 47, 51, 48, 53, 56, 54, 59, 57, 62, 65],
  userTypes: [
    { label: 'Active', value: 65 },
    { label: 'Inactive', value: 25 },
    { label: 'New', value: 10 }
  ],
  revenueData: [
    { month: 'Jan', value: 12000 },
    { month: 'Feb', value: 15000 },
    { month: 'Mar', value: 18000 },
    { month: 'Apr', value: 16000 },
    { month: 'May', value: 21000 },
    { month: 'Jun', value: 24000 }
  ],
  topLocations: [
    { country: '🇺🇸 United States', users: '32.5%' },
    { country: '🇬🇧 United Kingdom', users: '15.2%' },
    { country: '🇩🇪 Germany', users: '12.8%' },
    { country: '🇯🇵 Japan', users: '10.5%' },
    { country: '🇨🇦 Canada', users: '8.3%' }
  ]
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const [timeRange, setTimeRange] = useState('This Month');

  const stats = [
    {
      title: 'Total Users',
      value: '32,890',
      change: '+12.5%',
      trend: 'up',
      icon: Users
    },
    {
      title: 'Active Users',
      value: '21,459',
      change: '+8.2%',
      trend: 'up',
      icon: Activity
    },
    {
      title: 'Messages Sent',
      value: '847,235',
      change: '-3.1%',
      trend: 'down',
      icon: MessageSquare
    },
    {
      title: 'Engagement Rate',
      value: '64.8%',
      change: '+5.3%',
      trend: 'up',
      icon: LineChart
    }
  ];

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${currentTheme.headerText} mb-2`}>
              Dashboard Overview
            </h1>
            <p className={currentTheme.mutedText}>
              Welcome back, {user?.firstName}! Here's what's happening.
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-xl
                ${currentTheme.buttonHover} transition-colors
              `}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="relative">
              <button
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-xl
                  ${currentTheme.buttonHover} transition-colors
                `}
              >
                <Calendar className="w-4 h-4" />
                <span>{timeRange}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`
                ${currentTheme.bg} rounded-xl p-6 border ${currentTheme.border}
                hover:shadow-lg transition-all duration-300
                transform hover:-translate-y-1
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${currentTheme.input}`}>
                  <stat.icon className={`w-6 h-6 ${currentTheme.iconColor}`} />
                </div>
                <span className={`
                  flex items-center space-x-1 text-sm
                  ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}
                `}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </span>
              </div>
              <h3 className={`text-2xl font-bold ${currentTheme.headerText} mb-1`}>
                {stat.value}
              </h3>
              <p className={currentTheme.mutedText}>{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className={`${currentTheme.bg} rounded-xl p-6 border ${currentTheme.border}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${currentTheme.headerText}`}>
                User Growth
              </h3>
              <button className={`p-2 rounded-lg ${currentTheme.buttonHover}`}>
                <MoreOptions />
              </button>
            </div>
            <div className="h-80">
              <LineChart className="w-full h-full" />
            </div>
          </div>

          {/* Message Statistics */}
          <div className={`${currentTheme.bg} rounded-xl p-6 border ${currentTheme.border}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${currentTheme.headerText}`}>
                Message Statistics
              </h3>
              <button className={`p-2 rounded-lg ${currentTheme.buttonHover}`}>
                <MoreOptions />
              </button>
            </div>
            <div className="h-80">
              <BarChart3 className="w-full h-full" />
            </div>
          </div>

          {/* User Distribution */}
          <div className={`${currentTheme.bg} rounded-xl p-6 border ${currentTheme.border}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${currentTheme.headerText}`}>
                User Distribution
              </h3>
              <button className={`p-2 rounded-lg ${currentTheme.buttonHover}`}>
                <MoreOptions />
              </button>
            </div>
            <div className="h-80">
              <PieChart className="w-full h-full" />
            </div>
          </div>

          {/* Top Locations */}
          <div className={`${currentTheme.bg} rounded-xl p-6 border ${currentTheme.border}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${currentTheme.headerText}`}>
                Top Locations
              </h3>
              <button className={`p-2 rounded-lg ${currentTheme.buttonHover}`}>
                <MoreOptions />
              </button>
            </div>
            <div className="space-y-4">
              {mockData.topLocations.map((location, index) => (
                <div
                  key={index}
                  className={`
                    flex items-center justify-between p-4 rounded-xl
                    ${currentTheme.input} transition-colors
                  `}
                >
                  <span className={`text-lg ${currentTheme.text}`}>
                    {location.country}
                  </span>
                  <span className={`font-semibold ${currentTheme.text}`}>
                    {location.users}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`${currentTheme.bg} rounded-xl p-6 border ${currentTheme.border}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${currentTheme.headerText}`}>
              Recent Activity
            </h3>
            <button
              className={`
                px-4 py-2 rounded-lg bg-blue-500 text-white
                hover:bg-blue-600 transition-colors
              `}
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${currentTheme.border}`}>
                  <th className={`py-3 text-left ${currentTheme.mutedText}`}>User</th>
                  <th className={`py-3 text-left ${currentTheme.mutedText}`}>Action</th>
                  <th className={`py-3 text-left ${currentTheme.mutedText}`}>Status</th>
                  <th className={`py-3 text-left ${currentTheme.mutedText}`}>Time</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr
                    key={index}
                    className={`border-b ${currentTheme.border} hover:bg-gray-50 dark:hover:bg-gray-800`}
                  >
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={`https://i.pravatar.cc/32?img=${index}`}
                          alt="User avatar"
                          className="w-8 h-8 rounded-full"
                        />
                        <span className={currentTheme.text}>John Doe</span>
                      </div>
                    </td>
                    <td className={`py-3 ${currentTheme.text}`}>
                      Created a new post
                    </td>
                    <td className="py-3">
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Completed
                      </span>
                    </td>
                    <td className={`py-3 ${currentTheme.mutedText}`}>
                      2 minutes ago
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MoreOptions() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
      />
    </svg>
  );
}