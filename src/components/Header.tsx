import { useState, useEffect } from 'react'
import AppLogo from './common/AppLogo';


export default function Header() {
    const [state, setState] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    // Replace  paths with your paths
    const navigation = [
        { title: "Trang chủ", path: "" },
        { title: "Giới thiệu", path: "" },
        { title: "Liên hệ", path: "" },
        { title: "Blog", path: "" }
    ]

    useEffect(() => {
        const handleScroll = () => {
            const nav = document.getElementById('header-nav');
            const navHeight = nav?.offsetHeight || 0;
            if (window.scrollY > navHeight) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav id="header-nav" className={`w-full md:text-sm z-50 transition-all duration-300 fixed top-0 left-0 ${isScrolled ? 'bg-black bg-opacity-70' : 'bg-transparent'}`}>
            <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
                <div className="flex items-center justify-between py-3 md:py-5 md:block">
                    <div className='py-1'>     <AppLogo /></div>
               
                
                    <div className="md:hidden">
                        <button className="text-white hover:text-yellow-300"
                            onClick={() => setState(!state)}
                        >
                            {
                                state ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                )
                            }
                        </button>
                    </div>
                </div>
                <div className={`flex-1 pb-3 mt-8 font-medium font-poppins md:block md:pb-0 md:mt-0 ${state ? 'block' : 'hidden'}`}>
                    <ul className="justify-end items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
                        {
                            navigation.map((item, idx) => {
                                return (
                                    <li key={idx} className="text-white text-base  hover:text-primary">
                                        <a href={item.path} className="block">
                                            {item.title}
                                        </a>
                                    </li>
                                )
                            })
                        }
                        <span className='hidden w-px h-6 bg-gray-300 md:block'></span>
                        <div className='space-y-3 items-center gap-x-6 md:flex md:space-y-0'>
                            <li>
                                <a href="" className="block py-3 text-center text-white hover:text-primary border rounded-lg md:border-none">
                                    Đăng nhập
                                </a>
                            </li>
                            <li>
                                <a href="" className="block py-3 px-4 font-medium text-center  text-white bg-primary hover:bg-primary active:bg-primary active:shadow-none rounded-lg shadow md:inline">
                                    Đăng ký
                                </a>
                            </li>
                        </div>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
