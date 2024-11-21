import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const api = axios.create({
  baseURL: 'https://veltra2.duckdns.org/api/v1',
});

// Intercept requests to include the access token and content type
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const accessToken = localStorage.getItem('accessToken'); // Retrieve token from local storage
  if (accessToken) {
    config.headers = config.headers || {}; // Ensure headers exist
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  config.headers['Content-Type'] = 'application/json';
  return config;
});

// Define the Permission type based on the form structure
export interface Permission {
  name: string;
  apiPath: string;
  method: string;
  module: string;
}

// Submit a new form
export async function submitForm(form: Permission): Promise<{ status: number; data: any }> {
  try {
    const res: AxiosResponse = await api.post(`/permissions`, form);
    return { status: res.status, data: res.data };
  } catch (err: any) {
    console.error(err.response ? err.response.data : err.message);
    throw new Error(err.response ? err.response.data.message : err.message);
  }
}

// Get a form by ID
export async function getFormById(id: string): Promise<{ status: number; data: any }> {
  try {
    const res: AxiosResponse = await api.get(`/permissions/${id}`);
    return { status: res.status, data: res.data };
  } catch (err: any) {
    throw new Error(err.response ? err.response.data.message : err.message);
  }
}

// Update a form by ID
export async function updateFormById(id: string, form: Permission): Promise<{ status: number; data: any }> {
  try {
    const res: AxiosResponse = await api.patch(`/permissions/${id}`, form);
    return { status: res.status, data: res.data };
  } catch (err: any) {
    throw new Error(err.response ? err.response.data.message : err.message);
  }
}

// Get all forms with pagination, sorting, and ordering
export async function getAllForms(
  page: number,
  limit: number,
  sortBy: string,
  order: 'asc' | 'desc'
): Promise<{ status: number; data: any }> {
  try {
    const res: AxiosResponse = await api.get(`/permissions`, {
      params: {
        page,
        limit,
        sortBy,
        order,
      },
    });
    return { status: res.status, data: res.data };
  } catch (err: any) {
    console.error('Error fetching forms:', err);
    throw new Error(err.message);
  }
}

// Delete a form by ID
export async function deleteFormById(id: string): Promise<{ status: number }> {
  try {
    const res: AxiosResponse = await api.delete(`/permissions/${id}`);
    return { status: res.status };
  } catch (err: any) {
    throw new Error(err.message);
  }
}
