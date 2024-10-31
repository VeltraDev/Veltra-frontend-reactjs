import { Socket } from 'socket.io-client';

interface SocketConfig {
    token: string;
}

export class SocketService {
    
    constructor(private socket: Socket, config: SocketConfig) {
    }

    // Connection methods
    onConnect(callback: () => void) {
        this.socket.on('connect', callback);
        return () => this.socket.off('connect', callback);
    }

    offConnect(callback: () => void) {
        this.socket.off('connect', callback);
    }

    onDisconnect(callback: () => void) {
        this.socket.on('disconnect', callback);
        return () => this.socket.off('disconnect', callback);
    }

    offDisconnect(callback: () => void) {
        this.socket.off('disconnect', callback);
    }

    isConnected(): boolean {
        return this.socket.connected;
    }
    onTypingInfo(callback: (conversationId: string, user: { id: string; firstName: string; lastName: string }) => void) {
    this.socket.on('typingInfo', (data: { conversationId: string; user: { id: string; firstName: string; lastName: string } }) => {
        callback(data.conversationId, data.user);
    });
    return () => this.socket.off('typingInfo');
    }

    
    sendMessage(data: { conversationId: string; content: string }) {
        return new Promise((resolve, reject) => {
            this.socket.emit('sendMessage', {
                ...data,
                token: this.token
            }, (response: any) => {
                if (response?.error) {
                    reject(response.error);
                } else {
                    resolve(response);
                }
            });
        });
    }

    // Typing indicators
    emitTyping(conversationId: string) {
    this.socket.emit('typing', {
        conversationId,
        token: this.token 
    });
    }


    emitStopTyping(conversationId: string) {
        this.socket.emit('stopTyping', {
            conversationId,
            token: this.token
        });
    }

    // Listeners
    onReceiveMessage(callback: (message: any) => void) {
        this.socket.on('receiveMessage', callback);
        return () => this.socket.off('receiveMessage', callback);
    }

    onTyping(callback: (conversationId: string) => void) {
        this.socket.on('typing', callback);
        return () => this.socket.off('typing', callback);
    }

    onStopTyping(callback: (conversationId: string) => void) {
        this.socket.on('stopTyping', callback);
        return () => this.socket.off('stopTyping', callback);
    }
    onStopTypingInfo(callback: (conversationId: string, user: { id: string; firstName: string; lastName: string }) => void) {
        this.socket.on('stopTypingInfo', (data: { conversationId: string; user: { id: string; firstName: string; lastName: string } }) => {
            callback(data.conversationId, data.user);
        });
        return () => this.socket.off('stopTypingInfo');
    }
    // Method to update token if needed
    updateToken(newToken: string) {
        this.token = newToken;
    }
}
