import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/routes/PrivateRoute';
import AdminRoute from './components/routes/AdminRoute';
import SignInPage from './pages/SignInPage';
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';

import NotFoundPage from './pages/NotFoundPage';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './layouts/DashBoardLayout';
import DashboardAnalytics from './pages/dashboard/DashboardAnalytics';
import DashboardUsers from './pages/dashboard/DashboardUsers';
import DashboardMessages from './pages/dashboard/DashboardMessages';
import DashboardSettings from './pages/dashboard/DashboardSettings';
import NewsFeedPage from './pages/NewsFeedPage';
import VideoCallPage from './pages/VideoCallPage';


function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignInPage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<ChatPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/newsfeed" element={<NewsFeedPage />} />
            <Route path="/call/:conversationId" element={<VideoCallPage />} />
          </Route>

          {/* Admin Routes */}
          {/* <Route element={<AdminRoute />}> */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/analytics" element={<DashboardAnalytics />} />
              <Route path="/dashboard/users" element={<DashboardUsers />} />
              <Route path="/dashboard/messages" element={<DashboardMessages />} />
              <Route path="/dashboard/settings" element={<DashboardSettings />} />
            </Route>
          {/* </Route> */}

          {/* Redirect root to chat for authenticated users */}
          <Route path="/" element={<Navigate to="/chat" replace />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;