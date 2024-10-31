import React from 'react';
import { InfoIcon, PhoneIcon, VideoIcon } from 'lucide-react';


interface ChatHeaderProps {
    typingUsers: { userId: string; conversationId: string }[];
    user: undefined;
}

export default function ChatHeader({ user, typingUsers }: ChatHeaderProps) {
    if (!user) return null;
   
    return (
        <div className="sticky top-0 z-10 flex sm:items-center justify-between py-2 h-[75px] px-4 border-b-[1px] border-gray-900 bg-black">
            <div className="relative flex items-center space-x-4 ">
                <div className='flex items-center space-x-3 p-2 rounded-lg '>
                    <img src={user.avatar} className='w-12 h-12 rounded-full object-cover cursor-pointer' alt="User avatar" />
                    <div className='flex flex-col'>
                        <p className='text-[0.9rem] font-semibold leading-5 text-white cursor-pointer'>{user.name}</p>
                        <div className='flex items-center'>
                            <div className='w-2 h-2 rounded-full bg-green-500 mr-1'></div>
                            <p className='text-xs text-gray-400 truncate cursor-pointer'>Đang hoạt động</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <PhoneIcon className='size8 text-white hover:bg-gray-300 focus:outline-none' />
                <VideoIcon className='size8 text-white hover:bg-gray-300 focus:outline-none' />
                <InfoIcon className='size8 text-white hover:bg-gray-300 focus:outline-none' />
            </div>
         
        </div>
    );
}
