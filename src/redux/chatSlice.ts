import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import type { User, Message, Conversation } from "../types";
import { CreateConversationDto } from "@/services/api/conversationService";
import { conversationService } from "@/services/api/conversationService";
import { messageService } from "@/services/api/messageService";

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  typingUsers: Record<string, User[]>;
  onlineUsers: User[];
  total: number; // Thêm total
}

const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoading: false,
  error: null,
  typingUsers: {},
  onlineUsers: [],
  total: 0, // Khởi tạo
};

const sortConversations = (conversations: Conversation[]) => {
  return [...conversations].sort((a, b) => {
    const timeA = a.latestMessage?.createdAt || a.createdAt;
    const timeB = b.latestMessage?.createdAt || b.createdAt;
    return new Date(timeB).getTime() - new Date(timeA).getTime();
  });
};

// Async thunks
export const createConversation = createAsyncThunk(
  "chat/createConversation",
  async (data: CreateConversationDto, { dispatch }) => {
    const response = await conversationService.create(data);
    dispatch(getConversations());
    return response.data;
  }
);

export const getConversations = createAsyncThunk(
  "chat/getConversations",
  async () => {
    const response = await conversationService.getAll();
    return response.results;
  }
);

export const getConversationsWithTotal = createAsyncThunk(
  "chat/getConversationsWithTotal",
  async ({ page }: { page: number }) => {
    const response = await conversationService.getConversationsWithTotal(page);
    return {
      results: response.results, // Danh sách conversations
      total: response.total,    // Tổng số conversations
    };
  }
);


export const updateGroupInfo = createAsyncThunk(
  "chat/updateGroupInfo",
  async ({ id, data }: { id: string; data: { name?: string; picture?: string } }) => {
    const response = await conversationService.updateGroupInfo(id, data);
    return response.data;
  }
);

