import { HomeIcon, LogOutIcon, PhoneIcon, SearchIcon, UsersIcon, ZapIcon } from 'lucide-react';
import React, { useState } from 'react';
import SearchPanel from './SearchPanek';

import logo from '../../assets/logo1.svg'


const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
    <li>
        <a
            href="#"
            className="group relative flex justify-center rounded px-2 py-1.5 text-white hover:bg-gray-800 hover:text-white"
            onClick={onClick}
        >
            {icon}
            <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-700 px-2 py-1.5 text-sm font-medium text-white group-hover:visible">
                {label}
            </span>
        </a>
    </li>
);

const Sidebar: React.FC = () => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    return (
        <>
            <div className="flex h-screen py-8 max-w-[72px] flex-col justify-between border-e border-gray-800 bg-black">
                
                <ul className="space-y-9 border-gray-800">
            
                    <SidebarItem icon={<img src={logo} className='w-40'></img>} label="General" />
                    {/* <SidebarItem icon={<ZapIcon className='text-purple-500' />} label="General" /> */}
                    <SidebarItem icon={<HomeIcon />} label="Home" />
                    <SidebarItem icon={<SearchIcon />} label="Search" onClick={toggleSearch} />
                    <SidebarItem icon={<PhoneIcon />} label="Phone" />
                    <SidebarItem icon={<UsersIcon />} label="Teams" />
                </ul>
                <div className="sticky inset-x-0 bottom-0  border-gray-800 bg-black p-2">
                    <form action="#">
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-white hover:bg-gray-800 hover:text-white"
                        >
                            <LogOutIcon className="size-5 opacity-75" />
                            <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-700 px-2 py-1.5 text-sm font-medium text-white group-hover:visible">
                                Logout
                            </span>
                        </button>
                    </form>
                </div>
             
            </div>
            <SearchPanel isVisible={isSearchVisible} />
        </>
    );
};

export default Sidebar;