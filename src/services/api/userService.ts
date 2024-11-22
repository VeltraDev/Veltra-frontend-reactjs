import { http } from '@/api/http';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com/v1', // Replace with your API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Users API
export const usersApi = {
  getUsers: async (params?: any) => {
    const response = await http.get('/users', { params });
    return response.data;
  },
   getUser: async (id: string) => {
    const response = await http.get(`/users/${id}`);
    return response;
  },
  createUser: async (data: any) => {
    const response = await http.post('/users', data);
    return response.data;
  },
  
  updateUser: async (id: string, data: any) => {
    const response = await http.patch(`/users/${id}`, data);
    return response.data;
  },
  
  deleteUser: async (id: string) => {
    const response = await http.delete(`/users/${id}`);
    return response.data;
  },
};

// Roles API
export const rolesApi = {
  getRoles: async (params?: any) => {
    const response = await http.get('/roles', { params });
    return response;
  },
  
};

// Posts API
export const postsApi = {
  getPosts: async (params?: any) => {
    const response = await api.get('/posts', { params });
    return response.data;
  },
  
  createPost: async (data: any) => {
    const response = await api.post('/posts', data);
    return response.data;
  },
};

// Reaction Types API
export const reactionTypesApi = {
  getReactionTypes: async (params?: any) => {
    const response = await api.get('/reaction-types', { params });
    return response.data;
  },
};