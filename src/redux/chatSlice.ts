import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { http } from "../api/http";
import { messageService } from "../services/api/messageService";
import {
  conversationService,
  CreateConversationDto,
} from "../services/api/conversationService";
import { socketService } from "@/services/socket";

// Types


export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  displayStatus: string | null;
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  files: any[];
  sender: User;
  createdAt: string;
  updatedAt: string;
  conversationId: string;
  isRecalled?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  picture: string | null;
  isGroup: boolean;
  users: User[];
  admin: User | null;
  latestMessage: Message | null;
  createdAt: string;
  updatedAt: string;
}
interface CallState {
  incomingCall: {
    from: User;
    offer: RTCSessionDescriptionInit;
    conversationId: string;
  } | null;
  isCallActive: boolean;
  callAnswered: RTCSessionDescriptionInit | null;
  iceCandidates: RTCIceCandidate[];
  connectionRef: RTCPeerConnection | null; 
}


// Update the ChatState interface
interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  typingUsers: Record<string, User[]>;
  onlineUsers: User[];
  call: CallState;
}


const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoading: false,
  error: null,
  typingUsers: {},
  onlineUsers: [],
  call: {
    incomingCall: null,
    isCallActive: false,
    callAnswered: null,
    iceCandidates: [],
    connectionRef: null, // Initialize connection reference
  },
};



// Helper function to sort conversations by latest message
const sortConversations = (conversations: Conversation[]) => {
  return [...conversations].sort((a, b) => {
    const timeA = a.latestMessage?.createdAt || a.createdAt;
    const timeB = b.latestMessage?.createdAt || b.createdAt;
    return new Date(timeB).getTime() - new Date(timeA).getTime();
  });
};

export const createConversation = createAsyncThunk(
  "chat/createConversation",
  async (data: CreateConversationDto, { dispatch }) => {
    try {
      const response = await conversationService.create(data);
      const newConversation = response.data;

      // Immediately fetch updated conversations list
      dispatch(getConversations());

      return newConversation;
    } catch (error) {
      throw error;
    }
  }
);

// Update the getConversations thunk to remove pagination
export const getConversations = createAsyncThunk(
  "chat/getConversations",
  async () => {
    const response = await conversationService.getAll();
    return response.results;
  }
);
export const updateGroupInfo = createAsyncThunk(
  "chat/updateGroupInfo",
  async ({
    id,
    data,
  }: {
    id: string;
    data: { name?: string; picture?: string };
  }) => {
    const response = await conversationService.updateGroupInfo(id, data);
    return response.data;
  }
);

export const updateGroupAdmin = createAsyncThunk(
  "chat/updateGroupAdmin",
  async ({ id, adminId }: { id: string; adminId: string }) => {
    const response = await conversationService.updateGroupAdmin(id, {
      adminId,
    });
    return response.data;
  }
);

export const getConversationMessages = createAsyncThunk(
  "chat/getConversationMessages",
  async (conversationId: string) => {
    const response = await messageService.getById(conversationId);
    return response.messages;
  }
);
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({
    conversationId,
    content,
    files,
  }: {
    conversationId: string;
    content: string;
    files?: Array<{ url: string; type: "image" | "document" }>;
  }) => {
    const response = await messageService.create({
      conversationId,
      content,
      files,
    });
    return response.data;
  }
);

export const forwardMessage = createAsyncThunk(
  "chat/forwardMessage",
  async ({
    messageId,
    conversationId,
  }: {
    messageId: string;
    conversationId: string;
  }) => {
    const response = await messageService.forward({
      messageId,
      conversationId,
    });
    return response.data;
  }
);

// export const initiateCall = createAsyncThunk(
//   "chat/initiateCall",
//   async (
//     {
//       userId,
//       conversationId,
//       offer
//     }: { userId: string; conversationId: string; offer: RTCSessionDescriptionInit },
//     { dispatch }
//   ) => {
//     // Giả định bạn có hàm service để gửi offer
//     await socketService.answerCall(userId, offer, conversationId);
//     dispatch(
//       setIncomingCall({ from: { id: userId }, offer, conversationId })
//     );
//   }
// );





export const recallMessage = createAsyncThunk(
  "chat/recallMessage",
  async (messageId: string) => {
    const response = await messageService.recall(messageId);
    return { messageId, data: response.data };
  }
);

export const deleteMessage = createAsyncThunk(
  "chat/deleteMessage",
  async (messageId: string) => {
    await messageService.delete(messageId);
    return messageId;
  }
);

export const leaveConversation = createAsyncThunk(
  "chat/leaveConversation",
  async (conversationId: string) => {
    await conversationService.leaveGroup(conversationId);
    return conversationId;
  }
);

// Add new async thunks
export const addUsersToGroup = createAsyncThunk(
  "chat/addUsersToGroup",
  async ({ id, userIds }: { id: string; userIds: string[] }) => {
    const response = await conversationService.addUsers(id, { userIds });
    return response.data;
  }
);

