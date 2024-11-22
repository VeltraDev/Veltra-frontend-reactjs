import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Image, AlignLeft, Smile, Calendar, Camera, MapPin } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { http } from '@/api/http';
import defaultAvatar from '@/images/user/defaultAvatar.png';
interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated?: () => void; 
}

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
    const { currentTheme } = useTheme();
    const { user } = useAuth();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [caption, setCaption] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        const fetchUserAvatar = async () => {
            console.log('Fetching user avatar...');
            try {
                const accountResponse = await http.get('/auth/account');
                console.log('Account response:', accountResponse);
                const userId = accountResponse.data.user.id;

                if (userId) {
                    const userResponse = await http.get(`/users/${userId}`);
                    const userData = userResponse.data.avatar;
                    setAvatar(userData || defaultAvatar);
                }
            } catch (error) {
                console.error('Error fetching user avatar:', error);
            }
        };

        if (user) {
            fetchUserAvatar();
        }
    }, [user]);

    useEffect(() => {
        if (!isOpen) {
            handleReset();
            setIsConfirmModalOpen(false);
        }
    }, [isOpen]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const filteredFiles = files.filter(
            (file) => !selectedFiles.some((existingFile) => existingFile.name === file.name)
        );

        if (filteredFiles.length + selectedFiles.length > 10) {
            toast.error('You can only upload up to 10 images.');
            return;
        }

        const urls = filteredFiles.map((file) => URL.createObjectURL(file));
        setPreviewUrls((prevUrls) => [...prevUrls, ...urls]);
        setSelectedFiles((prevFiles) => [...prevFiles, ...filteredFiles]);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        const uniqueFileName = `${uuidv4()}-${file.name}`;
        const uniqueFile = new File([file], uniqueFileName, { type: file.type });
        formData.append('fileUpload', uniqueFile);

        try {
            const response = await http.post('/files/upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log('uploadImage: Server response', response);

            if (response.data?.data?.url) {
                return `${response.data.url}?t=${Date.now()}`;
            }

            if (response.data?.url) {
                return `${response.data.url}?t=${Date.now()}`;
            }

            throw new Error('Invalid response structure: URL not found.');
        } catch (error) {
            console.error('uploadImage: Failed to upload image', error);
            throw error;
        }
    };

 const handleSubmit = async () => {
        if (!caption.trim() && selectedFiles.length === 0) {
            toast.error('Please enter some content or select at least one image.');
            return;
        }

        try {
            const attachments = [];

            for (const file of selectedFiles) {
                const url = await uploadImage(file);
                attachments.push({ url, type: 'image' });
            }

            const postData = {
                content: caption.trim(), 
                attachments,
            };

            console.log('Post data:', postData); 

            await http.post('/posts', postData);

            toast.success('Post created successfully!');
            handleReset(); 
            
            onClose(); 
             if (onPostCreated) {
                console.log("onPostCreated called!");
                onPostCreated();
            } 
        } catch (error) {
            if (error.response) {
                toast.error(`Failed to create post: ${error.response.data.message}`);
            } else {
                toast.error('Failed to create post. Please try again.');
            }
            console.error('handleSubmit: Error creating post', error);
        }
    };

    const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target;

        textarea.style.height = 'auto';

        textarea.style.height = `${textarea.scrollHeight}px`;

        setCaption(e.target.value);
    };

    const handleReset = () => {
        setSelectedFiles([]);
        setPreviewUrls([]);
        setCaption('');
        setCurrentImageIndex(0);
    };

    const handleClose = () => setIsConfirmModalOpen(true);
    const handleConfirmClose = () => {
        handleReset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
                style={{
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#888 #f4f4f4',
                    borderRadius: '12px',
                }}
                className={` relative ${currentTheme.bg} rounded-xl max-w-2xl w-full border ${currentTheme.border2}`}
            >
                <div className={`flex items-center justify-between p-4 border-b ${currentTheme.border2}`}>
                    <button onClick={handleClose}>
                        <X className={currentTheme.iconColor} />
                    </button>
                    <h2 className={`text-lg font-semibold ${currentTheme.text}`}>Create New Post</h2>
                    <button onClick={handleSubmit} className="text-blue-500 font-semibold hover:text-blue-600">
                        Post
                    </button>
                </div>

                <div className={`p-4 border-b ${currentTheme.border2} flex items-start space-x-4`}>
                    <img
                        src={avatar}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <textarea
                        value={caption} 
                        onChange={handleCaptionChange}
                        placeholder="What's on your mind?"
                        className={` overflow-y-auto scrollbar-custom flex-grow w-full resize-none ${currentTheme.bg} ${currentTheme.text} focus:outline-none`}
                        rows={1}
                        // style={{
                        //     overflow: 'hidden',
                        // }}
                    />
                </div>

                <div className={`flex-1 flex items-center justify-center p-4 ${currentTheme.bg}`}>
                    <div className='my-3'></div>
                    {previewUrls.length > 0 && (
                        <div className="relative flex justify-center items-center w-full h-[280px]">

                            {previewUrls.length > 2 && currentImageIndex > 0 && (
                                <button
                                    onClick={() => setCurrentImageIndex((prev) => Math.max(0, prev - 2))}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                            )}
                            <div className="flex gap-4 w-[80%] h-full justify-center items-center">
                                {previewUrls
                                    .slice(currentImageIndex, currentImageIndex + 2)
                                    .map((url, index) => (
                                        <div key={index} className="relative w-1/2 h-full">
                                            <img
                                                src={url}
                                                alt={`Preview ${currentImageIndex + index + 1}`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <button
                                                onClick={() => handleRemoveImage(currentImageIndex + index)}
                                                className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                            </div>
                            {previewUrls.length > 2 && currentImageIndex < previewUrls.length - 2 && (
                                <button
                                    onClick={() =>
                                        setCurrentImageIndex((prev) => Math.min(previewUrls.length - 2, prev + 2))
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className={`flex items-center justify-between p-4 border-t ${currentTheme.border2}`}>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center text-cyan-600 hover:opacity-80"
                        >
                            <Image className="w-5 h-5" />
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                            />
                        </button>
                        <button className="flex items-center text-cyan-600 hover:opacity-80">
                            <AlignLeft className="w-5 h-5" />
                        </button>
                        <button className="flex items-center text-cyan-600 hover:opacity-80">
                            <Smile className="w-5 h-5" />
                        </button>
                        <button className="flex items-center text-cyan-600 hover:opacity-80">
                            <Calendar className="w-5 h-5" />
                        </button>
                        <button className="flex items-center text-cyan-600 hover:opacity-80">
                            <Camera className="w-5 h-5" />
                        </button>
                        <button className="flex items-center text-cyan-600 hover:opacity-80">
                            <MapPin className="w-5 h-5" />
                        </button>
                    </div>
                    <button onClick={handleSubmit} className="px-4 py-2 rounded-full text-white font-semibold bg-blue-400">
                        Post
                    </button>
                </div>

                {isConfirmModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className={`bg-white rounded-lg p-6 w-full max-w-sm`}>
                            <h3 className="text-lg font-semibold mb-4">Hủy bài viết?</h3>
                            <p className="mb-6 text-center">Bạn không thể hoàn tác thao tác này và bản nháp sẽ biến mất</p>
                            <div className="flex space-y-4 flex-col">
                                <button
                                    onClick={handleConfirmClose}
                                    className="w-full px-4 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={() => setIsConfirmModalOpen(false)}
                                    className="w-full px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 font-semibold"
                                >
                                    Ở lại
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
