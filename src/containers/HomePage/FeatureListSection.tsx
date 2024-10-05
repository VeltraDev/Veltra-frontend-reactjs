import { motion, MotionValue, useScroll, useTransform } from 'framer-motion'
import { ReactLenis } from 'lenis/react'
import { useRef } from 'react'

const projects = [
    {
        title: 'Trò chuyện tức thì',
        description: 'Nhắn tin nhanh chóng và dễ dàng với bạn bè và đồng nghiệp trên toàn hệ thống VelTra.',
        link: 'https://images.unsplash.com/photo-1605106702842-01a887a31122?q=80&w=500&auto=format&fit=crop',
        color: '#5196fd',
    },
    {
        title: 'Gọi video chất lượng cao',
        description: 'Thực hiện các cuộc gọi video rõ ràng, mượt mà với độ phân giải cao, đảm bảo kết nối ổn định.',
        link: 'https://images.unsplash.com/photo-1605106250963-ffda6d2a4b32?w=500&auto=format&fit=crop&q=60',
        color: '#8f89ff',
        src: 'tree.jpg',
    },
    {
        title: 'Bảo mật dữ liệu',
        description: 'Dữ liệu của bạn được mã hóa và bảo vệ tuyệt đối trên VelTra, đảm bảo sự riêng tư và an toàn.',
        link: 'https://images.unsplash.com/photo-1605106901227-991bd663255c?w=500&auto=format&fit=crop',
        color: '#13006c',
    },
    {
        title: 'Tích hợp học nhóm',
        description: 'Tạo các phòng học trực tuyến, dễ dàng trao đổi và làm việc nhóm với bạn học từ xa.',
        link: 'https://images.unsplash.com/photo-1605106715994-18d3fecffb98?w=500&auto=format&fit=crop&q=60',
        color: '#ed649e',
    },
    {
        title: 'An toàn sử dụng',
        description: 'VelTra được phát triển với các tiêu chuẩn bảo mật cao nhất, bảo đảm an toàn cho mọi người dùng.',
        link: 'https://images.unsplash.com/photo-1506792006437-256b665541e2?w=500&auto=format&fit=crop',
        color: '#fd521a',
    },
]

export default function FeatureListSection(): JSX.Element {
    const container = useRef(null)
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end'],
    })

    return (
        <ReactLenis root>
          
            <main className="bg-black relative flex" ref={container}>
                <div className="absolute z-0 bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2e_1px,transparent_1px),linear-gradient(to_bottom,#ffffff2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                <motion.section 
                    className="text-white h-[20vh] w-full flex flex-col justify-center items-center sticky z-10"
                    style={{
                        top: scrollYProgress.get() >= 1 ? '50%' : '40%',
                        transform: scrollYProgress.get() >= 1 ? 'translateY(-50%)' : 'none'
                    }}
                >
                    <h3 className="text-yellow-600 font-semibold text-sm">Features</h3>
                    <p className="text-white text-2xl font-semibold sm:text-3xl">Tính năng nổi bật</p>
                    <p className="text-sm text-gray-400">Trải nghiệm những tính năng tuyệt vời trên VelTra</p>
                </motion.section>
             
                <section className="text-white w-full bg-transparent">
                    {projects.map((project, i) => {
                        const targetScale = 1 - (projects.length - i) * 0.03
                        return (
                            <Card
                                key={`p_${i}`}
                                i={i}
                                url={project.link}
                                title={project.title}
                                color={project.color}
                                description={project.description}
                                progress={scrollYProgress}
                                range={[i * 0.25, 1]}
                                targetScale={targetScale}
                            />
                        )
                    })}
                </section>
            </main>
        </ReactLenis>
    )
}

interface CardProps {
    i: number
    title: string
    description: string
    url: string
    color: string
    progress: MotionValue<number>
    range: [number, number]
    targetScale: number
}

const Card: React.FC<CardProps> = ({
    i,
    title,
    description,
    url,
    color,
    progress,
    range,
    targetScale,
}) => {
    const container = useRef(null)
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start'],
    })

    const imageScale = useTransform(scrollYProgress, [0, 1], [1.5, 1])
    const scale = useTransform(progress, range, [1, targetScale])

    return (
        <div
            ref={container}
            className="h-screen flex items-center justify-center sticky top-0"
        >
            <motion.div
                style={{
                    backgroundColor: color,
                    scale,
                    top: `calc(-5vh + ${i * 20}px)`,
                }}
                className="flex flex-col relative -top-[20%] h-[350px] w-[60%] rounded-lg p-6 origin-top shadow-lg"
            >
                <h2 className="text-2xl text-center font-semibold mb-4">{title}</h2>
                <div className="flex h-full gap-6">
                    <div className="w-[40%] relative top-[5%]">
                        <p className="text-lg font-medium">{description}</p>
                        <span className="flex items-center gap-2 pt-4">
                            <a
                                href="#"
                                target="_blank"
                                className="text-sm underline cursor-pointer hover:text-gray-300 transition-colors"
                            >
                                Xem thêm
                            </a>
                            <svg
                                width="18"
                                height="10"
                                viewBox="0 0 22 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </span>
                    </div>
                    <div className="relative w-[60%] h-full rounded-lg overflow-hidden">
                        <motion.div
                            className="w-full h-full"
                            style={{ scale: imageScale }}
                        >
                            <img src={url} alt={title} className="object-cover w-full h-full rounded-lg" />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}