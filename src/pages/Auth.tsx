import { useState } from "react";

import SignUpForm from "../containers/AuthPage/SignUpForm";
import { SignInForm } from "@/containers/AuthPage/SignInForm";

export default function     AuthPage() {
    const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

    return (
        <section className="relative flex size-full max-h-full items-center justify-center bg-[url('https://4kwallpapers.com/images/wallpapers/dark-background-abstract-background-network-3d-background-3840x2160-8324.png')] bg-cover px-2 py-6 md:px-12 lg:justify-end lg:p-14 lg:pt-28">
            <div className="relative z-10 flex flex-1 flex-col rounded-3xl border-black/50 border-t bg-black/60 px-4 py-10 backdrop-blur-2xl sm:justify-center md:flex-none md:px-20 lg:rounded-r-none lg:border-t-0 lg:border-l lg:py-14 lg:px-24">
                <div className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
                    <h1 className="font-semibold text-3xl text-white tracking-tighter">
                        Trò chuyện, gọi video và học nhóm dễ dàng, <br />
                        <span className="text-gray-300">Veltra</span>
                    </h1>
                    <p className="mt-4 font-medium text-base text-gray-400">
                        Veltra - nền tảng miễn phí cho tin nhắn, gọi video và học nhóm. Kết nối và học tập hiệu quả cùng Veltra.
                    </p>

                    <div className="mt-8">
                        <div className="flex border-b border-gray-600 relative">
                            <button
                                className={`flex-1 py-2 text-sm font-medium ${activeTab === 'signin' ? 'text-white' : 'text-gray-400'}`}
                                onClick={() => setActiveTab('signin')}
                            >
                                Đăng nhập
                            </button>
                            <button
                                className={`flex-1 py-2 text-sm font-medium ${activeTab === 'signup' ? 'text-white' : 'text-gray-400'}`}
                                onClick={() => setActiveTab('signup')}
                            >
                                Đăng ký
                            </button>
                            <div
                                className={`absolute bottom-0 h-0.5 bg-white transition-all duration-300 ease-in-out ${activeTab === 'signin' ? 'left-0 w-1/2' : 'left-1/2 w-1/2'
                                    }`}
                            ></div>
                        </div>

                        {activeTab === 'signin' ? (
                            <SignInForm />
                        ) : (
                            <SignUpForm />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}




