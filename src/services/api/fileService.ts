import  {http}  from "@/api/http";

export const fileService = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("fileUpload", file);

    const response = await http.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
