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
        <div className="relative group overflow-hidden">
            <div
                className={`relative flex transition-transform duration-300 ease-in-out rounded-md ${
                    isSliding ? 'transform translate-x-[-100%]' : ''
                }`}
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {attachments.map((attachment, index) => (
                    <img
                        key={index}
                        src={attachment.url}
                        alt={`Attachment ${index + 1}`}
                        className="h-[585px] min-w-[470px] object-cover rounded-[8px] border border-zinc-800"
                    />
                ))}
            </div>
            {attachments.length > 1 && (
                <>
                    {currentIndex > 0 && (
                        <button
                            className="flex justify-center items-center absolute top-1/2 left-2 transform -translate-y-1/2 p-1 bg-[#ffffff] bg-opacity-25 rounded-full text-white w-[30px] h-[30px]"
                            onClick={() => onNavigate('prev')}
                        >
                            <ChevronLeft />
                        </button>
                    )}
                    {currentIndex < attachments.length - 1 && (
                        <button
                            className="flex justify-center items-center absolute top-1/2 right-2 transform -translate-y-1/2 p-1 bg-[#ffffff] bg-opacity-25 rounded-full text-white w-[30px] h-[30px]"
                            onClick={() => onNavigate('next')}
                        >
                            <ChevronRight />
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default ImageSlider;
