// src/components/RoleProtectedRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NotAuthorized from '@/pages/NotAuthorized';

interface RoleProtectedRouteProps {
    children: React.ReactElement;
    roles: string[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, roles }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    console.log(user);
    console.log(roles);
    if (isLoading) {
        return <div>Loading...</div>; // Hoặc component loading của bạn
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    if (!user || !user.user || !user.user.role || !roles.includes(user.user.role.name)) {
        return <NotAuthorized />;
    }

    return children;
};

export default RoleProtectedRoute;