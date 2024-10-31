import { useState } from 'react';
import { IoMdHome } from "react-icons/io";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import AppLogo from '../../components/common/AppLogo';
export default function LeftNavbar() {
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered1, setIsHovered1] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);
    const [isHovered3, setIsHovered3] = useState(false);
    return (
        <div className="w-[250px] overflow-y-visible overflow-x-visible h-full top-0 rounded-bl-none rounded-tr-none rounded-tl-none rounded-br-none bg-transparent fixed flex-col flex box-border flex-shrink-0 items-stretch justify-start z-10 flex-grow-0 ">
            <div className="h-full flex justify-between relative">
                <div className="translate-x-0 border-solid border-r-2 z-1 w-full">
                    <div className="translate-x-0 pb-5 pt-2 h-full px-3 flex-col box-border flex items-start">
                        <div className="w-full grow ">
                            <div className="bg-black">                                
                                <AppLogo />
                            </div>
                            <div className="relative top-20" 
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                style={{
                                    backgroundColor: isHovered ? '#f0f0f0' : 'transparent',
                                    display: 'inline-block',
                                    width: '100%',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                <span className="">
                                    <div className="relative">
                                        <a className="no-underline p-0 m-0 border-y-0 border-none inline bg-transparent touch-manipulation box-border cursor-pointer list-none outline-none " href="">
                                            <div className="p-3 w-full items-center flex-row my-1 rounded-lg box-border inline-flex ">
                                                <div className="cursor-pointer">
                                                    <div className="overflow-visible bg-transparent flex-col box-boder flex rounded-none items-stretch justify-start relative cursor-pointer list-none">
                                                        <div className="h-6 w-6 box-border transition-transform cursor-pointer list-none" >
                                                            <IoMdHome className="w-6 text-2xl" />
                                                            <img className="relative block text-gray-800" src="" alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="opacity-100 flex h-6 w-fit overflow-hidden box-border items-center pl-4 cursor-pointer list-none">
                                                    <div className="w-full cursor-pointer list-none">
                                                        <span className="overflow-visible min-w-0 max-w-full text-base leading-loose text-gray-800 font-bold break-words relative block whitespace-pre-line font-sans cursor-pointer list-none">
                                                            <span className="overflow-hidden max-w-full whitespace-nowrap text-ellipsis block text-base leading-loose text-gray-800 font-bold break-words relative font-sans cursor-pointer list-none">Trang chủ</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </span>
                            </div>
                            <div className="relative top-20"
                                onMouseEnter={() => setIsHovered1(true)}
                                onMouseLeave={() => setIsHovered1(false)}
                                style={{
                                    backgroundColor: isHovered1 ? '#f0f0f0' : 'transparent',
                                    display: 'inline-block',
                                    width: '100%',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                <span className="">
                                    <div className="relative">
                                        <a className="no-underline p-0 m-0 border-y-0 border-none inline bg-transparent touch-manipulation box-border cursor-pointer list-none outline-none " href="">
                                            <div className="p-3 w-full items-center flex-row my-1 rounded-lg box-border inline-flex ">
                                                <div className="cursor-pointer">
                                                    <div className="overflow-visible bg-transparent flex-col box-boder flex rounded-none items-stretch justify-start relative cursor-pointer list-none">
                                                        <div className="h-6 w-6 box-border transition-transform cursor-pointer list-none">
                                                            <FaFacebookMessenger className="w-6 text-2xl" />
                                                            <img className="relative block text-gray-800" src="" alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="opacity-100 flex h-6 w-fit overflow-hidden box-border items-center pl-4 cursor-pointer list-none">
                                                    <div className="w-full cursor-pointer list-none">
                                                        <span className="overflow-visible min-w-0 max-w-full text-base leading-loose text-gray-800 font-bold break-words relative block whitespace-pre-line font-sans cursor-pointer list-none">
                                                            <span className="overflow-hidden max-w-full whitespace-nowrap text-ellipsis block text-base leading-loose text-gray-800 font-bold break-words relative font-sans cursor-pointer list-none">Tin nhắn</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </span>
                            </div>
                            <div className="relative top-20"
                                onMouseEnter={() => setIsHovered2(true)}
                                onMouseLeave={() => setIsHovered2(false)}
                                style={{
                                    backgroundColor: isHovered2 ? '#f0f0f0' : 'transparent',
                                    display: 'inline-block',
                                    width: '100%',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                <span className="">
                                    <div className="relative">
                                        <a className="no-underline p-0 m-0 border-y-0 border-none inline bg-transparent touch-manipulation box-border cursor-pointer list-none outline-none " href="">
                                            <div className="p-3 w-full items-center flex-row my-1 rounded-lg box-border inline-flex ">
                                                <div className="cursor-pointer">
                                                    <div className="overflow-visible bg-transparent flex-col box-boder flex rounded-none items-stretch justify-start relative cursor-pointer list-none">
                                                        <div className="h-6 w-6 box-border transition-transform cursor-pointer list-none">
                                                            <IoNotifications className="w-6 text-2xl" />
                                                            <img className="relative block text-gray-800" src="" alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="opacity-100 flex h-6 w-fit overflow-hidden box-border items-center pl-4 cursor-pointer list-none">
                                                    <div className="w-full cursor-pointer list-none">
                                                        <span className="overflow-visible min-w-0 max-w-full text-base leading-loose text-gray-800 font-bold break-words relative block whitespace-pre-line font-sans cursor-pointer list-none">
                                                            <span className="overflow-hidden max-w-full whitespace-nowrap text-ellipsis block text-base leading-loose text-gray-800 font-bold break-words relative font-sans cursor-pointer list-none">Thông báo</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </span>
                            </div>
                            <div className="relative top-20"
                                onMouseEnter={() => setIsHovered3(true)}
                                onMouseLeave={() => setIsHovered3(false)}
                                style={{
                                    backgroundColor: isHovered3 ? '#f0f0f0' : 'transparent',
                                    display: 'inline-block',
                                    width: '100%',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                <span className="">
                                    <div className="relative">
                                        <a className="no-underline p-0 m-0 border-y-0 border-none inline bg-transparent touch-manipulation box-border cursor-pointer list-none outline-none " href="">
                                            <div className="p-3 w-full items-center flex-row my-1 rounded-lg box-border inline-flex ">
                                                <div className="cursor-pointer">
                                                    <div className="overflow-visible bg-transparent flex-col box-boder flex rounded-none items-stretch justify-start relative cursor-pointer list-none">
                                                        <div className="h-6 w-6 box-border transition-transform cursor-pointer list-none">
                                                            <img className="relative block text-gray-800 rounded-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUr6X3APT0LPEzloAeZpOgzGgC8EOp5oMZYg&s" alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="opacity-100 flex h-6 w-fit overflow-hidden box-border items-center pl-4 cursor-pointer list-none">
                                                    <div className="w-full cursor-pointer list-none">
                                                        <span className="overflow-visible min-w-0 max-w-full text-base leading-loose text-gray-800 font-bold break-words relative block whitespace-pre-line font-sans cursor-pointer list-none">
                                                            <span className="overflow-hidden max-w-full whitespace-nowrap text-ellipsis block text-base leading-loose text-gray-800 font-bold break-words relative font-sans cursor-pointer list-none">Trang cá nhân</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}