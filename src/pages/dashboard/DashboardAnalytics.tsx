import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
    BarChart3, LineChart, PieChart, TrendingUp, TrendingDown,
    Users, MessageSquare, Clock, Calendar, Filter, Download,
    ChevronDown, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

// Mock data for analytics
const analyticsData = {
    monthlyUsers: [2890, 3200, 3450, 3800, 4200, 4500, 4800, 5100, 5400, 5800, 6200, 6500],
    messageVolume: [15000, 16800, 18200, 19500, 21000, 22800, 24500, 26200, 28000, 29800, 31500, 33200],
    userRetention: [92, 88, 90, 87, 91, 89, 93, 90, 92, 88, 91, 94],
    peakHours: [
        { hour: '00:00', value: 1200 },
        { hour: '03:00', value: 800 },
        { hour: '06:00', value: 1500 },
        { hour: '09:00', value: 3200 },
        { hour: '12:00', value: 4100 },
        { hour: '15:00', value: 3800 },
        { hour: '18:00', value: 4500 },
        { hour: '21:00', value: 2800 }
    ],
    userTypes: [
        { type: 'Active', percentage: 65 },
        { type: 'Inactive', percentage: 20 },
        { type: 'New', percentage: 15 }
    ]
};

export default function DashboardAnalytics() {
    const { currentTheme } = useTheme();
    const [timeRange, setTimeRange] = useState('Last 30 Days');
    const [selectedMetric, setSelectedMetric] = useState('Users');

    const metrics = [
        {
            title: 'Total Users',
            value: '65,428',
            change: '+12.5%',
            trend: 'up',
            icon: Users
        },
        {
            title: 'Messages Sent',
            value: '847,235',
            change: '+18.2%',
            trend: 'up',
            icon: MessageSquare
        },
        {
            title: 'Avg. Response Time',
            value: '1.8m',
            change: '-5.1%',
            trend: 'down',
            icon: Clock
        },
        {
            title: 'User Retention',
            value: '94.2%',
            change: '+2.3%',
            trend: 'up',
            icon: TrendingUp
        }
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className={`text-2xl font-bold ${currentTheme.headerText}`}>Analytics</h1>

                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                    {/* Time Range Selector */}
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

                    {/* Export Button */}
                    <button
                        className={`
              flex items-center space-x-2 px-4 py-2 rounded-xl
              bg-blue-500 text-white hover:bg-blue-600 transition-colors
            `}
                    >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
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
                                <metric.icon className={`w-6 h-6 ${currentTheme.iconColor}`} />
                            </div>
                            <span className={`
                flex items-center space-x-1 text-sm
                ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}
              `}>
                                {metric.trend === 'up' ? (
                                    <ArrowUpRight className="w-4 h-4" />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4" />
                                )}
                                <span>{metric.change}</span>
                            </span>
                        </div>
                        <h3 className={`text-2xl font-bold ${currentTheme.headerText} mb-1`}>
                            {metric.value}
                        </h3>
                        <p className={currentTheme.mutedText}>{metric.title}</p>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div className={`${currentTheme.bg} rounded-xl p-6 border ${currentTheme.border}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-lg font-semibold ${currentTheme.headerText}`}>
                            User Growth
                        </h3>
                        <div className="flex items-center space-x-2">
                            <button
                                className={`px-3 py-1 rounded-lg ${currentTheme.buttonHover} text-sm`}
                                onClick={() => setSelectedMetric('Users')}
                            >
                                Daily
                            </button>
                            <button
                                className={`px-3 py-1 rounded-lg ${currentTheme.buttonHover} text-sm`}
                                onClick={() => setSelectedMetric('Weekly')}
                            >
                                Weekly
                            </button>
                            <button
                                className={`px-3 py-1 rounded-lg ${currentTheme.buttonHover} text-sm`}
                                onClick={() => setSelectedMetric('Monthly')}
                            >
                                Monthly
                            </button>
                        </div>
                    </div>
                    <div className="h-80">
                        <LineChart className="w-full h-full" />
                    </div>
                </div>

                {/* Message Volume */}
                <div className={`${currentTheme.bg} rounded-xl p-6 border ${currentTheme.border}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-lg font-semibold ${currentTheme.headerText}`}>
                            Message Volume
                        </h3>
                        <button className={`p-2 rounded-lg ${currentTheme.buttonHover}`}>
                            <Filter className="w-4 h-4" />
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
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="h-80">
                        <PieChart className="w-full h-full" />
                    </div>
                </div>

                {/* Peak Hours */}
                <div className={`${currentTheme.bg} rounded-xl p-6 border ${currentTheme.border}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-lg font-semibold ${currentTheme.headerText}`}>
                            Peak Activity Hours
                        </h3>
                        <button className={`p-2 rounded-lg ${currentTheme.buttonHover}`}>
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="h-80">
                        <BarChart3 className="w-full h-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}