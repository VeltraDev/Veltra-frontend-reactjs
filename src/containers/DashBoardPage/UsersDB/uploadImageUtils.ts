// avatarUtils.ts
import { v4 as uuidv4 } from 'uuid';
import http from '@/utils/http';
import React from 'react';

export const handleCropSave = (
  cropRef: React.RefObject<any>, 
  selectedFile: File | null, 
  setUserAvatar: React.Dispatch<React.SetStateAction<string>>, 
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>, 
  setIsCropperOpen: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  if (cropRef.current && selectedFile) {

    const canvas = cropRef.current.getImage();
    
    canvas.toBlob((blob) => {
      if (blob) {

        const croppedFile = new File([blob], selectedFile.name, {
          type: selectedFile.type,
        });

        setSelectedFile(croppedFile);

        const previewUrl = URL.createObjectURL(croppedFile);
        setUserAvatar(previewUrl);

        setIsCropperOpen(false);
      }
    }, selectedFile.type);
  }
};

  export const uploadImage = async (
    selectedFile: File,
    setUserAvatar: React.Dispatch<React.SetStateAction<string>>
  ): Promise<string> => {
    const formData = new FormData();

    const uniqueFileName = `${uuidv4()}-${selectedFile.name}`;
    const uniqueFile = new File([selectedFile], uniqueFileName, {
      type: selectedFile.type,
    });
    formData.append('fileUpload', uniqueFile);

    const response = await http.post('/files/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const uploadedAvatarUrl = response.data.data.url + '?t=' + new Date().getTime();
    console.log(uploadedAvatarUrl);
    setUserAvatar(uploadedAvatarUrl);

    return uploadedAvatarUrl;
  };
