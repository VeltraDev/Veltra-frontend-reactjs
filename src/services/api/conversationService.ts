import  {http}  from "@/api/http";
import { Conversation } from "@/types";

export interface CreateConversationDto {
  users: string[];
  name?: string;
  picture?: string;
}

export interface UpdateGroupInfoDto {
  name?: string;
  picture?: string;
}

export interface UpdateGroupAdminDto {
  adminId: string;
}

export interface AddUsersDto {
  userIds: string[];
}

export interface RemoveUsersDto {
  userIds: string[];
}

export const conversationService = {
  getAll: async () => {
    const response = await http.get("/conversations");
    return response.data;
  },

  create: async (data: CreateConversationDto) => {
    const response = await http.post("/conversations", data);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await http.get(`/conversations/${id}`);
    return response.data;
  },

  updateGroupInfo: async (id: string, data: UpdateGroupInfoDto) => {
    const response = await http.patch(`/conversations/${id}/update-info`, data);
    return response.data;
  },

  updateGroupAdmin: async (id: string, data: UpdateGroupAdminDto) => {
    const response = await http.put(
      `/conversations/${id}/update-group-admin`,
      data
    );
    return response.data;
  },

  addUsers: async (id: string, data: AddUsersDto) => {
    const response = await http.put(`/conversations/${id}/add-users`, data);
    return response.data;
  },

  removeUsers: async (id: string, data: RemoveUsersDto) => {
    const response = await http.put(`/conversations/${id}/remove-users`, data);
    return response.data;
  },

  leaveGroup: async (id: string) => {
    const response = await http.post(`/conversations/${id}/leave`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await http.delete(`/conversations/${id}`);
    return response.data;
  },
};
