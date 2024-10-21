import { createContext } from "react";


interface SocketContextType {
    socket: WebSocket | null; 
}


const defaultValue: SocketContextType = {
    socket: null, 
};

const SocketContext = createContext<SocketContextType>(defaultValue);

export default SocketContext;
