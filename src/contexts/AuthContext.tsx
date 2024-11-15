import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getMe, login as loginAction, logout as logoutAction } from '../redux/authSlice';
import { LoginCredentials } from '../types/auth';

interface AuthContextType {
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    user: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, accessToken, user } = useSelector((state: RootState) => state.auth);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (accessToken) {
                try {
                    await dispatch(getMe()).unwrap();
                } catch (error) {
                    console.error('Failed to get user:', error);
                    // Clear invalid tokens and user data
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, [dispatch, accessToken]);

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            const result = await dispatch(loginAction(credentials)).unwrap();
            return result;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        dispatch(logoutAction());
    };

    return (
        <AuthContext.Provider
            value={{
                login,
                logout,
                isAuthenticated,
                isLoading,
                user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};