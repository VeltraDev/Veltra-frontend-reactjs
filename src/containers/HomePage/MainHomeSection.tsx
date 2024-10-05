import { ReactLenis } from 'lenis/react'
import HeroSection from '../../containers/HomePage/HeroSection'

export default function MainHomeSection(): JSX.Element {
    return (
        <ReactLenis root>
            <main className="bg-black">
                <div className="wrapper ">
                    <section className="text-white h-screen w-full bg-black grid place-content-center sticky top-0">

                        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2e_1px,transparent_1px),linear-gradient(to_bottom,#ffffff2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

                        <h1 data-aos="fade-right" className="2xl:text-7xl text-6xl px-8 font-semibold text-center tracking-tight leading-[120%] ">
                            Trải nghiệm chat video theo thời gian thực <br /> với Veltra. <span className="bg-gradient-primary bg-clip-text text-transparent">Cuộn xuống để khám phá!</span>
                        </h1>
                    </section>

                    <section className="bg-black text-white grid place-content-center h-screen sticky top-0 overflow-hidden">
                        <HeroSection />
                    </section>

                    <section className="text-white h-screen w-full bg-black grid place-content-center sticky top-0">
                        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2e_1px,transparent_1px),linear-gradient(to_bottom,#ffffff2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                        <h1 data-aos="zoom-in" className="2xl:text-7xl text-5xl px-8 font-semibold text-center tracking-tight leading-[120%]">
                            Kết nối <span className="bg-gradient-primary bg-clip-text text-transparent">không giới hạn</span> <br /> với bạn bè và gia đình qua video!
                        </h1>
                    </section>
                </div>

                <section className="text-white w-full bg-black ">
                    <div className="grid grid-cols-2">
                        <div className="sticky top-0 h-screen flex items-center justify-center">
                            <h1 data-aos="fade-right"
                                data-aos-offset="200"
                                data-aos-easing="ease-in-sine" className="2xl:text-5xl text-5xl px-8 font-semibold text-center tracking-tight leading-[120%]">
                                Cảm ơn bạn đã chọn Veltra.
                                <br /> Giờ hãy bắt đầu <span className="bg-gradient-primary bg-clip-text text-transparent">cuộc gọi đầu tiên</span> của bạn!
                            </h1>
                        </div>
                        <div data-aos="fade-up"
                            data-aos-anchor-placement="top-center   " className="grid gap-2 overflow-hidden">
                            <figure className="grid place-content-center -skew-x-12 transform hover:scale-105 transition-transform duration-300">
                                <img
                                    src="https://images.unsplash.com/photo-1718838541476-d04e71caa347?w=500&auto=format&fit=crop"
                                    alt="Người đang gọi video"
                                    className="transition-all duration-300 w-full h-96 object-cover"
                                />
                            </figure>
                            <figure className="grid place-content-center skew-x-12 transform hover:scale-105 transition-transform duration-300">
                                <img
                                    src="https://images.unsplash.com/photo-1715432362539-6ab2ab480db2?w=500&auto=format&fit=crop"
                                    alt="Cuộc trò chuyện video nhóm"
                                    className="transition-all duration-300 w-full h-96 object-cover"
                                />
                            </figure>
                            <figure className="grid place-content-center -skew-x-12 transform hover:scale-105 transition-transform duration-300">
                                <img
                                    src="https://images.unsplash.com/photo-1718601980986-0ce75101d52d?w=500&auto=format&fit=crop"
                                    alt="Chia sẻ khoảnh khắc qua video"
                                    className="transition-all duration-300 w-full h-96 object-cover"
                                />
                            </figure>
                            <figure className="grid place-content-center skew-x-12 transform hover:scale-105 transition-transform duration-300">
                                <img
                                    src="https://images.unsplash.com/photo-1685904042960-66242a0ac352?w=500&auto=format&fit=crop"
                                    alt="Kết nối video không giới hạn"
                                    className="transition-all duration-300 w-full h-96 object-cover"
                                />
                            </figure>
                        </div>
                    </div>
                </section>

                <section className="text-white w-full bg-black ">
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
                        <div className="sticky top-0 h-screen grid place-content-center">
                            <h1 data-aos="fade-left"  className="text-4xl px-8 font-medium text-right tracking-tight leading-[120%]">
                                Với Veltra, bạn có thể kết nối dễ dàng, mọi lúc, mọi nơi qua cuộc gọi video<span className="bg-gradient-primary bg-clip-text text-transparent"> thời gian thực</span>.
                            </h1>
                        </div>
                    </div>
                </section>


            </main>
        </ReactLenis>
    )
}
