import { SearchIcon } from 'lucide-react'
import React from 'react'

export default function ChatList() {
  return (
      <div className="flex min-w-96 flex-col justify-between border-e border-gray-800 bg-black">
          <div className="px-4 py-8">
              <p className="text-xl font-bold pb-7">young.clement</p>
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
              <div className="mt-6">
                  <p className='font-semibold mb-3'>Nhóm</p>
                  <ul className="space-y-2">
                      <li>
                          <a href="#" className="flex items-center space-x-3 p-2 rounded-lg bg-secondary hover:bg-gray-700 transition-colors duration-200">
                              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">G</span>
                              </div>
                              <span className="text-white">General</span>
                          </a>
                      </li>
                      <li>
                          <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-se transition-colors duration-200">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">P</span>
                              </div>
                              <span className="text-white">Project A</span>
                          </a>
                      </li>
                      <li>
                          <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-se transition-colors duration-200">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">T</span>
                              </div>
                              <span className="text-white">Team Chat</span>
                          </a>
                      </li>
                  </ul>
              </div>
              <div className="mt-6">
                  <p className='font-semibold mb-3'>Tin nhắn</p>
                  <ul className="space-y-2">
                      <li>
                          <div className='flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200'>
                              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ7W7Gx6FdAJHJ-dSK-bjbTIbepuPUVI5t8Q&s" className='size-14 rounded-full object-cover' alt="User avatar" />
                              <div className='flex flex-col'>
                                  <p className='text-[0.9rem] font-medium text-white'>young.clement</p>
                                  <p className='text-xs text-gray-400 truncate'>Hello</p>
                              </div>
                         </div>
                      </li>
                      <li>
                          <div className='flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200'>
                              <img src="https://randomuser.me/api/portraits/women/65.jpg" className='size-14 rounded-full object-cover' alt="User avatar" />
                              <div className='flex flex-col'>
                                  <p className='text-[0.9rem] font-medium text-white'>sarah.johnson</p>
                                  <p className='text-xs text-gray-400 truncate'>Hey, how's it going?</p>
                              </div>
                         </div>
                      </li>
                      <li>
                          <div className='flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200'>
                              <img src="https://randomuser.me/api/portraits/men/32.jpg" className='size-14 rounded-full object-cover' alt="User avatar" />
                              <div className='flex flex-col'>
                                  <p className='text-[0.9rem] font-medium text-white'>mike.smith</p>
                                  <p className='text-xs text-gray-400 truncate'>Can we schedule a meeting?</p>
                              </div>
                         </div>
                      </li>
                      <li>
                          <div className='flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200'>
                              <img src="https://randomuser.me/api/portraits/women/28.jpg" className='size-14 rounded-full object-cover' alt="User avatar" />
                              <div className='flex flex-col'>
                                  <p className='text-[0.9rem] font-medium text-white'>emma.wilson</p>
                                  <p className='text-xs text-gray-400 truncate'>Thanks for your help!</p>
                              </div>
                         </div>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
  )
}
