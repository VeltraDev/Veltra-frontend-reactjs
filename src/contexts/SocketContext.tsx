// SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { socketService } from "../services/socket";
import { RootState } from "../redux/store";

interface SocketContextType {
    socketService: typeof socketService;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const isAuthenticated = useSelector(
        (state: RootState) => state.auth.isAuthenticated
    );
    const [socketInitialized, setSocketInitialized] = useState(false);

    useEffect(() => {
        if (isAuthenticated && !socketInitialized) {
            socketService.connect();
            setSocketInitialized(true);
        }

        return () => {
            if (socketInitialized) {
                console.log("Cleaning up socket connection");
                socketService.disconnect();
                setSocketInitialized(false);
            }
        };
    }, [isAuthenticated, socketInitialized]);

    return (
        <SocketContext.Provider value={{ socketService }}>
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
