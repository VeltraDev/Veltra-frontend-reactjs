import { http } from "@/api/http";

export interface CreateMessageDto {
  content: string;
  conversationId: string;
  files?: Array<{
    url: string;
    type: "image" | "document";
  }>;
}

export interface ForwardMessageDto {
  messageId: string;
  conversationId: string;
}

export const messageService = {
  create: async (data: CreateMessageDto) => {
    const response = await http.post("/messages", data);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await http.get(`/conversations/${id}`);
    return response.data;
  },

  forward: async (data: ForwardMessageDto) => {
    const response = await http.post("/messages/forward", data);
    return response.data;
  },

  recall: async (id: string) => {
    const response = await http.put(`/messages/${id}/recall`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await http.delete(`/messages/${id}`);
    return response.data;
  },
};
