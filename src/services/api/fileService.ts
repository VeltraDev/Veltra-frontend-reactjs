import { http } from '@/api/http';

interface FileUploadResponse {
  code: number;
  statusCode: number;
  message: string;
  data: {
    url: string;
  };
}

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/webp',
  'image/svg+xml',
  'image/avif'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const fileService = {
  validateFile: (file: File) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only images are allowed.');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size must be less than 5MB');
    }
    return true;
  },

  upload: async (file: File) => {
    try {
      fileService.validateFile(file);
      
      const formData = new FormData();
      formData.append('fileUpload', file);

      const response = await http.post<FileUploadResponse>('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
console.log(response)
      return response;
    } catch (error: any) {
      if (error.statusCode === 422) {
        throw new Error('Invalid file type. Only images are allowed.');
      }
      throw error;
    }
  },
};