import http from "@/utils/http";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// API endpoints
const CONVERSATION_ENDPOINT = 'https://veltra2.duckdns.org/api/v1/conversations';
const MESSAGE_ENDPOINT = 'https://veltra2.duckdns.org/api/v1/messages';

// Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  displayStatus: string | null;
  createdAt: string;
}

interface Message {
  id: string;
  content: string;
  files: any[]; // Define files type if needed
  sender: User;
  createdAt: string;
  updatedAt: string;
  conversationId: string;
}

interface Conversation {
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

interface ConversationResponse {
  code: number;
  statusCode: number;
  message: string;
  data: Conversation;
}

interface ConversationsResponse {
  code: number;
  statusCode: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    results: Conversation[];
  };
}

interface MessageResponse {
  code: number;
  statusCode: number;
  message: string;
  data: Message;
}

// Redux state type
interface ChatState {
  status: string;
  error: string;
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  notifications: any[];
  files: any[];
}

const initialState: ChatState = {
  status: "",
  error: "",
  conversations: [],
  activeConversation: null,
  messages: [],
  notifications: [],
  files: [],
};

// Async thunks
export const getConversations = createAsyncThunk(
  "conversation/all",
  async (token: string, { rejectWithValue }) => {
    try {
      const { data }: { data: ConversationsResponse } = await http.get(`${CONVERSATION_ENDPOINT}?sortBy=createdAt&order=DESC`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
     
      return data.data.results; 
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const open_create_conversation = createAsyncThunk(
  "conversation/open_create",
  async (values: { token: string; receiver_id: string; isGroup: boolean }, { rejectWithValue }) => {
    const { token, receiver_id, isGroup } = values;
    try {
      const { data }: { data: ConversationResponse } = await http.post(
        CONVERSATION_ENDPOINT,
        { receiver_id, isGroup },
    
      );
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const getConversationMessages = createAsyncThunk(
  "conversation/messages",
  async (values: { token: string; convo_id: string }, { rejectWithValue }) => {
    const { token, convo_id } = values;
    try {
      const { data }: { data: MessageResponse[] } = await http.get(`${CONVERSATION_ENDPOINT}/${convo_id}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "message/send",
  async (values: { token: string; content: string; conversationId: string; files: any[] }, { rejectWithValue }) => {
    const { token, content, conversationId, files } = values;
    try {
      const { data }: { data: MessageResponse } = await http.post(
        MESSAGE_ENDPOINT,
        { content, conversationId, files },
      );
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

// Slice
export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<Conversation>) => {
      state.activeConversation = action.payload;
    },
    updateMessagesAndConversations: (state, action) => {
  
        state.messages.data.messages = [...state.messages.data.messages, action.payload];
   
      // //update conversations
      // let conversation = {
      //   ...action.payload.conversation,
      //   latestMessage: action.payload,
      // };
      // let newConvos = [...state.conversations].filter(
      //   (c) => c._id !== conversation._id
      // );
      // newConvos.unshift(conversation);
      // state.conversations = newConvos;
    },
    addFiles: (state, action: PayloadAction<any[]>) => {
      state.files.push(...action.payload);
    },
    clearFiles: (state) => {
      state.files = [];
    },
    removeFileFromFiles: (state, action: PayloadAction<number>) => {
      state.files.splice(action.payload, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getConversations.fulfilled, (state, action: PayloadAction<Conversation[]>) => {
        state.status = "succeeded";
        state.conversations = action.payload;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? 'Failed to fetch conversations';
      })
      .addCase(open_create_conversation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(open_create_conversation.fulfilled, (state, action: PayloadAction<Conversation>) => {
        state.status = "succeeded";
        state.activeConversation = action.payload;
        state.files = [];
      })
      .addCase(open_create_conversation.rejected, (state, action: PayloadAction<string>) => {
        state.status = "failed";
        state.error = action.payload ;
      })
      .addCase(getConversationMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getConversationMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(getConversationMessages.rejected, (state, action: PayloadAction<string>) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.status = "succeeded";
        state.messages.push(action.payload);
        const conversationIndex = state.conversations.findIndex(c => c.id === action.payload.conversationId);
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].latestMessage = action.payload;
          const updatedConversation = state.conversations.splice(conversationIndex, 1)[0];
          state.conversations.unshift(updatedConversation);
        }
        state.files = [];
      })
      .addCase(sendMessage.rejected, (state, action: PayloadAction<string>) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setActiveConversation,
  updateMessagesAndConversations,
  addFiles,
  clearFiles,
  removeFileFromFiles,
} = chatSlice.actions;

export default chatSlice.reducer;
