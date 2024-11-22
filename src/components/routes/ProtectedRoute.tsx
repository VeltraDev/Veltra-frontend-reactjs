
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>; // Hoặc component loading của bạn
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

export default ProtectedRoute;