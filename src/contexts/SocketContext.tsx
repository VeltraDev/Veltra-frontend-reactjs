import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { chatSocketService, callSocketService } from '@/services/socket';

import { RootState } from "../redux/store";
import { toast } from "react-hot-toast";

interface SocketContextType {
    chatSocketService: typeof chatSocketService;
    callSocketService: typeof callSocketService;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const isAuthenticated = useSelector(
        (state: RootState) => state.auth.isAuthenticated
    );
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (isAuthenticated && accessToken) {
            try {
                chatSocketService.connect();
                setIsConnected(true);
            } catch (error) {
                console.error("Failed to connect to socket:", error);
                toast.error("Failed to connect to chat server");
                setIsConnected(false);
            }
        } else {
            chatSocketService.disconnect();
            setIsConnected(false);
        }

        return () => {
            chatSocketService.disconnect();
            setIsConnected(false);
        };
    }, [isAuthenticated, accessToken]);

    return (
        <SocketContext.Provider value={{ chatSocketService, callSocketService, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};