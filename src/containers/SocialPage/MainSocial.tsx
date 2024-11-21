import { useState } from 'react';
import { GoHeart } from "react-icons/go";
import { FaFacebookMessenger } from "react-icons/fa";
import RightNavbar from './RightNavbar';
import LeftNavbar from './LeftNavbar';
export default function MainSocial() {
    const [isActive, setIsActive] = useState(false);
    const handleClick = () => {
        setIsActive(!isActive);
    };
    return (
        <div className="bg-white text-black leading-5 m-0 p-0 ">
            <div className="block text-black leading-5">
                <div className="flex-col flex relative top-12">
                    <div className="flex-col flex relative z-0 ">
                        <div className="min-w-[320px] flex-nowrap justify-center box-border flex shrink items-stretch flex-row relative z-0">
                            <div className="min-w-0 max-w-full shrink flex-nowrap box-border flex basis-0 justify-between flex-row relative z-0 grow items-start">
                                <LeftNavbar />
                                <div className="min-w-0 shrink px-8 flex-nowrap justify-center box-border flex items-stretch flex-row relative z-0 grow ">
                                    <div className="min-w-0 max-w-full flex-col box-border flex shrink-0 relative z-0 left-32">
                                        <div className="box-border relative z-0 ">
                                            <div className="justify-center flex flex-row ">
                                                <div className="w-[500px] max-w-full">
                                                    <div className="w-[500px] max-w-[500px] my-0 mx-auto"></div>
                                                    <div className="mb-4 ">
                                                        <div className="w-full py-0 px-0 my-0 mx-0 flex relative">
                                                            <div className="w-full overflow-hidden shadow-md relative bg-white z-0">
                                                                <div className="font-sans pt-3 pb-2 flex items-center py-4 flex-wrap z-50">                                                                  
                                                                    <div className="w-full border-y-gray-400 overflow-hidden h-10 border-t-0 mt-3 border-solid flex justify-around flex-wrap">
                                                                        <div className="right-[86px] my-0 border-t-0 min-h-0 border-solid flex flex-shrink justify-center bg-transparent rounded-md touch-manipulation box-border items-center cursor-pointer basis-0 relative flex-row mx-0 z-0 grow ">
                                                                            <div className="overflow-hidden justify-center flex items-center cursor-pointer list-none ">
                                                                                <span className="inline-flex flex-shrink-0 mr-2 flex-grow-0 cursor-pointer ">
                                                                                    <img className="border-gray-400 border-2 object-fill w-10 rounded-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUr6X3APT0LPEzloAeZpOgzGgC8EOp5oMZYg&s" alt="" />
                                                                                </span>  
                                                                            </div>
                                                                            <div className="opacity-0 pointer-events-none transition-opacity absolute cursor-pointer list-none"></div>
                                                                        </div>
                                                                        <div className="right-[185px] my-0 border-t-0 min-h-0 border-solid flex flex-shrink justify-center bg-transparent rounded-md touch-manipulation box-border items-center cursor-pointer basis-0 relative flex-row mx-0 z-0 grow ">
                                                                            <div className="bg-gray-200 py-2 h-auto m-0 border-y-0 border-none min-h-10 px-3 touch-manipulation box-border flex items-center cursor-pointer flex-row justify-start relative grow outline-none rounded-3xl list-none">
                                                                                <div className="w-full hyphens-auto text-gray-800 break-words text-base cursor-pointer list-none">
                                                                                    <span className="overflow-hidden relative hyphens-auto text-gray-800 break-words text-base cursor-pointer list-none">Bạn đang nghĩ gì?</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="opacity-0 pointer-events-none transition-opacity absolute cursor-pointer list-none"></div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="w-full border-t-gray-400 overflow-hidden pt-2 h-10 border-t-0 mt-3 border-solid flex justify-around flex-wrap">
                                                                        <div className="p-2 my-0 border-t-0 min-h-0 border-solid flex flex-shrink justify-center bg-transparent rounded-md touch-manipulation box-border items-center cursor-pointer basis-0 relative flex-row mx-0 z-0 grow ">
                                                                            <div className="overflow-hidden justify-center flex items-center cursor-pointer list-none ">
                                                                                <span className="inline-flex flex-shrink-0 mr-2 flex-grow-0 cursor-pointer ">
                                                                                    <img className="object-fill " src="https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/c0dWho49-X3.png?_nc_eui2=AeHP3CNYcQm3L4_1thPgHJYbVnUPE18ZZ-dWdQ8TXxln5wpR-RjQixk3hO3fqI7ArK-kWt6M6k6xw5dzFkm2HOqm" alt="" />
                                                                                </span>
                                                                                <span className="min-w-0 max-w-full leading-5 text-gray-500 text-sm break-words font-semibold block cursor-pointer list-none">
                                                                                    <span className="overflow-hidden whitespace-nowrap text-ellipsis relative block leading-5 text-sm break-words font-semibold cursor-pointer list-none ">Video trực tiếp</span>
                                                                                </span>
                                                                            </div>
                                                                            <div className="opacity-0 pointer-events-none transition-opacity absolute cursor-pointer list-none"></div>
                                                                        </div>
                                                                        <div className="p-2 my-0 border-t-0 min-h-0 border-solid flex flex-shrink justify-center bg-transparent rounded-md touch-manipulation box-border items-center cursor-pointer basis-0 relative flex-row mx-0 z-0 grow ">
                                                                            <div className="overflow-hidden justify-center flex items-center cursor-pointer list-none ">
                                                                                <span className="inline-flex flex-shrink-0 mr-2 flex-grow-0 cursor-pointer ">
                                                                                    <img className="object-fill " src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeF7k7cIwPMB-wA2vrr1q8IlPL4YoeGsw5I8vhih4azDkuo52odSzcBdRAQ0a-kAM8RfLBoJoIJ1BL2u3J3Vjxn9" alt="" />
                                                                                </span>
                                                                                <span className="min-w-0 max-w-full leading-5 text-gray-500 text-sm break-words font-semibold block cursor-pointer list-none">
                                                                                    <span className="overflow-hidden whitespace-nowrap text-ellipsis relative block leading-5 text-sm break-words font-semibold cursor-pointer list-none ">Ảnh/Video</span>
                                                                                </span>
                                                                            </div>
                                                                            <div className="opacity-0 pointer-events-none transition-opacity absolute cursor-pointer list-none"></div>
                                                                        </div>
                                                                        <div className="p-2 my-0 border-t-0 min-h-0 border-solid flex flex-shrink justify-center bg-transparent rounded-md touch-manipulation box-border items-center cursor-pointer basis-0 relative flex-row mx-0 z-0 grow ">
                                                                            <div className="overflow-hidden justify-center flex items-center cursor-pointer list-none ">
                                                                                <span className="inline-flex flex-shrink-0 mr-2 flex-grow-0 cursor-pointer ">
                                                                                    <img className="object-fill " src="https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeGlkbr8kyWgcfYAoNB4hHaEvPIN-OmHLJy88g346YcsnAbXv4t0_OqNrq_uE9SVg2FRQ1LZGQIi71zrU69OPGdE" alt="" />
                                                                                </span>
                                                                                <span className="min-w-0 max-w-full leading-5 text-gray-500 text-sm break-words font-semibold block cursor-pointer list-none">
                                                                                    <span className="overflow-hidden whitespace-nowrap text-ellipsis relative block leading-5 text-sm break-words font-semibold cursor-pointer list-none ">Cảm xúc/Hoạt động</span>
                                                                                </span>
                                                                            </div>
                                                                            <div className="opacity-0 pointer-events-none transition-opacity absolute cursor-pointer list-none"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                                    
                                                    <div className="overflow-visible bg-transparent rounded-none flex-col box-border flex items-center static justify-start ">
                                                        <div className="w-full max-w-full overflow-visible bg-transparent rounded-none flex-col box-border flex items-center static justify-start self-auto">
                                                            <div className="w-full">
                                                                <div className="flex flex-col pt-0 pb-[6444px] relative text-black text-base ">
                                                                    <div className="mb-4 ">
                                                                        <div className="w-full py-0 px-0 my-0 mx-0 flex relative">
                                                                            <div className="w-full overflow-hidden relative bg-white z-0">
                                                                                <div className="font-sans pt-3 pb-2 flex items-center py-4 flex-wrap z-50">                                                                  
                                                                                    <div className="w-full border-t-gray-400 overflow-hidden h-10 border-t-0 mt-3 border-solid flex justify-around flex-wrap">
                                                                                        <div className="right-[47px] my-0 border-t-0 min-h-0 border-solid flex flex-shrink justify-center bg-transparent rounded-md touch-manipulation box-border items-center cursor-pointer basis-0 relative flex-row mx-0 z-0 grow ">
                                                                                            <div className="overflow-hidden justify-center flex items-center cursor-pointer list-none ">
                                                                                                <span className="inline-flex flex-shrink-0 mr-2 flex-grow-0 cursor-pointer ">
                                                                                                    <img className="border-gray-400 border-2 object-fill w-10 rounded-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUr6X3APT0LPEzloAeZpOgzGgC8EOp5oMZYg&s" alt="" />
                                                                                                </span>  
                                                                                            </div>
                                                                                            <div className="opacity-0 pointer-events-none transition-opacity absolute cursor-pointer list-none"></div>
                                                                                        </div>
                                                                                        <div className="right-[110px] my-0 border-t-0 min-h-0 border-solid flex flex-shrink justify-center bg-transparent rounded-md touch-manipulation box-border items-center cursor-pointer basis-0 relative flex-row mx-0 z-0 grow ">
                                                                                            <div className="py-2 h-auto m-0 border-y-0 border-none min-h-10 px-3 touch-manipulation box-border flex items-center cursor-pointer flex-row justify-start relative grow outline-none rounded-3xl list-none">
                                                                                                <div className="w-full hyphens-auto text-gray-800 break-words text-base cursor-pointer list-none">
                                                                                                    <span className="overflow-hidden relative hyphens-auto text-black break-words text-base font-semibold cursor-pointer list-none">_khangdoan_</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="opacity-0 pointer-events-none transition-opacity absolute cursor-pointer list-none"></div>
                                                                                        </div>
                                                                                        <div className="right-[170px] my-0 border-t-0 min-h-0 border-solid flex flex-shrink justify-center bg-transparent rounded-md touch-manipulation box-border items-center cursor-pointer basis-0 relative flex-row mx-0 z-0 grow ">
                                                                                            <div className="py-2 h-auto m-0 border-y-0 border-none min-h-10 px-3 touch-manipulation box-border flex items-center cursor-pointer flex-row justify-start relative grow outline-none rounded-3xl list-none">
                                                                                                <div className="w-full hyphens-auto text-gray-800 break-words text-base cursor-pointer list-none">
                                                                                                    <span className="overflow-hidden relative hyphens-auto text-gray-400 break-words text-base cursor-pointer list-none">10 giờ</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="opacity-0 pointer-events-none transition-opacity absolute cursor-pointer list-none"></div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="w-full border-t-gray-400 overflow-hidden border-t-0 mt-3 border-solid flex justify-around flex-wrap">
                                                                                        <div className="right-[47px] my-0 border-t-0 min-h-0 border-solid flex flex-shrink justify-center bg-transparent rounded-md touch-manipulation box-border items-center cursor-pointer basis-0 relative flex-row mx-0 z-0 grow ">
                                                                                            <div className="overflow-hidden justify-center flex items-center cursor-pointer list-none ">
                                                                                                <span className="inline-flex flex-shrink-0 mr-2 flex-grow-0 cursor-pointer ">
                                                                                                    <img className="w-[470px] h-[580px] ml-[170px]" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUr6X3APT0LPEzloAeZpOgzGgC8EOp5oMZYg&s" alt="" />
                                                                                                </span>  
                                                                                            </div>
                                                                                            <div className="opacity-0 pointer-events-none transition-opacity absolute cursor-pointer list-none"></div>
                                                                                        </div>                                       
                                                                                    </div>
                                                                                    <div className="w-full border-t-gray-400 overflow-hidden pt-2 h-10 border-t-0 mt-3 border-solid flex justify-around flex-wrap">
                                                                                        <div className="p-2 my-0 border-t-0 min-h-0 border-solid flex flex-shrink bg-transparent rounded-md touch-manipulation box-border items-center cursor-pointer basis-0 relative flex-row mx-0 z-0 grow ">
                                                                                            <div className="overflow-hidden justify-center flex items-center cursor-pointer list-none ">
                                                                                                <span className="inline-flex flex-shrink-0 mr-2 flex-grow-0 cursor-pointer ">
                                                                                                    <GoHeart 
                                                                                                        onClick={handleClick}
                                                                                                        style={{ color: isActive ? 'red' : 'black', cursor: 'pointer' }} // Changes color based on the state
                                                                                                        size={24}
                                                                                                        className="w-6 text-2xl"
                                                                                                    />
                                                                                                </span>     
                                                                                            </div>
                                                                                            <div className="opacity-0 pointer-events-none transition-opacity absolute cursor-pointer list-none"></div>
                                                                                        </div>
                                                                                        <div className="right-[200px] p-2 my-0 border-t-0 min-h-0 border-solid flex flex-shrink bg-transparent rounded-md touch-manipulation box-border items-center cursor-pointer basis-0 relative flex-row mx-0 z-0 grow ">
                                                                                            <div className="overflow-hidden justify-center flex items-center cursor-pointer list-none ">
                                                                                                <span className="inline-flex flex-shrink-0 mr-2 flex-grow-0 cursor-pointer ">
                                                                                                    <FaFacebookMessenger className="w-6 text-2xl" />
                                                                                                </span>  
                                                                                            </div>
                                                                                            <div className="opacity-0 pointer-events-none transition-opacity absolute cursor-pointer list-none"></div>
                                                                                        </div>                                             
                                                                                    </div>
                                                                                    <div className="w-full border-t-gray-400 overflow-hidden h-10 border-t-0 border-solid flex justify-around flex-wrap">
                                                                                        <div className="my-0 border-t-0 min-h-0 border-solid flex flex-shrink justify-center bg-transparent rounded-md touch-manipulation box-border items-center basis-0 relative flex-row mx-0 z-0 grow ">
                                                                                            <div className="h-auto m-0 border-y-0 border-none min-h-10 px-3 touch-manipulation box-border flex items-center flex-row justify-start relative grow outline-none rounded-3xl list-none">
                                                                                                <div className="w-full hyphens-auto text-gray-800 break-words text-base list-none">
                                                                                                    <span className="overflow-hidden relative hyphens-auto text-black break-words text-xs font-semibold list-none ">17.520 lượt thích</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="opacity-0 pointer-events-none transition-opacity absolute list-none"></div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="w-full border-t-gray-400 overflow-hidden h-10 border-t-0 border-solid flex justify-around flex-wrap">
                                                                                        <div className="my-0 border-t-0 min-h-0 border-solid flex flex-shrink justify-center bg-transparent rounded-md touch-manipulation box-border items-center basis-0 relative flex-row mx-0 z-0 grow ">
                                                                                            <div className="h-auto m-0 border-y-0 border-none min-h-10 px-3 touch-manipulation box-border flex items-center flex-row justify-start relative grow outline-none rounded-3xl list-none">
                                                                                                <div className="w-full hyphens-auto text-gray-800 break-words text-base  list-none">
                                                                                                    <span className="overflow-hidden relative hyphens-auto text-black break-words text-xs font-semibold list-none ">_khangdoan_</span>
                                                                                                    <span className="overflow-hidden relative hyphens-auto text-gray-600 break-words text-xs font-normal list-none ">đẹp trai, đẹp trai</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="opacity-0 pointer-events-none transition-opacity absolute list-none"></div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="w-full border-t-gray-400 overflow-hidden h-10 border-t-0 border-solid flex justify-around flex-wrap">
                                                                                        <div className="my-0 border-t-0 min-h-0 border-solid flex flex-shrink justify-center bg-transparent rounded-md touch-manipulation box-border items-center basis-0 relative flex-row mx-0 z-0 grow ">
                                                                                            <div className="h-auto m-0 border-y-0 border-none min-h-10 px-3 touch-manipulation box-border flex items-center flex-row justify-start relative grow outline-none rounded-3xl list-none">
                                                                                                <div className="w-full hyphens-auto text-gray-800 break-words text-base list-none">
                                                                                                    <span className="overflow-hidden relative hyphens-auto text-gray-600 break-words text-xs font-normal list-none cursor-pointer">Xem tất cả bình luận</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="opacity-0 pointer-events-none transition-opacity absolute list-none"></div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="w-full overflow-visible mt-2 bg-transparent rounded-none flex-col box-border flex static items-stretch justify-start">
                                                                                        <section className="w-full border-gray-300 border-none border-t-2 text-sm flex-shrink-0 relative text-gray-500 ">
                                                                                            <div className="p-0 border-y-2 border-gray-300 border-none flex items-center flex-row justify-start flex-wrap rounded-[38px]">
                                                                                                <form className="m-0 p-0 border-y-2 border-x-2 border-gray-300 border-none bg-gray-500 flex-shrink font-xs flex flex-grow rounded-[38px]" action="">
                                                                                                    <div className="p-0 m-0 flex-shrink flex items-center flex-row flex-grow align-baseline ">
                                                                                                        <div className=""></div>
                                                                                                        <textarea name="" id="" placeholder="Thêm bình luận..." className="max-h20 p-0 border-none flex-grow outline-none"></textarea>
                                                                                                    </div>
                                                                                                </form>
                                                                                            </div>
                                                                                        </section>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>   
                                </div>
                                <RightNavbar />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}