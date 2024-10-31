import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { SocketService } from '@/services/socketService';

interface SocketContextType {
    socket: Socket | null;
    socketService: SocketService | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [socketService, setSocketService] = useState<SocketService | null>(null);

    useEffect(() => {
        const initializeSocket = () => {
            const token = localStorage.getItem('accessToken');
            if (!token) return null;
            console.log(token)
            const newSocket = io("wss://veltra2.duckdns.org", {
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                },
            });

            const newSocketService = new SocketService(newSocket);

            setSocket(newSocket);
            setSocketService(newSocketService);

            return newSocket;
        };

        const newSocket = initializeSocket();
        if (newSocket) {
            setSocket(newSocket);
        }

        // // Cleanup function
        // return () => {
        //     if (socket) {
        //         console.log('Cleaning up socket connection');
        //         socket.close();
        //         setSocket(null);
        //     }
        // };
    }, []); 


    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'accessToken') {
                console.log('Access token changed, reinitializing socket');
               
                if (socket) {
                    socket.close();
                    setSocket(null);
                }

                const token = localStorage.getItem('accessToken');
                if (token) {
                    const newSocket = io('wss://veltra2.duckdns.org', {
                        auth: {
                            token: `Bearer ${token}`
                        },
                        autoConnect: true,
                        reconnection: true,
                        reconnectionAttempts: 5,
                        reconnectionDelay: 1000,
                        transports: ['websocket']
                    });
                    setSocket(newSocket);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [socket]);

    // Add token refresh handler
    useEffect(() => {
        const refreshInterval = setInterval(() => {
            const token = localStorage.getItem('accessToken');
            if (socket && token) {
                console.log('Updating socket auth token');
                socket.auth = { token: `Bearer ${token}` };
                socket.disconnect().connect(); //ket noi lai voi token moi
            }
        }, 55 * 60 * 1000); 

        return () => clearInterval(refreshInterval);
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket, socketService }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return { socket: context.socket, socketService: context.socketService };
};

export default SocketContext;
