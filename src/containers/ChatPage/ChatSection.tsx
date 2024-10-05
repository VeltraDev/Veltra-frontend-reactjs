import { InfoIcon, PhoneIcon, SmileIcon, VideoIcon } from 'lucide-react';
import React from 'react';

export default function ChatInterface() {
    const messages = [
        {
            time: "12:00 AM",
            messages: [
                {
                    sender: "other",
                    content: "Hey, how are you doing?",
                    avatar: "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                },
                {
                    sender: "self",
                    content: "I'm good, thanks! How about you?",
                    avatar: "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                }
            ]
        },
        {
            time: "12:05 AM",
            messages: [
                {
                    sender: "other",
                    content: "I'm doing well too. Did you finish the project?",
                    avatar: "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                },
                {
                    sender: "self",
                    content: "Yes, I just completed it. I'll send you the files soon.",
                    avatar: "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                }
            ]
        },
        {
            time: "12:10 AM",
            messages: [
                {
                    sender: "other",
                    content: "Great! Looking forward to seeing it.",
                    avatar: "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                }
            ]
        }
        
    ];

    return (
        <div className="flex-1 p-2 font-normal pl-3 justify-between flex flex-col h-screen">
            <div className="sticky top-0 z-10 flex sm:items-center justify-between py-2 border-b-[1px] border-gray-900 bg-black">
                <div className="relative flex items-center space-x-4">
                    <div className='flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200'>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ7W7Gx6FdAJHJ-dSK-bjbTIbepuPUVI5t8Q&s" className='w-12 h-12 rounded-full object-cover' alt="User avatar" />
                        <div className='flex flex-col'>
                            <p className='text-[0.9rem] font-medium text-white'>young.clement</p>
                            <p className='text-xs text-gray-400 truncate'>Hello</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <PhoneIcon className='size8 text-white hover:bg-gray-300 focus:outline-none' />
                    <VideoIcon className='size8 text-white hover:bg-gray-300 focus:outline-none' />
                    <InfoIcon className='size8 text-white hover:bg-gray-300 focus:outline-none' />
                </div>
            </div>
            <div id="messages" className="flex flex-col space-y-4 p-2 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                {messages.map((timeGroup, index) => (
                    <React.Fragment key={index}>
                        <div className="text-center text-xs text-gray-500 font-bold my-2">{timeGroup.time}</div>
                        {timeGroup.messages.map((message, msgIndex) => (
                            <div key={msgIndex} className="chat-message">
                                <div className={`flex items-center ${message.sender === 'self' ? 'justify-end' : 'justify-start'}`}>
                                    {message.sender !== 'self' && <img src={message.avatar} alt="User profile" className="size-7 rounded-full mr-3" />}
                                    <div className="flex flex-col space-y-2 text-[0.95rem] font-light max-w-xs">
                                        <div className={`${message.sender === 'self' ? 'bg-[#3797F0]' : 'bg-secondary'} text-white px-[1rem] py-[0.42rem] rounded-3xl inline-block`}>
                                            {message.content}
                                        </div>
                                    </div>
                                    {message.sender === 'self' && <img src={message.avatar} alt="My profile" className="size-7 rounded-full ml-3" />}
                                </div>
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>

            <div className="relative  flex">
                <span className="absolute inset-y-0 flex items-center">
                    <SmileIcon className='size8 left-4 absolute text-white hover:bg-gray-300 focus:outline-none' />
                </span>
                <input type="text" placeholder="Write your message!" className="w-full focus:outline-none focus:placeholder-textSecondary text-white border-secondary border-[2px] placeholder-gray-600 pl-12 bg-black rounded-3xl py-3" />
                <div className="absolute right-5 flex items-center space-x-4 inset-y-0  sm:flex ">
                    <PhoneIcon className='size8 text-white hover:bg-gray-300 focus:outline-none' />
                    <VideoIcon className='size8 text-white hover:bg-gray-300 focus:outline-none' />
                    <InfoIcon className='size8 text-white hover:bg-gray-300 focus:outline-none' />
                </div>
            </div>
        </div>

    );
}