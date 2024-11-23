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
                            Trò chuyện, chia sẻ, và gắn kết - tất cả trong  <br /> một ứng dụng. <span className="bg-gradient-primary bg-clip-text text-transparent">Cuộn xuống để khám phá!</span>
                        </h1>
                    </section>

                    <section className="bg-black text-white grid place-content-center h-screen sticky top-0 overflow-hidden">
                        <HeroSection />
                    </section>

                    <section className="text-white h-screen w-full bg-black grid place-content-center sticky top-0">
                        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2e_1px,transparent_1px),linear-gradient(to_bottom,#ffffff2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                        <h1 data-aos="zoom-in" className="2xl:text-7xl text-5xl px-8 font-semibold text-center tracking-tight leading-[120%]"> Trò chuyện <span className="bg-gradient-primary bg-clip-text text-transparent">thỏa thích</span> <br /> và chia sẻ khoảnh khắc với bạn bè, gia đình! </h1>
                    </section>
                </div>

                <section className="text-white w-full bg-black ">
                    <div className="grid grid-cols-2">
                        <div className="sticky top-0 h-screen flex items-center justify-center">
                            <h1 data-aos="fade-right" data-aos-offset="200" data-aos-easing="ease-in-sine" className="2xl:text-5xl text-5xl px-8 font-semibold text-center tracking-tight leading-[120%]"> Chia sẻ khoảnh khắc của bạn. <br /> Thoải mái <span className="bg-gradient-primary bg-clip-text text-transparent">bình luận</span>, <span className="bg-gradient-primary bg-clip-text text-transparent">thả cảm xúc</span> và kết nối cùng mọi người! </h1>
                        </div>
                        <div data-aos="fade-up"
                            data-aos-anchor-placement="top-center   " className="grid gap-2 overflow-hidden">
                            <figure className="grid place-content-center -skew-x-12 transform hover:scale-105 transition-transform duration-300">
                                <img
                                    src="https://veltra-nestjs-uploader.s3.ap-southeast-1.amazonaws.com/Screenshot 2024-11-23 082652.png"
                                    alt="Người đang gọi video"
                                    className="transition-all duration-300 w-full h-60 object-cover"
                                />
                            </figure>
                            <figure className="grid place-content-center skew-x-12 transform hover:scale-105 transition-transform duration-300">
                                <img
                                    src="https://veltra-nestjs-uploader.s3.ap-southeast-1.amazonaws.com/Screenshot 2024-11-23 082701.png"
                                    alt="Cuộc trò chuyện video nhóm"
                                    className="transition-all duration-300 w-full h-60 object-cover"
                                />
                            </figure>
                            <figure className="grid place-content-center -skew-x-12 transform hover:scale-105 transition-transform duration-300">
                                <img
                                    src="https://veltra-nestjs-uploader.s3.ap-southeast-1.amazonaws.com/Screenshot 2024-11-23 082710.png"
                                    alt="Chia sẻ khoảnh khắc qua video"
                                    className="transition-all duration-300 w-full h-60 object-cover"
                                />
                            </figure>
                            <figure className="grid place-content-center skew-x-12 transform hover:scale-105 transition-transform duration-300">
                                <img
                                    src="https://veltra-nestjs-uploader.s3.ap-southeast-1.amazonaws.com/Screenshot 2024-11-23 082720.png"
                                    alt="Kết nối video không giới hạn"
                                    className="transition-all duration-300 w-full h-60 object-cover"
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
                                    src="https://veltra-nestjs-uploader.s3.ap-southeast-1.amazonaws.com/Screenshot 2024-11-23 083516.png"
                                    alt="Trò chuyện qua video"
                                    className="transition-all duration-300 w-[500px]  align-bottom object-cover rounded-md"
                                />
                            </figure>
                            <figure className="sticky top-0 h-screen grid place-content-center">
                                <img
                                    src="https://veltra-nestjs-uploader.s3.ap-southeast-1.amazonaws.com/Screenshot 2024-11-23 083526.png"
                                    alt="Cuộc gọi video nhóm"
                                    className="transition-all duration-300 w-[500px]  align-bottom object-cover rounded-md"
                                />
                            </figure>
                            <figure className="sticky top-0 h-screen grid place-content-center">
                                <img
                                    src="https://veltra-nestjs-uploader.s3.ap-southeast-1.amazonaws.com/Screenshot 2024-11-23 083533.png"
                                    alt="Kết nối toàn cầu"
                                    className="transition-all duration-300 w-[500px]  align-bottom object-cover rounded-md"
                                />
                            </figure>
                            <figure className="sticky top-0 h-screen grid place-content-center">
                                <img
                                    src="https://veltra-nestjs-uploader.s3.ap-southeast-1.amazonaws.com/Screenshot 2024-11-23 083548.png"
                                    alt="Gọi video thời gian thực"
                                    className="transition-all duration-300 w-[500px]  align-bottom object-cover rounded-md"
                                />
                            </figure>
                        </div>
                        <div className="sticky top-0 h-screen grid place-content-center">
                            <h1 data-aos="fade-left" className="text-4xl px-8 font-medium text-right tracking-tight leading-[120%]"> Với Veltra, hãy tùy chỉnh phong cách của bạn. <br /> Hơn <span className="bg-gradient-primary bg-clip-text text-transparent">40 màu theme</span> để lựa chọn, không chỉ dừng lại ở đen và trắng! </h1>
                        </div>
                    </div>
                </section>


            </main>
        </ReactLenis>
    )
}
