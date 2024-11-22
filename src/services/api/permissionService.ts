import { http } from "@/api/http";


export const permissionsApi = {
  getPermissions: async () => {
    const { data } = await http.get("/permissions?page=1&limit=50");
    return data;
    },
      getPermission: async (id: string) => {
    const { data } = await http.get(`/permissions/${id}`);
    return data;
  },
  createPermission: async (permission) => {
    const { data } = await http.post("/permissions", permission);
    return data;
  },
  updatePermission: async (id, permission) => {
    const { data } = await http.patch(`/permissions/${id}`, permission);
    return data;
  },
  deletePermission: async (id) => {
    const { data } = await http.delete(`/permissions/${id}`);
    return data;
  },
};
