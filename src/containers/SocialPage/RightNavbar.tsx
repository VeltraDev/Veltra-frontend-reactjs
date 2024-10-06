import { useState } from 'react';

export default function RightNavbar () {
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered1, setIsHovered1] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const handleClick = () => {
        setIsFollowing(!isFollowing);
    }
    const [isFollowing1, setIsFollowing1] = useState(false);
    const handleClick1 = () => {
        setIsFollowing1(!isFollowing1);
    }
    const [isFollowing2, setIsFollowing2] = useState(false);
    const handleClick2 = () => {
        setIsFollowing2(!isFollowing2);
    }
    const [isFollowing3, setIsFollowing3] = useState(false);
    const handleClick3 = () => {
        setIsFollowing3(!isFollowing3);
    }
    return (
        <div className="w-[400px] h-[600px] text-white text-base pr-[100px]">
            <div className="mt-9 overflow-visible rounded-none bg-transparent flex-col box-border flex static items-stretch justify-start text-white text-base">
                <div className="overflow-visible rounded-none bg-transparent flex-col flex flex-shrink-0 static items-stretch self-auto justify-start px-4 flex-grow-0 text-white text-base">
                    <div className="w-full overflow-visible rounded-none bg-transparent flex-col flex flex-shrink-0 static items-stretch self-auto justify-start mr-2 text-white text-base">
                        <div className="w-full max-w-full rounded-none block">
                            <div className="min-w-0 justify-center flex-col box-border flex items-stretch relative z-0 flex-grow text-white text-base">
                                <div className="flex-nowrap box-border flex items-center flex-shrink-0 justify-between flex-row relative z-0 text-white text-base">
                                    <div className="min-w-0 max-w-full flex-col self-auto box-border flex flex-shrink-0 relative z-0 text-white text-base">
                                        <a className="w-11 h-11 m-0 p-0 rounded-full min-w-0 overflow-hidden border-solid touch-manipulation flex-col box-border flex cursor-pointer outline-none items-stretch relative z-0 list-none" href="">
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUr6X3APT0LPEzloAeZpOgzGgC8EOp5oMZYg&s" alt="" />
                                        </a>
                                    </div>
                                    <div className="min-w-0 flex-shrink basis-auto box-border flex items-center justify-between z-0 flex-grow flex-wrap">
                                        <div className="min-w-0 max-w-full flex-col box-border flex flex-shrink-0 relative z-0 flex-grow">
                                            <div className="overflow-visible min-w-0 min-h-0 rounded-none flex-col box-border flex static select-auto flex-grow items-start">
                                                <div className="overflow-visible min-w-0 min-h-0 rounded-none bg-transparent flex-row box-border flex static select-auto flex-grow items-stretch">
                                                    <a className="p-0 m-0 rounded-none overflow-hidden inline text-ellipsis bg-transparent touch-manipulation cursor-pointer list-none outline-none font-semibold text-black" href="">khang.doan.17</a>
                                                </div>
                                                <span className="overflow-visible min-w-0 max-w-full text-base text-gray-400 break-words relative block whitespace-pre-line ">Vĩnh Khang</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="min-w-0 max-w-full flex-col self-center box-border flex flex-shrink-0 relative z-0 ">
                                        <div className="overflow-visible flex-shrink rounded-none bg-transparent flex-row box-border flex static select-auto flex-grow-0 justify-start ml-3 items-stretch">
                                            <div className="h-auto p-0 m-0 min-w-0 rounded-none w-auto text-ellipsis bg-transparent touch-manipulation basis-auto box-border items-start inline-flex text-center cursor-pointer flex-row relative text-base text-blue-400 list-none outline-none">Chuyển</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overflow-visible mt-6 mb-2 bg-transparent rounded-none flex-col box-border flex flex-shrink-0 static select-auto items-stretch justify-start flex-grow-0">
                    <div className="overflow-visible mx-4 bg-transparent rounded-none flex-col box-border flex flex-shrink-0 static select-auto items-stretch justify-start flex-grow-0">
                        <div className="mb-3 mt-0 flex flex-col">
                            <div className="overflow-visible pb-2 px-4 bg-transparent rounded-none flex-row box-border flex flex-shrink-0 relative select-auto items-center justify-start flex-grow-0">
                                <div 
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    style={{
                                        color: isHovered ? 'black' : 'transparent',                                    
                                        cursor: 'pointer',
                                    }}
                                    className="overflow-visible min-w-0 min-h-0 bg-transparent rounded-none flex-col box-border flex relative select-auto items-start justify-start flex-grow">
                                    <span 
                                        className="overflow-visible min-w-0 max-w-full text-base text-gray-400 break-words relative block whitespace-pre-line right-4"
                                        style={{ color: isHovered ? 'black' : 'gray' }}>
                                            Gợi ý cho bạn
                                    </span>
                                </div >
                                <a 
                                    onMouseEnter={() => setIsHovered1(true)}
                                    onMouseLeave={() => setIsHovered1(false)}
                                    style={{
                                        color: isHovered1 ? 'black' : 'transparent',                                    
                                        cursor: 'pointer',
                                    }}
                                    className="m-0 touch-manipulation box-border cursor-pointer list-none outline-none" href="">
                                    <span 
                                        style={{ color: isHovered1 ? 'black' : 'gray' }}
                                        className="overflow-visible min-w-0 max-w-full text-base text-gray-400 break-words relative block whitespace-pre-line left-4">
                                            Xem tất cả~
                                        </span>
                                </a>
                            </div>
                            <div className="">
                                <div className="mb-4 flex-nowrap box-border flex items-center flex-shrink-0 justify-between flex-row relative z-0 text-white text-base">
                                    <div className="min-w-0 max-w-full flex-col self-auto box-border flex flex-shrink-0 relative z-0 text-white text-base">
                                        <a className="w-11 h-11 m-0 p-0 rounded-full min-w-0 overflow-hidden border-solid touch-manipulation flex-col box-border flex cursor-pointer outline-none items-stretch relative z-0 list-none" href="">
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUr6X3APT0LPEzloAeZpOgzGgC8EOp5oMZYg&s" alt="" />
                                        </a>
                                    </div>
                                    <div className="min-w-0 flex-shrink basis-auto box-border flex items-center justify-between z-0 flex-grow flex-wrap">
                                        <div className="min-w-0 max-w-full flex-col box-border flex flex-shrink-0 relative z-0 flex-grow">
                                            <div className="overflow-visible min-w-0 min-h-0 rounded-none flex-col box-border flex static select-auto flex-grow items-start">
                                                <div className="overflow-visible min-w-0 min-h-0 rounded-none bg-transparent flex-row box-border flex static select-auto flex-grow items-stretch">
                                                    <a className="p-0 m-0 rounded-none overflow-hidden inline text-ellipsis bg-transparent touch-manipulation cursor-pointer list-none outline-none font-semibold text-black" href="">thuan.quach.16</a>
                                                </div>
                                                <span className="overflow-visible min-w-0 max-w-full text-base text-gray-400 break-words relative block whitespace-pre-line ">Đang theo dõi</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="min-w-0 max-w-full flex-col self-center box-border flex flex-shrink-0 relative z-0 ">
                                        <div className="overflow-visible flex-shrink rounded-none bg-transparent flex-row box-border flex static select-auto flex-grow-0 justify-start ml-3 items-stretch">
                                            <div 
                                                className="h-auto p-0 m-0 min-w-0 rounded-none w-auto text-ellipsis bg-transparent touch-manipulation basis-auto box-border items-start inline-flex text-center cursor-pointer flex-row relative text-base text-blue-400 list-none outline-none"
                                                onClick={handleClick}
                                                style={{
                                                    color: isFollowing ? '#9CA3AF' : '#60A5FA', 
                                                    cursor: 'pointer',
                                                    border: 'none',
                                                    background: 'transparent',
                                                    fontSize: '16px',
                                                }}
                                                >
                                                {isFollowing ? 'Đã theo dõi' : 'Theo dõi'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4 flex-nowrap box-border flex items-center flex-shrink-0 justify-between flex-row relative z-0 text-white text-base">
                                    <div className="min-w-0 max-w-full flex-col self-auto box-border flex flex-shrink-0 relative z-0 text-white text-base">
                                        <a className="w-11 h-11 m-0 p-0 rounded-full min-w-0 overflow-hidden border-solid touch-manipulation flex-col box-border flex cursor-pointer outline-none items-stretch relative z-0 list-none" href="">
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUr6X3APT0LPEzloAeZpOgzGgC8EOp5oMZYg&s" alt="" />
                                        </a>
                                    </div>
                                    <div className="min-w-0 flex-shrink basis-auto box-border flex items-center justify-between z-0 flex-grow flex-wrap">
                                        <div className="min-w-0 max-w-full flex-col box-border flex flex-shrink-0 relative z-0 flex-grow">
                                            <div className="overflow-visible min-w-0 min-h-0 rounded-none flex-col box-border flex static select-auto flex-grow items-start">
                                                <div className="overflow-visible min-w-0 min-h-0 rounded-none bg-transparent flex-row box-border flex static select-auto flex-grow items-stretch">
                                                    <a className="p-0 m-0 rounded-none overflow-hidden inline text-ellipsis bg-transparent touch-manipulation cursor-pointer list-none outline-none font-semibold text-black" href="">kien.le.41</a>
                                                </div>
                                                <span className="overflow-visible min-w-0 max-w-full text-base text-gray-400 break-words relative block whitespace-pre-line ">Đang theo dõi</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="min-w-0 max-w-full flex-col self-center box-border flex flex-shrink-0 relative z-0 ">
                                        <div className="overflow-visible flex-shrink rounded-none bg-transparent flex-row box-border flex static select-auto flex-grow-0 justify-start ml-3 items-stretch">
                                            <div 
                                                className="h-auto p-0 m-0 min-w-0 rounded-none w-auto text-ellipsis bg-transparent touch-manipulation basis-auto box-border items-start inline-flex text-center cursor-pointer flex-row relative text-base text-blue-400 list-none outline-none"
                                                onClick={handleClick1}
                                                style={{
                                                    color: isFollowing1 ? '#9CA3AF' : '#60A5FA', 
                                                    cursor: 'pointer',
                                                    border: 'none',
                                                    background: 'transparent',
                                                    fontSize: '16px',
                                                }}
                                                >
                                                {isFollowing1 ? 'Đã theo dõi' : 'Theo dõi'}
                                                </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4 flex-nowrap box-border flex items-center flex-shrink-0 justify-between flex-row relative z-0 text-white text-base">
                                    <div className="min-w-0 max-w-full flex-col self-auto box-border flex flex-shrink-0 relative z-0 text-white text-base">
                                        <a className="w-11 h-11 m-0 p-0 rounded-full min-w-0 overflow-hidden border-solid touch-manipulation flex-col box-border flex cursor-pointer outline-none items-stretch relative z-0 list-none" href="">
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUr6X3APT0LPEzloAeZpOgzGgC8EOp5oMZYg&s" alt="" />
                                        </a>
                                    </div>
                                    <div className="min-w-0 flex-shrink basis-auto box-border flex items-center justify-between z-0 flex-grow flex-wrap">
                                        <div className="min-w-0 max-w-full flex-col box-border flex flex-shrink-0 relative z-0 flex-grow">
                                            <div className="overflow-visible min-w-0 min-h-0 rounded-none flex-col box-border flex static select-auto flex-grow items-start">
                                                <div className="overflow-visible min-w-0 min-h-0 rounded-none bg-transparent flex-row box-border flex static select-auto flex-grow items-stretch">
                                                    <a className="p-0 m-0 rounded-none overflow-hidden inline text-ellipsis bg-transparent touch-manipulation cursor-pointer list-none outline-none font-semibold text-black" href="">duc.nguyen.34</a>
                                                </div>
                                                <span className="overflow-visible min-w-0 max-w-full text-base text-gray-400 break-words relative block whitespace-pre-line ">Đang theo dõi</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="min-w-0 max-w-full flex-col self-center box-border flex flex-shrink-0 relative z-0 ">
                                        <div className="overflow-visible flex-shrink rounded-none bg-transparent flex-row box-border flex static select-auto flex-grow-0 justify-start ml-3 items-stretch">
                                            <div 
                                                className="h-auto p-0 m-0 min-w-0 rounded-none w-auto text-ellipsis bg-transparent touch-manipulation basis-auto box-border items-start inline-flex text-center cursor-pointer flex-row relative text-base text-blue-400 list-none outline-none"
                                                onClick={handleClick2}
                                                style={{
                                                    color: isFollowing2 ? '#9CA3AF' : '#60A5FA', 
                                                    cursor: 'pointer',
                                                    border: 'none',
                                                    background: 'transparent',
                                                    fontSize: '16px',
                                                }}
                                                >
                                                {isFollowing2 ? 'Đã theo dõi' : 'Theo dõi'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4 flex-nowrap box-border flex items-center flex-shrink-0 justify-between flex-row relative z-0 text-white text-base">
                                    <div className="min-w-0 max-w-full flex-col self-auto box-border flex flex-shrink-0 relative z-0 text-white text-base">
                                        <a className="w-11 h-11 m-0 p-0 rounded-full min-w-0 overflow-hidden border-solid touch-manipulation flex-col box-border flex cursor-pointer outline-none items-stretch relative z-0 list-none" href="">
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUr6X3APT0LPEzloAeZpOgzGgC8EOp5oMZYg&s" alt="" />
                                        </a>
                                    </div>
                                    <div className="min-w-0 flex-shrink basis-auto box-border flex items-center justify-between z-0 flex-grow flex-wrap">
                                        <div className="min-w-0 max-w-full flex-col box-border flex flex-shrink-0 relative z-0 flex-grow">
                                            <div className="overflow-visible min-w-0 min-h-0 rounded-none flex-col box-border flex static select-auto flex-grow items-start">
                                                <div className="overflow-visible min-w-0 min-h-0 rounded-none bg-transparent flex-row box-border flex static select-auto flex-grow items-stretch">
                                                    <a className="p-0 m-0 rounded-none overflow-hidden inline text-ellipsis bg-transparent touch-manipulation cursor-pointer list-none outline-none font-semibold text-black" href="">quan.tran.17</a>
                                                </div>
                                                <span className="overflow-visible min-w-0 max-w-full text-base text-gray-400 break-words relative block whitespace-pre-line ">Đang theo dõi</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="min-w-0 max-w-full flex-col self-center box-border flex flex-shrink-0 relative z-0 ">
                                        <div className="overflow-visible flex-shrink rounded-none bg-transparent flex-row box-border flex static select-auto flex-grow-0 justify-start ml-3 items-stretch">
                                            <div 
                                                className="h-auto p-0 m-0 min-w-0 rounded-none w-auto text-ellipsis bg-transparent touch-manipulation basis-auto box-border items-start inline-flex text-center cursor-pointer flex-row relative text-base text-blue-400 list-none outline-none"
                                                onClick={handleClick3}
                                                style={{
                                                    color: isFollowing3 ? '#9CA3AF' : '#60A5FA', 
                                                    cursor: 'pointer',
                                                    border: 'none',
                                                    background: 'transparent',
                                                    fontSize: '16px',
                                                }}
                                                >
                                                {isFollowing3 ? 'Đã theo dõi' : 'Theo dõi'}
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overflow-visible mt-6 mb-2 bg-transparent px-4 rounded-none flex-col box-border flex flex-shrink-0 static select-auto items-start justify-start flex-grow-0">
                    <div className="pt-0">
                        <nav className="flex flex-col mb-4 max-w-full">
                            <ul className="mr-0 border-0 flex-grow text-base mb-1 align-baseline">
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <a className="text-xs text-gray-400 font-normal normal-case cursor-pointer" href="">
                                        <span className="overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line">Giới thiệu</span>        
                                    </a>
                                </li>
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <span className="px-1 overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line"> . </span>                  
                                </li>
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <a className="text-xs text-gray-400 font-normal normal-case cursor-pointer" href="">
                                        <span className="overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line">Trợ giúp</span>        
                                    </a>
                                </li>
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <span className="px-1 overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line"> . </span>                  
                                </li>
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <a className="text-xs text-gray-400 font-normal normal-case cursor-pointer" href="">
                                        <span className="overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line">Báo chí</span>        
                                    </a>
                                </li>
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <span className="px-1 overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line"> . </span>                  
                                </li>
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <a className="text-xs text-gray-400 font-normal normal-case cursor-pointer" href="">
                                        <span className="overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line">API</span>        
                                    </a>
                                </li>
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <span className="px-1 overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line"> . </span>                  
                                </li>
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <a className="text-xs text-gray-400 font-normal normal-case cursor-pointer" href="">
                                        <span className="overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line">Việt làm</span>        
                                    </a>
                                </li>
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <span className="px-1 overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line"> . </span>                  
                                </li>
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <a className="text-xs text-gray-400 font-normal normal-case cursor-pointer" href="">
                                        <span className="overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line">Quyền riêng tư</span>        
                                    </a>
                                </li>
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <span className="px-1 overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line"> . </span>                  
                                </li>
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <a className="text-xs text-gray-400 font-normal normal-case cursor-pointer" href="">
                                        <span className="overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line">Điều khoản</span>        
                                    </a>
                                </li>
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <span className="px-1 overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line"> . </span>                  
                                </li>
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <a className="text-xs text-gray-400 font-normal normal-case cursor-pointer" href="">
                                        <span className="overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line">Vị trí</span>        
                                    </a>
                                </li>
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <span className="px-1 overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line"> . </span>                  
                                </li>
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <a className="text-xs text-gray-400 font-normal normal-case cursor-pointer" href="">
                                        <span className="overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line">Ngôn ngữ</span>        
                                    </a>
                                </li>
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <span className="px-1 overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line"> . </span>                  
                                </li>
                                <li className="text-xs text-gray-400 font-normal normal-case inline-flex flex-row m-0 p-0 align-baseline border-0 ">
                                    <a className="text-xs text-gray-400 font-normal normal-case cursor-pointer" href="">
                                        <span className="overflow-visible min-w-0 max-w-full font-normal text-xs text-gray-400 break-words relative block whitespace-pre-line">Veltra đã xác định</span>        
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        <span className="uppercase text-gray-400 text-xs font-normal align-baseline m-0 p-0 ">© 2024 VELTRA FROM NHOM03</span>
                    </div>
                </div>
            </div>
        </div>
    )
}