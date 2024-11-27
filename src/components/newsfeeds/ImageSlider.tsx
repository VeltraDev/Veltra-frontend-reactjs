import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Attachment {
    url: string;
}

interface ImageSliderProps {
    attachments: Attachment[];
    currentIndex: number;
    onNavigate: (direction: 'prev' | 'next') => void;
    isSliding: boolean;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
    attachments,
    currentIndex,
    onNavigate,
    isSliding,
}) => {
    return (
        <div className="relative group overflow-hidden bg-black rounded-md">
            <div
                className={`relative flex transition-transform duration-300 ease-in-out ${isSliding ? 'transform translate-x-[-100%]' : ''
                    }`}
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {attachments.map((attachment, index) => (
                    <div
                        key={index}
                        className="h-[585px] min-w-[470px] flex justify-center items-center bg-black rounded-[8px] border border-zinc-800"
                    >
                        <img
                            src={attachment.url}
                            alt={`Attachment ${index + 1}`}
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                ))}
            </div>
            {attachments.length > 1 && (
                <>
                    {currentIndex > 0 && (
                        <button
                            className="flex justify-center items-center absolute top-1/2 left-2 transform -translate-y-1/2 p-1 bg-[#ffffff] bg-opacity-25 rounded-full text-white w-[30px] h-[30px]"
                            onClick={() => onNavigate('prev')}
                        >
                            <ChevronLeft className="w-5 h-5 bg-gray-100 text-black border border-gray-300 rounded-full hover:bg-gray-200 transition-colors duration-200" />
                        </button>
                    )}
                    {currentIndex < attachments.length - 1 && (
                        <button
                            className="flex justify-center items-center absolute top-1/2 right-2 transform -translate-y-1/2 p-1 bg-[#ffffff] bg-opacity-25 rounded-full text-white w-[30px] h-[30px]"
                            onClick={() => onNavigate('next')}
                        >
                            <ChevronRight className="w-5 h-5 bg-gray-100 text-black border border-gray-300 rounded-full hover:bg-gray-200 transition-colors duration-200" />
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default ImageSlider;