export const updateGroupAdmin = createAsyncThunk(
  "chat/updateGroupAdmin",
  async ({ id, adminId }: { id: string; adminId: string }) => {
    const response = await conversationService.updateGroupAdmin(id, { adminId });
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
  async ({ messageId, conversationId }: { messageId: string; conversationId: string }) => {
    const response = await messageService.forward({ messageId, conversationId });
    return response.data;
  }
);

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
    updateOnlineUsers: (state, action: PayloadAction<User[] | { user: User; status: 'online' | 'offline' }>) => {
      if (Array.isArray(action.payload)) {
        state.onlineUsers = action.payload;
      } else {
        const { user, status } = action.payload;
        if (status === 'online') {
          if (!state.onlineUsers.find(u => u.id === user.id)) {
            state.onlineUsers.push(user);
          }
        } else {
          state.onlineUsers = state.onlineUsers.filter(u => u.id !== user.id);
        }
      }
    },
    updateMessagesAndConversations: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      if (state.activeConversation?.id === message.conversationId) {
        const messageExists = state.messages.some((m) => m.id === message.id);
        if (!messageExists) {
          state.messages.push(message);
        }
      }

      const conversationIndex = state.conversations.findIndex(
        (c) => c.id === message.conversationId
      );
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].latestMessage = message;
        const conversation = state.conversations[conversationIndex];
        state.conversations.splice(conversationIndex, 1);
        state.conversations.unshift(conversation);
      }
    },
    setActiveConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.activeConversation = action.payload;
      if (action.payload?.id && !state.typingUsers[action.payload.id]) {
        state.typingUsers[action.payload.id] = [];
      }
    },
    deleteMessageById: (state, action: PayloadAction<{ messageId: string; conversationId: string }>) => {
      const { messageId, conversationId } = action.payload;
      if (state.activeConversation?.id === conversationId) {
        state.messages = state.messages.filter(m => m.id !== messageId);
      }
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.latestMessage = state.messages[state.messages.length - 1] || null;
      }
    },
    
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      if (state.activeConversation?.id === message.conversationId) {
        state.messages.push(message);
        console.log('messages: ', state.messages);
      }
      console.log("Message:", message);
      console.log("Conversations:", state.conversations);
      const conversation = state.conversations.find(
        (c) => c.id === message.conversationId
      );
      console.log("Conversation:", conversation);
      if (conversation) {
        conversation.latestMessage = message;
        console.log("Latest message:", message);
        state.conversations = sortConversations(state.conversations);
      }
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const index = state.messages.findIndex(msg => msg.id === action.payload.id);
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    addNewConversation: (state, action: PayloadAction<Conversation>) => {
      const conversation = action.payload;
      if (!conversation?.id) return;

      const existingIndex = state.conversations.findIndex(c => c.id === conversation.id);
      if (existingIndex === -1) {
        state.conversations.unshift(conversation);
        state.typingUsers[conversation.id] = [];
      } else {
        state.conversations[existingIndex] = conversation;
      }
      state.conversations = sortConversations(state.conversations);
    },
    setTypingUser: (state, action: PayloadAction<{ conversationId: string; user: User }>) => {
      const { conversationId, user } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }
      if (!state.typingUsers[conversationId].find(u => u.id === user.id)) {
        state.typingUsers[conversationId].push(user);
      }
    },
    removeTypingUser: (state, action: PayloadAction<{ conversationId: string; userId: string }>) => {
      const { conversationId, userId } = action.payload;
      if (state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = state.typingUsers[conversationId]
          .filter(user => user.id !== userId);
      }
    },
    removeUserFromConversation: (state, action: PayloadAction<{ conversation: Conversation; user: User }>) => {
      const { conversation, user } = action.payload;
      console.log("Removing user from conversation:", conversation, user);
      if (state.activeConversation?.id === conversation.id) {
        state.activeConversation = state.conversations.find(c => c.id !== conversation.id) || null;
      }
      const existingConversation = state.conversations.find(c => c.id === conversation.id);
      if (existingConversation) {
        existingConversation.users = existingConversation.users.filter(u => u.id !== user.id);

      }
    },
    handleAdminDeleted: (state, action: PayloadAction<{ conversationId: string }>) => {
      const { conversationId } = action.payload;
      if (state.activeConversation?.id === conversationId) {
        // Nếu người dùng đang xem cuộc hội thoại bị xóa, chuyển sang cuộc hội thoại khác
        state.activeConversation = state.conversations.find(c => c.id !== conversationId) || null;
      }
      console.log("Admin deleted conversation:", state.conversations, conversationId);
      // Cập nhật danh sách cuộc hội thoại
      state.conversations = state.conversations.filter(c => c.id !== conversationId);
    },
    updateGroupMembers: (state, action: PayloadAction<{ conversation: Conversation; addedUsers?: User[] }>) => {
      const { conversation } = action.payload;
      const index = state.conversations.findIndex(c => c.id === conversation.id);
      if (index !== -1) {
        state.conversations[index] = conversation;
        if (state.activeConversation?.id === conversation.id) {
          state.activeConversation = conversation;
        }
      }
    },
    removeGroupMembers: (state, action: PayloadAction<{ conversation: Conversation; removedUsers?: User[] }>) => {
      const { conversation } = action.payload;
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
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(createConversation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.isLoading = false;
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
        state.isLoading = false;
        state.error = action.error.message || "Failed to create conversation";
      })
      .addCase(getConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
        state.isLoading = false;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch conversations";
      })
      .addCase(getConversationsWithTotal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getConversationsWithTotal.fulfilled, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.conversations = action.payload.results; // Reset khi page là 1
        } else {
          // Tránh trùng lặp conversation
          const seen = new Set(state.conversations.map((c) => c.id));
          const newConversations = action.payload.results.filter(
            (c) => !seen.has(c.id)
          );
          state.conversations = [...state.conversations, ...newConversations];
        }
        state.total = action.payload.total; // Cập nhật tổng số
        state.isLoading = false;
      })
      .addCase(getConversationsWithTotal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch conversations";
      })
      .addCase(getConversationMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getConversationMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.isLoading = false;
      })
      .addCase(getConversationMessages.rejected, (state, action) => {
        state.isLoading = false;
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
        state.messages = state.messages.filter(m => m.id !== action.payload);
      })
      .addCase(leaveConversation.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter(c => c.id !== action.payload);
        if (state.activeConversation?.id === action.payload) {
          state.activeConversation = null;
        }
      })
      .addCase(updateGroupInfo.fulfilled, (state, action) => {
        const updatedConversation = action.payload;
        const index = state.conversations.findIndex(c => c.id === updatedConversation.id);
        if (index !== -1) {
          state.conversations[index] = updatedConversation;
          if (state.activeConversation?.id === updatedConversation.id) {
            state.activeConversation = updatedConversation;
          }
        }
      })
      .addCase(addUsersToGroup.fulfilled, (state, action) => {
        const updatedConversation = action.payload;
        const index = state.conversations.findIndex(c => c.id === updatedConversation.id);
        if (index !== -1) {
          state.conversations[index] = updatedConversation;
          if (state.activeConversation?.id === updatedConversation.id) {
            state.activeConversation = updatedConversation;
          }
        }
      })
      .addCase(removeUsersFromGroup.fulfilled, (state, action) => {
        const updatedConversation = action.payload;
        const index = state.conversations.findIndex(c => c.id === updatedConversation.id);
        if (index !== -1) {
          state.conversations[index] = updatedConversation;
          if (state.activeConversation?.id === updatedConversation.id) {
            state.activeConversation = updatedConversation;
          }
        }
      })
      .addCase(updateGroupAdmin.fulfilled, (state, action) => {
        const updatedConversation = action.payload;
        const index = state.conversations.findIndex(c => c.id === updatedConversation.id);
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
  updateOnlineUsers,
  updateMessagesAndConversations,
  setActiveConversation,
  addMessage,
  updateMessage,
  addNewConversation,
  setTypingUser,
  removeTypingUser,
  removeUserFromConversation,
  updateGroupMembers,
  removeGroupMembers,
  updateConversation,
  removeConversation,
  deleteMessageById,
  handleAdminDeleted,
} = chatSlice.actions;

export default chatSlice.reducer;