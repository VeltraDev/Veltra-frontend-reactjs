import { http } from "@/api/http";


export const reactionTypesApi = {
  getReactionTypes: async () => {
  const { data } = await http.get("/reaction-types");
    return data;// Lấy phần "data" trong phản hồi API
  },
};
