import { ReactLenis } from 'lenis/react'
import HeroSection from '../../containers/HomePage/HeroSection'
export default function MainHomeSection(): JSX.Element {
    return (
        <ReactLenis root>
            <main className="bg-black">
                <div className="wrapper">
                    <section className="text-primary h-screen w-full bg-white grid place-content-center sticky top-0">
                        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

                        <h1 className="2xl:text-7xl text-6xl px-8 font-semibold text-center tracking-tight leading-[120%]">
                            Trải nghiệm chat video theo thời gian thực <br /> với Veltra. Cuộn xuống để khám phá!
                        </h1>
                    </section>

                    <section className="bg-white text-black grid place-content-center h-screen sticky top-0 overflow-hidden">
                        <HeroSection />
                    </section>

                    <section className="text-white h-screen w-full bg-white grid place-content-center sticky top-0">
                        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                        <h1 className="2xl:text-7xl text-5xl px-8 font-semibold  text-center tracking-tight leading-[120%]">
                            Cùng bạn bè, kết nối qua từng dòng cảm xúc.
                        </h1>
                    </section>
                </div>

                <section className="text-black w-full bg-white ">
                    <div className="grid grid-cols-2">
                        <div className="sticky top-0 h-screen flex items-center justify-center">
                            <h1 className="2xl:text-7xl text-5xl px-8 font-semibold text-center tracking-tight leading-[120%]">
                                Cảm ơn bạn đã chọn Veltra.
                                <br /> Giờ hãy bắt đầu cuộc gọi đầu tiên của bạn!
                            </h1>
                        </div>
                        <div className="grid gap-2">
                            <figure className="grid place-content-center -skew-x-12">
                                <img
                                    src="https://images.unsplash.com/photo-1718838541476-d04e71caa347?w=500&auto=format&fit=crop"
                                    alt="Người đang gọi video"
                                    className="transition-all duration-300 w-80 h-96 align-bottom object-cover"
                                />
                            </figure>
                            <figure className="grid place-content-center skew-x-12">
                                <img
                                    src="https://images.unsplash.com/photo-1715432362539-6ab2ab480db2?w=500&auto=format&fit=crop"
                                    alt="Cuộc trò chuyện video nhóm"
                                    className="transition-all duration-300 w-80 h-96 align-bottom object-cover"
                                />
                            </figure>
                            <figure className="grid place-content-center -skew-x-12">
                                <img
                                    src="https://images.unsplash.com/photo-1718601980986-0ce75101d52d?w=500&auto=format&fit=crop"
                                    alt="Chia sẻ khoảnh khắc qua video"
                                    className="transition-all duration-300 w-80 h-96 align-bottom object-cover"
                                />
                            </figure>
                            <figure className="grid place-content-center skew-x-12">
                                <img
                                    src="https://images.unsplash.com/photo-1685904042960-66242a0ac352?w=500&auto=format&fit=crop"
                                    alt="Kết nối video không giới hạn"
                                    className="transition-all duration-300 w-80 h-96 align-bottom object-cover"
                                />
                            </figure>
                        </div>
                    </div>
                </section>

                <section className="text-black w-full bg-white ">
                    <div className="grid grid-cols-2 px-8">
                        <div className="grid gap-2">
                            <figure className="sticky top-0 h-screen grid place-content-center">
                                <img
                                    src="https://images.unsplash.com/photo-1718183120769-ece47f31045b?w=500&auto=format&fit=crop"
                                    alt="Trò chuyện qua video"
                                    className="transition-all duration-300 w-96 h-96 align-bottom object-cover rounded-md"
                                />
                            </figure>
                            <figure className="sticky top-0 h-screen grid place-content-center">
                                <img
                                    src="https://images.unsplash.com/photo-1715432362539-6ab2ab480db2?w=500&auto=format&fit=crop"
                                    alt="Cuộc gọi video nhóm"
                                    className="transition-all duration-300 w-96 h-96 align-bottom object-cover rounded-md"
                                />
                            </figure>
                            <figure className="sticky top-0 h-screen grid place-content-center">
                                <img
                                    src="https://images.unsplash.com/photo-1685904042960-66242a0ac352?w=500&auto=format&fit=crop"
                                    alt="Kết nối toàn cầu"
                                    className="transition-all duration-300 w-96 h-96 align-bottom object-cover rounded-md"
                                />
                            </figure>
                            <figure className="sticky top-0 h-screen grid place-content-center">
                                <img
                                    src="https://images.unsplash.com/photo-1718838541476-d04e71caa347?w=500&auto=format&fit=crop"
                                    alt="Gọi video thời gian thực"
                                    className="transition-all duration-300 w-96 h-96 align-bottom object-cover rounded-md"
                                />
                            </figure>
                        </div>
                        <div data-aos="flip-right" className="sticky top-0 h-screen grid place-content-center">
                            <h1 className="text-4xl px-8 font-medium text-right tracking-tight leading-[120%]">
                                Với Veltra, bạn có thể kết nối dễ dàng, mọi lúc, mọi nơi qua cuộc gọi video thời gian thực.
                            </h1>
                        </div>
                    </div>
                </section>

                <footer className="group bg-gradient-to-r from-amber-200 to-gray-50 ">
                    <h1 className="text-[16vw] group-hover:translate-y-4 translate-y-20 leading-[100%] uppercase font-semibold text-center bg-gradient-to-r from-yellow-400 to-yellow-100 bg-clip-text text-transparent transition-all ease-linear">
                        Veltra
                    </h1>
                    <section className="bg-black text-white font-bold italic h-40 relative z-10 grid place-content-center text-2xl rounded-tr-full rounded-tl-full">
                        {/* Cảm ơn bạn đã ghé thăm Veltra! */}
                    </section>
                </footer>
            </main>
        </ReactLenis>
    )
}
