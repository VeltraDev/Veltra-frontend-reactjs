import { SearchIcon } from 'lucide-react'
import React from 'react'

interface SearchPanelProps {
  isVisible: boolean;
}

export default function SearchPanel({ isVisible }: SearchPanelProps) {
    return (
        <div className={`fixed top-0 ${isVisible ? 'left-20' : 'left-0'} z-10 h-full w-96 flex flex-col justify-between border-e border-gray-800 bg-black transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="px-4 py-8">
                <p className="text-2xl font-semibold pb-10">Tìm kiếm</p>

                <div className="relative">
                    <label htmlFor="Search" className="sr-only font-medium"> Search </label>

                    <input
                        type="text"
                        id="Search"
                        placeholder="Tìm kiếm"
                        className="w-full rounded-md  bg-[#363636] text-white py-2 pl-4 pe-10 shadow-sm lg:text-base font-light sm:text-sm"
                    />

                    <span className="absolute inset-y-0 end-0 grid w-10 place-content-center pr-2">
                        <button type="button" className="text-white hover:text-white">
                            <span className="sr-only">Search</span>

                            <SearchIcon className='size-5 ' />
                        </button>
                    </span>
                </div>
            </div>
        </div>
    )
}
