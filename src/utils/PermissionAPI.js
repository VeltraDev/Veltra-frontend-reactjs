
import axios from 'axios';

// Khởi tạo instance axios với baseURL
export const api = axios.create({
  baseURL: 'https://veltra2.duckdns.org/api/v1',
});

// Token cố định
const fixedAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM5MzgyZjNmLWIxOTQtNGIyYi1hYWYxLWExZGExZjcwMzExNyIsImVtYWlsIjoidmVsdHJhLmFkbWluQGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IlZlbHRyYSIsImxhc3ROYW1lIjoiQWRtaW4iLCJyb2xlIjp7ImlkIjoiNWM1Zjg2YzgtMWQ4ZS00ZTYyLThkOTctOGIyNjE1NGJhM2IxIiwibmFtZSI6IkFETUlOIn0sImlhdCI6MTczMDAxMDg2MywiZXhwIjoxNzMwMDEyNjYzfQ.eetMNVR5-vsiwAr0Jt7W8ejOls8PJ53gCDQZaVG6oso';

// Thiết lập interceptors để thêm token vào header của mỗi yêu cầu
api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${fixedAccessToken}`;
  config.headers['Content-Type'] = 'application/json';
  return config;
});

// Hàm submitForm
export async function submitForm(form) {
  try {
    const res = await api.post(`/permissions`, form);
    return { status: res.status, data: res.data };
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    throw new Error(err.response ? err.response.data.message : err.message);
  }
}

// Hàm getFormById
export async function getFormById(id) {
  try {
    const res = await api.get(`/permissions/${id}`);
    return { status: res.status, data: res.data };
  } catch (err) {
    throw new Error(err.response ? err.response.data.message : err.message);
  }
}

// Hàm updateFormById
export async function updateFormById(id, form) {
  try {
    const res = await api.patch(`/permissions/${id}`, form);
    return { status: res.status, data: res.data };
  } catch (err) {
    throw new Error(err.response ? err.response.data.message : err.message);
  }
}

// Hàm getAllForms với endpoint cố định
export async function getAllForms(page, limit, sortBy, order) {
  try {
    const res = await api.get(`/permissions`, {
      params: {
        page: page,
        limit: limit,
        sortBy: sortBy,
        order: order,
      },
    });
    return { status: res.status, data: res.data };
  } catch (err) {
    console.error('Error fetching forms:', err);
    throw new Error(err.message);
  }
}


// Hàm deleteFormById
export async function deleteFormById(id) {
  try {
    const res = await api.delete(`/permissions/${id}`);
    return { status: res.status };
  } catch (err) {
    throw new Error(err.message);
  }
}