export const removeUsersFromGroup = createAsyncThunk(
  "chat/removeUsersFromGroup",
  async ({ id, userIds }: { id: string; userIds: string[] }) => {
    const response = await conversationService.removeUsers(id, { userIds });
    return response.data;
  }
);



const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
setConnectionRef: (state, action: PayloadAction<RTCPeerConnection>) => {
    if (state.call.connectionRef) {
        state.call.connectionRef.close(); // Đóng kết nối cũ trước khi thiết lập kết nối mới
    }
    state.call.connectionRef = action.payload;
},
clearConnectionRef: (state) => {
    if (state.call.connectionRef) {
        state.call.connectionRef.close(); // Đóng kết nối
        state.call.connectionRef = null;
    }
},
updateConnectionState: (state, action: PayloadAction<string>) => {
    if (state.call.connectionRef) {
        console.log(`Connection state updated to: ${action.payload}`);
    }
},

  setIncomingCall: (
  state,
  action: PayloadAction<{
    from: User;
    offer: RTCSessionDescriptionInit;
    conversationId: string;
  }>
) => {
  state.call.incomingCall = action.payload;
  state.call.isCallActive = true;
},

 setCallAnswered: (state, action: PayloadAction<RTCSessionDescriptionInit>) => {
  state.call.callAnswered = action.payload;
  state.call.isCallActive = true;
  if (state.call.incomingCall) {
    // Set conversationId cho activeConversation nếu đang có cuộc gọi
    const conversationId = state.call.incomingCall.conversationId;
    state.activeConversation = state.conversations.find(
      (conv) => conv.id === conversationId
    ) || null;
  }
},

  addIceCandidate: (state, action: PayloadAction<RTCIceCandidate>) => {
    state.call.iceCandidates.push(action.payload);
  },
  clearIceCandidates: (state) => {
    state.call.iceCandidates = [];
  },
  endCall: (state) => {
    state.call.incomingCall = null;
    state.call.isCallActive = false;
    state.call.callAnswered = null;
    state.call.iceCandidates = [];
  },
 updateOnlineUsers: (state, action: PayloadAction<User[] | { user: User; status: 'online' | 'offline' }>) => {
      // If receiving initial online users list
      if (Array.isArray(action.payload)) {
        state.onlineUsers = action.payload;
      } 
      // If receiving single user status update
      else {
        const { user, status } = action.payload;
        if (status === 'online') {
          // Add user if not already online
          if (!state.onlineUsers.find(u => u.id === user.id)) {
            state.onlineUsers.push(user);
          }
        } else {
          // Remove user from online list
          state.onlineUsers = state.onlineUsers.filter(u => u.id !== user.id);
        }
      }
    },
    resetPagination: (state) => {
      state.pagination = initialState.pagination;
      state.conversations = [];
    },
    updateMessagesAndConversations: (state, action: PayloadAction<Message>) => {
      const message = action.payload;

      // Update messages if it's for the active conversation
      if (state.activeConversation?.id === message.conversationId) {
        // Check if message already exists to prevent duplicates
        const messageExists = state.messages.some((m) => m.id === message.id);
        if (!messageExists) {
          state.messages.push(message);
        }
      }

      // Update conversation's latest message
      const conversationIndex = state.conversations.findIndex(
        (c) => c.id === message.conversationId
      );
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].latestMessage = message;

        // Move conversation to top
        const conversation = state.conversations[conversationIndex];
        state.conversations.splice(conversationIndex, 1);
        state.conversations.unshift(conversation);
      }
    },

    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
      // Initialize typing users for this conversation if not exists
      if (action.payload?.id && !state.typingUsers[action.payload.id]) {
        state.typingUsers[action.payload.id] = [];
      }
    },
    addMessage: (state, action) => {
      const message = action.payload;
      state.messages.push(message);

      // Update latest message in conversation and resort
      const conversation = state.conversations.find(
        (c) => c.id === message.conversationId
      );
      if (conversation) {
        conversation.latestMessage = message;
        state.conversations = sortConversations(state.conversations);
      }
    },
    updateMessage: (state, action) => {
      const index = state.messages.findIndex(
        (msg) => msg.id === action.payload.id
      );
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    addNewConversation: (state, action) => {
      const conversation = action.payload;
      if (!conversation?.id) return;

      const existingIndex = state.conversations.findIndex(
        (c) => c.id === conversation.id
      );

      if (existingIndex === -1) {
        state.conversations.unshift(conversation);
        state.typingUsers[conversation.id] = [];
      } else {
        state.conversations[existingIndex] = conversation;
      }

      // Sort conversations after adding/updating
      state.conversations = sortConversations(state.conversations);
    },
    setTypingUser: (
      state,
      action: PayloadAction<{ conversationId: string; user: User }>
    ) => {
      const { conversationId, user } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }
      // Only add if user isn't already typing
      if (!state.typingUsers[conversationId].find((u) => u.id === user.id)) {
        state.typingUsers[conversationId].push(user);
      }
    },
    removeTypingUser: (
      state,
      action: PayloadAction<{ conversationId: string; userId: string }>
    ) => {
      const { conversationId, userId } = action.payload;
      if (state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = state.typingUsers[
          conversationId
        ].filter((user) => user.id !== userId);
      }
    },

    removeUserFromConversation: (state, action) => {
      const { conversationId, userId } = action.payload;
      const conversation = state.conversations.find(
        (c) => c.id === conversationId
      );
      if (conversation) {
        conversation.users = conversation.users.filter((u) => u.id !== userId);
      }
    },
     updateGroupMembers: (state, action: PayloadAction<{ conversation: Conversation; addedUsers?: User[] }>) => {
      const { conversation, addedUsers } = action.payload;
      const index = state.conversations.findIndex(c => c.id === conversation.id);
      if (index !== -1) {
        state.conversations[index] = conversation;
        if (state.activeConversation?.id === conversation.id) {
          state.activeConversation = conversation;
        }
      }
    },

    removeGroupMembers: (state, action: PayloadAction<{ conversation: Conversation; removedUsers?: User[] }>) => {
      const { conversation, removedUsers } = action.payload;
      const index = state.conversations.findIndex(c => c.id === conversation.id);
      if (index !== -1) {
        state.conversations[index] = conversation;
        if (state.activeConversation?.id === conversation.id) {
          state.activeConversation = conversation;
        }
      }
    },

    updateConversation: (state, action: PayloadAction<Conversation>) => {
      const conversation = action.payload;
      const index = state.conversations.findIndex(c => c.id === conversation.id);
      if (index !== -1) {
        state.conversations[index] = conversation;
        if (state.activeConversation?.id === conversation.id) {
          state.activeConversation = conversation;
        }
      }
    },

    removeConversation: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      state.conversations = state.conversations.filter(c => c.id !== conversationId);
      if (state.activeConversation?.id === conversationId) {
        state.activeConversation = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Create conversation
      .addCase(createConversation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.status = "succeeded";
        const conversation = action.payload;
        if (conversation?.id) {
          state.conversations.unshift(conversation);
          state.activeConversation = conversation;
          state.typingUsers[conversation.id] = [];
          state.messages = [];
          state.conversations = sortConversations(state.conversations);
        }
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create conversation";
      })
      // Get conversations
      .addCase(getConversations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
        state.status = "succeeded";
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch conversations";
      })
      // Get conversation messages
      .addCase(getConversationMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getConversationMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(getConversationMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch messages";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
        if (state.activeConversation?.id === action.payload.conversationId) {
          state.activeConversation.latestMessage = action.payload;
        }
      })
      .addCase(recallMessage.fulfilled, (state, action) => {
        const messageIndex = state.messages.findIndex(
          (m) => m.id === action.payload.messageId
        );
        if (messageIndex !== -1) {
          state.messages[messageIndex].isRecalled = true;
          state.messages[messageIndex].content = "Message has been recalled";
        }
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter((m) => m.id !== action.payload);
      })

      .addCase(leaveConversation.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter(
          (c) => c.id !== action.payload
        );
        if (state.activeConversation?.id === action.payload) {
          state.activeConversation = null;
        }
      })
      .addCase(updateGroupInfo.fulfilled, (state, action) => {
        const conversation = state.conversations.find(
          (c) => c.id === action.payload.id
        );
        if (conversation) {
          Object.assign(conversation, action.payload);
        }
      })
      .addCase(addUsersToGroup.fulfilled, (state, action) => {
        const updatedConversation = action.payload;
        const index = state.conversations.findIndex(
          (c) => c.id === updatedConversation.id
        );
        if (index !== -1) {
          state.conversations[index] = updatedConversation;
          if (state.activeConversation?.id === updatedConversation.id) {
            state.activeConversation = updatedConversation;
          }
        }
      })

      // Remove users from group
      .addCase(removeUsersFromGroup.fulfilled, (state, action) => {
        const updatedConversation = action.payload;
        const index = state.conversations.findIndex(
          (c) => c.id === updatedConversation.id
        );
        if (index !== -1) {
          state.conversations[index] = updatedConversation;
          if (state.activeConversation?.id === updatedConversation.id) {
            state.activeConversation = updatedConversation;
          }
        }
      })

      // Update group admin
      .addCase(updateGroupAdmin.fulfilled, (state, action) => {
        const updatedConversation = action.payload;
        const index = state.conversations.findIndex(
          (c) => c.id === updatedConversation.id
        );
        if (index !== -1) {
          state.conversations[index] = updatedConversation;
          if (state.activeConversation?.id === updatedConversation.id) {
            state.activeConversation = updatedConversation;
          }
        }
      });
  },
});

export const {
  setConnectionRef,
  clearConnectionRef,
  updateConnectionState,
  updateMessagesAndConversations,
  setActiveConversation,
  addMessage,
  updateMessage,
  addNewConversation,
  setTypingUser,
  removeTypingUser,
  updateOnlineUsers,
  removeUserFromConversation,
  resetPagination,
  setIncomingCall,
  setCallAnswered,
  addIceCandidate,
  clearIceCandidates,
  endCall,
  updateGroupMembers,
  removeGroupMembers,
  updateConversation,
  removeConversation
} = chatSlice.actions;

export default chatSlice.reducer;
