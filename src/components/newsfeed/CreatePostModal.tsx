import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, MapPin, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'react-hot-toast';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
    const { currentTheme } = useTheme();
    const [step, setStep] = useState<'select' | 'edit'>('select');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [caption, setCaption] = useState('');
    const [location, setLocation] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [aspectRatio, setAspectRatio] = useState<'square' | '4:5' | '16:9'>('square');
    const [filter, setFilter] = useState<string>('none');

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 10) {
            toast.error('Maximum 10 images allowed');
            return;
        }

        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
        setSelectedFiles(files);
        setStep('edit');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 10) {
            toast.error('Maximum 10 images allowed');
            return;
        }

        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
        setSelectedFiles(files);
        setStep('edit');
    };

    const handleSubmit = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Post created successfully!');
            onClose();
            // Reset state
            setStep('select');
            setSelectedFiles([]);
            setPreviewUrls([]);
            setCaption('');
            setLocation('');
        } catch (error) {
            toast.error('Failed to create post');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`${currentTheme.bg} rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <button onClick={() => step === 'edit' ? setStep('select') : onClose()}>
                        {step === 'edit' ? (
                            <ChevronLeft className={currentTheme.iconColor} />
                        ) : (
                            <X className={currentTheme.iconColor} />
                        )}
                    </button>
                    <h2 className={`text-lg font-semibold ${currentTheme.text}`}>Create New Post</h2>
                    {step === 'edit' ? (
                        <button
                            onClick={handleSubmit}
                            className="text-blue-500 font-semibold hover:text-blue-600"
                        >
                            Share
                        </button>
                    ) : (
                        <div className="w-6" />
          )}
                </div>

                {/* Content */}
                {step === 'select' ? (
                    <div
                        className="p-20 flex flex-col items-center justify-center space-y-4"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        <ImageIcon className={`w-20 h-20 ${currentTheme.iconColor}`} />
                        <p className={`text-xl font-semibold ${currentTheme.text}`}>
                            Drag photos and videos here
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleFileSelect}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Select from computer
                        </button>
                    </div>
                ) : (
                    <div className="flex h-[600px]">
                        {/* Image Preview */}
                        <div className="w-[600px] relative bg-black flex items-center justify-center">
                            {previewUrls.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white"
                                        disabled={currentImageIndex === 0}
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentImageIndex(prev => Math.min(previewUrls.length - 1, prev + 1))}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white"
                                        disabled={currentImageIndex === previewUrls.length - 1}
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}
                            <img
                                src={previewUrls[currentImageIndex]}
                                alt="Preview"
                                className={`max-w-full max-h-full object-contain filter-${filter}`}
                                style={{
                                    aspectRatio: aspectRatio === 'square' ? '1' : aspectRatio === '4:5' ? '4/5' : '16/9'
                                }}
                            />
                        </div>

                        {/* Edit Section */}
                        <div className="flex-1 flex flex-col">
                            {/* Caption Input */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <textarea
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    placeholder="Write a caption..."
                                    className={`w-full h-24 ${currentTheme.bg} ${currentTheme.text} resize-none focus:outline-none`}
                                />
                            </div>

                            {/* Location Input */}
                            <div className="p-4 flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700">
                                <MapPin className={`w-5 h-5 ${currentTheme.iconColor}`} />
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Add location"
                                    className={`flex-1 ${currentTheme.bg} ${currentTheme.text} focus:outline-none`}
                                />
                            </div>

                            {/* Tag People */}
                            <button className="p-4 flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700">
                                <UserPlus className={`w-5 h-5 ${currentTheme.iconColor}`} />
                                <span className={currentTheme.text}>Tag people</span>
                            </button>

                            {/* Aspect Ratio */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className={`text-sm font-semibold ${currentTheme.text} mb-2`}>
                                    Aspect Ratio
                                </h3>
                                <div className="flex space-x-2">
                                    {(['square', '4:5', '16:9'] as const).map((ratio) => (
                                        <button
                                            key={ratio}
                                            onClick={() => setAspectRatio(ratio)}
                                            className={`px-3 py-1 rounded-lg text-sm ${aspectRatio === ratio
                                                    ? 'bg-blue-500 text-white'
                                                    : `${currentTheme.buttonHover} ${currentTheme.text}`
                                                }`}
                                        >
                                            {ratio}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className={`text-sm font-semibold ${currentTheme.text} mb-2`}>
                                    Filters
                                </h3>
                                <div className="flex space-x-2 overflow-x-auto">
                                    {['none', 'clarendon', 'gingham', 'moon', 'lark'].map((filterName) => (
                                        <button
                                            key={filterName}
                                            onClick={() => setFilter(filterName)}
                                            className={`px-3 py-1 rounded-lg text-sm ${filter === filterName
                                                    ? 'bg-blue-500 text-white'
                                                    : `${currentTheme.buttonHover} ${currentTheme.text}`
                                                }`}
                                        >
                                            {filterName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}