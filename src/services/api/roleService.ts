import { http } from '@/api/http';
import axios from 'axios';


export const rolesApi = {
  getRoles: async () => {
    const { data } = await http.get("/roles");
    return data.results;
  },
  getRole: async (id: string) => {
    const response = await http.get(`/roles/${id}`);
    return response;
  },
  
  createRole: async (roleData) => {
    const { data } = await http.post("/roles", roleData);
    return data;
  },
  
  updateRole: async (id, roleData) => {
    const { data } = await http.patch(`/roles/${id}`, roleData);
    return data;
  },
  
  deleteRole: async (id) => {
    await http.delete(`/roles/${id}`);
  },

  getPermissions: async (page = 1, limit = 10, sortBy = 'module', order = 'DESC', module = 'REACTION TYPES') => {
    const { data } = await http.get(`/permissions?page=${page}&limit=${limit}`);
    return data.results;
  },
};

// // Roles API
// export const rolesApi = {
//   getRoles: async (params?: any) => {
//     const response = await api.get('/roles', { params });
//     return response.data;
//   },
// };

// // Posts API
// export const postsApi = {
//   getPosts: async (params?: any) => {
//     const response = await api.get('/roles', { params });
//     return response.data;
//   },
  
//   createPost: async (data: any) => {
//     const response = await api.post('/roles', data);
//     return response.data;
//   },
// };

// // Reaction Types API
// export const reactionTypesApi = {
//   getReactionTypes: async (params?: any) => {
//     const response = await api.get('/reaction-types', { params });
//     return response.data;
//   },
// };