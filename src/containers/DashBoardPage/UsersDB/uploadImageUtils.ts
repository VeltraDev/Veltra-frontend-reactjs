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
    // Get the canvas of the cropped image
    const canvas = cropRef.current.getImage();
    
    // Convert the canvas to a blob
    canvas.toBlob((blob) => {
      if (blob) {
        // Create a new File from the blob, reusing the original file name and type
        const croppedFile = new File([blob], selectedFile.name, {
          type: selectedFile.type,
        });

        // Set the cropped image as the selected file for upload
        setSelectedFile(croppedFile);

        // Generate a preview URL for the cropped image
        const previewUrl = URL.createObjectURL(croppedFile);
        setUserAvatar(previewUrl);

        // Close the cropper modal
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

    // Create a unique file name using UUID
    const uniqueFileName = `${uuidv4()}-${selectedFile.name}`;
    const uniqueFile = new File([selectedFile], uniqueFileName, {
      type: selectedFile.type,
    });
    formData.append('fileUpload', uniqueFile);

    //console.log(uniqueFile);
    // Upload to the server or storage
    const response = await http.post('/files/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Ensure you get a valid URL from the server, not a blob URL
    const uploadedAvatarUrl = response.data.data.url + '?t=' + new Date().getTime();
    console.log(uploadedAvatarUrl);
    setUserAvatar(uploadedAvatarUrl);

    return uploadedAvatarUrl;
  };
