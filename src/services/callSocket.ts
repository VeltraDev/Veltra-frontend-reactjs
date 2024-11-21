import { io, Socket } from "socket.io-client";

import { addIceCandidate, endCall, setCallAnswered, setIncomingCall } from "@/redux/callSlice";
import { toast } from "react-hot-toast";
import React from "react";
import { createRoot } from 'react-dom/client';

import { User } from "@/types/auth";
import { store } from "@/redux/store";
import { ThemeProvider } from "@/contexts/ThemeContext";
import CallNotification from "@/components/chat/CallNotification";

class CallSocketService {
  public socket: Socket | null = null;
  private readonly url: string = "wss://veltra2.duckdns.org";
  private notificationRoot: ReturnType<typeof createRoot> | null = null;
  private notificationContainer: HTMLDivElement | null = null;

  private createNotificationContainer() {
    if (!this.notificationContainer) {
      this.notificationContainer = document.createElement('div');
      this.notificationContainer.style.position = 'fixed';
      this.notificationContainer.style.top = '20px';
      this.notificationContainer.style.right = '20px';
      this.notificationContainer.style.zIndex = '9999';
      document.body.appendChild(this.notificationContainer);
      this.notificationRoot = createRoot(this.notificationContainer);
    }
  }

  private cleanupNotification() {
    if (this.notificationRoot) {
      this.notificationRoot.unmount();
      this.notificationRoot = null;
    }
    if (this.notificationContainer) {
      document.body.removeChild(this.notificationContainer);
      this.notificationContainer = null;
    }
  }

  public connect(): void {
    if (this.socket?.connected) return;

    const token = store.getState().auth.accessToken;
    if (!token) {
      console.warn("No access token found. Cannot connect to socket.");
      return;
    }

    this.socket = io(this.url, {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupListeners();
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on("disconnect", () => {
      this.cleanupNotification();
    });

    this.socket.on("receive-call", (data) => {
      console.log("Received call:", data);
      const { from, conversationId, offer } = data;

      store.dispatch(setIncomingCall({ from, conversationId, offer }));

      this.showCallNotification({
        from,
        conversationId,
        offer,
        message: `${from.firstName} ${from.lastName} is calling you...`
      });
    });

    this.socket.on("call-answered", (data) => {
      store.dispatch(setCallAnswered(data.answer));
    });

    this.socket.on("ice-candidate", (data) => {
      store.dispatch(addIceCandidate(data.candidate));
    });

    this.socket.on("call-ended", () => {
      store.dispatch(endCall());
      this.cleanupNotification();
      toast.info("Call ended");
    });

    this.socket.on("call-rejected", () => {
      store.dispatch(endCall());
      this.cleanupNotification();
      toast.error("Call rejected");
    });
  }

  private showCallNotification(data: { 
    from: User; 
    conversationId: string; 
    offer: RTCSessionDescriptionInit;
    message: string;
  }) {
    console.log("Showing call notification:", data);
    
    this.createNotificationContainer();

    if (this.notificationRoot) {
      this.notificationRoot.render(
        React.createElement(ThemeProvider, null,
          React.createElement(CallNotification, {
            caller: data.from,
            conversationId: data.conversationId,
            onAccept: () => {
              store.dispatch(setIncomingCall({
                from: data.from,
                conversationId: data.conversationId,
                offer: data.offer
              }));
              window.location.href = `/call/${data.conversationId}`;
              this.cleanupNotification();
            },
            onReject: () => {
              if (this.socket) {
                this.socket.emit('call-rejected', { 
                  conversationId: data.conversationId, 
                  to: data.from.id 
                });
                store.dispatch(endCall());
                this.cleanupNotification();
              }
            }
          })
        )
      );

      setTimeout(() => {
        this.cleanupNotification();
      }, 30000);
    }
  }

  public callUser(conversationId: string, toUserId: string, offer: RTCSessionDescriptionInit): void {
    if (!this.socket) return;

    console.log("Calling user with conversation:", { conversationId, toUserId, offer });
    
    this.socket.emit('call-user', {
      conversationId,
      to: toUserId,
      offer
    });
  }

  public answerCall(conversationId: string, fromUserId: string, answer: RTCSessionDescriptionInit): void {
    if (!this.socket) return;

    console.log("Answering call:", { conversationId, fromUserId, answer });
    
    this.socket.emit('answer-call', {
      conversationId,
      to: fromUserId,
      answer
    });
  }

  public sendIceCandidate(conversationId: string, toUserId: string, candidate: RTCIceCandidate): void {
    if (!this.socket) return;

    console.log("Sending ICE candidate:", { conversationId, toUserId, candidate });
    
    this.socket.emit('send-ice-candidate', {
      conversationId,
      to: toUserId,
      candidate
    });
  }

  public endCall(conversationId: string, toUserId: string): void {
    if (!this.socket) return;

    console.log("Ending call for conversation:", conversationId);
    
    this.socket.emit('end-call', { conversationId, to: toUserId });
  }

  public disconnect(): void {
    this.cleanupNotification();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const callSocketService = new CallSocketService();