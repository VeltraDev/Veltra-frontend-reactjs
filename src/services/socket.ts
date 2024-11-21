import { io, Socket } from "socket.io-client";
import { store } from "@/redux/store";
import { toast } from "react-hot-toast";
import { User } from "@/types/auth";
import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/contexts/ThemeContext";
import CallNotification from "@/components/Chat/CallNotification";

import {
  endCall,
  setCallAnswered,
  setIncomingCall,
} from "@/redux/callSlice";

import {
  updateMessagesAndConversations,
  removeUserFromConversation,
  addNewConversation,
  getConversations,
  updateOnlineUsers,
  setTypingUser,
  removeTypingUser,
  addMessage,
  updateConversation,
  removeConversation,
  updateGroupMembers,
  removeGroupMembers,
} from "@/redux/chatSlice";

class SocketService {
  public socket: Socket | null = null;
  private readonly url: string = "ws://localhost:8081";
  private typingTimeout: Record<string, NodeJS.Timeout> = {};
  private notificationRoot: ReturnType<typeof createRoot> | null = null;
  private notificationContainer: HTMLDivElement | null = null;
  public onIceCandidateCallback: ((candidate: RTCIceCandidate) => void) | null = null;

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

  public setupListeners(navigateCallback?: (path: string) => void): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to socket server");
      store.dispatch(getConversations());
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
      this.cleanupNotification();
    });

    this.socket.on("onlineUsers", (data: { users: User[] }) => {
      console.log("Received initial online users:", data.users);
      store.dispatch(updateOnlineUsers(data.users));
    });

    this.socket.on("userOnline", (data: { user: User }) => {
      console.log("User connected:", data.user);
      store.dispatch(updateOnlineUsers({ user: data.user, status: "online" }));
    });

    this.socket.on("userOffline", (data: { user: User }) => {
      console.log("User disconnected:", data.user);
      store.dispatch(updateOnlineUsers({ user: data.user, status: "offline" }));
    });

    this.socket.on("receiveMessage", (message) => {
      store.dispatch(addMessage(message));
      store.dispatch(getConversations());
    });

    this.socket.on("receiveForwardMessage", (data) => {
      const { conversationId, message } = data;
      console.log("Received forwarded message in conversation:", conversationId);
      store.dispatch(addMessage(message));
      store.dispatch(updateConversation(conversationId));
    });

    this.socket.on("messageForwarded", (data) => {
      const { conversationId, message } = data;
      console.log("Confirmation of forwarded message:", conversationId);
      toast.success("Message forwarded successfully.");
      store.dispatch(addMessage(message));
    });

    this.socket.on("usersAdded", ({ conversation, message, addedUsers }) => {
      store.dispatch(updateGroupMembers({ conversation, addedUsers }));
      toast.success(message);
    });

    this.socket.on("conversationAdminGroupUpdated", ({ conversation, message }) => {
      store.dispatch(updateConversation(conversation));
      toast.success(message);
    });

    this.socket.on("conversationGroupInfoUpdated", ({ conversation, message }) => {
      store.dispatch(updateConversation(conversation));
      toast.success(message);
    });

    this.socket.on("usersRemovedFromGroup", ({ conversation, message, removedUsers }) => {
      store.dispatch(removeGroupMembers({ conversation, removedUsers }));
      toast.info(message);
    });

    this.socket.on("conversationDeleted", ({ conversationId, message }) => {
      store.dispatch(removeConversation(conversationId));
      toast.info(message);
    });

    this.socket.on("userLeftConversation", ({ userId, conversationId, message }) => {
      store.dispatch(removeUserFromConversation({ conversationId, userId }));
      toast.info(message);
    });

    this.socket.on("conversationCreated", ({ conversation, message }) => {
      store.dispatch(addNewConversation(conversation));
      toast.success(message);
    });

    this.socket.on("typingInfo", ({ conversationId, user }) => {
      store.dispatch(setTypingUser({ conversationId, user }));
    });

    this.socket.on("stopTypingInfo", ({ conversationId, user }) => {
      store.dispatch(removeTypingUser({ conversationId, userId: user.id }));
    });

    this.socket.on("receive-call", (data) => {
      console.log("Received call:", data);
      const { from, conversationId, offer } = data;

      store.dispatch(setIncomingCall({ from, conversationId, offer }));

      this.showCallNotification(
        {
          from,
          conversationId,
          offer,
          message: `${from.firstName} ${from.lastName} is calling you...`,
        },
        navigateCallback || (() => {})
      );
    });

    this.socket.on("call-answered", (data) => {
      store.dispatch(setCallAnswered(data.answer));
    });

    this.socket.on("ice-candidate", (data) => {
      const { candidate } = data;
      console.log("ICE Candidate received:", candidate);

      if (candidate && this.onIceCandidateCallback) {
        this.onIceCandidateCallback(candidate);
      }
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

  public async sendMessage(payload: {
    conversationId: string;
    content: string;
    files?: Array<{ url: string; type: "image" | "document" }>;
  }): Promise<void> {
    if (!this.socket) return;

    try {
      this.socket.emit("sendMessage", payload, (response: any) => {
        if (response?.id) {
          console.log("Message sent successfully:", response);
        } else {
          console.error("Failed to send message:", response?.message || "Unknown error");
        }
      });

      this.sendStopTyping(payload.conversationId);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  public forwardMessage(payload: {
    originalMessageId: string;
    targetConversationId: string;
  }): void {
    if (!this.socket) return;

    try {
      this.socket.emit("forwardMessage", payload, (response: any) => {
        if (response?.success) {
          console.log("Message forwarded successfully:", response);
        } else {
          console.error("Failed to forward message:", response?.message || "Unknown error");
        }
      });
    } catch (error) {
      console.error("Error forwarding message:", error);
      throw error;
    }
  }

  public sendTyping(conversationId: string): void {
    if (!this.socket) return;

    if (this.typingTimeout[conversationId]) {
      clearTimeout(this.typingTimeout[conversationId]);
    }

    this.socket.emit("typing", { conversationId });

    this.typingTimeout[conversationId] = setTimeout(() => {
      this.sendStopTyping(conversationId);
    }, 3000);
  }

  public sendStopTyping(conversationId: string): void {
    if (!this.socket) return;

    if (this.typingTimeout[conversationId]) {
      clearTimeout(this.typingTimeout[conversationId]);
      delete this.typingTimeout[conversationId];
    }

    this.socket.emit("stopTyping", { conversationId });
  }

  private createNotificationContainer() {
    if (!this.notificationContainer) {
      this.notificationContainer = document.createElement("div");
      this.notificationContainer.style.position = "fixed";
      this.notificationContainer.style.top = "20px";
      this.notificationContainer.style.right = "20px";
      this.notificationContainer.style.zIndex = "9999";
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

  private showCallNotification(
    data: {
      from: User;
      conversationId: string;
      offer: RTCSessionDescriptionInit;
      message: string;
    },
    navigateCallback: (path: string) => void
  ) {
    console.log("Showing call notification:", data);

    this.createNotificationContainer();

    if (this.notificationRoot) {
      this.notificationRoot.render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(CallNotification, {
            caller: data.from,
            conversationId: data.conversationId,
            onAccept: () => {
              store.dispatch(
                setIncomingCall({
                  from: data.from,
                  conversationId: data.conversationId,
                  offer: data.offer,
                })
              );
              navigateCallback(`/call/${data.conversationId}`);
              this.cleanupNotification();
            },
            onReject: () => {
              if (this.socket) {
                this.socket.emit("call-rejected", {
                  conversationId: data.conversationId,
                  to: data.from.id,
                });
                store.dispatch(endCall());
                this.cleanupNotification();
              }
            },
          })
        )
      );

      setTimeout(() => {
        this.cleanupNotification();
      }, 30000);
    }
  }

  public callUser(
    conversationId: string,
    toUserId: string,
    offer: RTCSessionDescriptionInit
  ): void {
    if (!this.socket) return;

    console.log("Calling user with conversation:", { conversationId, toUserId, offer });

    this.socket.emit("call-user", {
      conversationId,
      offer,
      to: toUserId,
    });
  }

  public answerCall(
    conversationId: string,
    fromUserId: string,
    answer: RTCSessionDescriptionInit
  ): void {
    if (!this.socket) return;

    console.log("Answering call:", { conversationId, fromUserId, answer });

    this.socket.emit("answer-call", {
      conversationId,
      answer,
      to: fromUserId,
    });
  }

  public sendIceCandidate(
    conversationId: string,
    toUserId: string,
    candidate: RTCIceCandidate
  ): void {
    if (!this.socket) return;

    console.log("Sending ICE candidate:", { conversationId, toUserId, candidate });

    this.socket.emit("send-ice-candidate", {
      conversationId,
      candidate,
      to: toUserId,
    });
  }

  public endCall(conversationId: string, toUserId: string): void {
    if (!this.socket) return;

    console.log("Ending call for conversation:", conversationId);

    this.socket.emit("end-call", { conversationId, to: toUserId });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("Socket disconnected");
    }
    this.cleanupNotification();
  }
}

export const socketService = new SocketService();
