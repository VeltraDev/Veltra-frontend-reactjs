import { ReactLenis } from 'lenis/react'
import { useTransform, motion, useScroll, MotionValue } from 'framer-motion'
import { useRef } from 'react'

const projects = [
    {
        title: 'Trò chuyện tức thì',
        description:
            'Nhắn tin nhanh chóng và dễ dàng với bạn bè và đồng nghiệp trên toàn hệ thống VelTra.',
        src: 'rock.jpg',
        link: 'https://images.unsplash.com/photo-1605106702842-01a887a31122?q=80&w=500&auto=format&fit=crop',
        color: '#5196fd',
    },
    {
        title: 'Gọi video chất lượng cao',
        description:
            'Thực hiện các cuộc gọi video rõ ràng, mượt mà với độ phân giải cao, đảm bảo kết nối ổn định.',
        src: 'tree.jpg',
        link: 'https://images.unsplash.com/photo-1605106250963-ffda6d2a4b32?w=500&auto=format&fit=crop&q=60',
        color: '#8f89ff',
    },
    {
        title: 'Bảo mật dữ liệu',
        description:
            'Dữ liệu của bạn được mã hóa và bảo vệ tuyệt đối trên VelTra, đảm bảo sự riêng tư và an toàn.',
        src: 'water.jpg',
        link: 'https://images.unsplash.com/photo-1605106901227-991bd663255c?w=500&auto=format&fit=crop',
        color: '#13006c',
    },
    {
        title: 'Tích hợp học nhóm',
        description:
            'Tạo các phòng học trực tuyến, dễ dàng trao đổi và làm việc nhóm với bạn học từ xa.',
        src: 'house.jpg',
        link: 'https://images.unsplash.com/photo-1605106715994-18d3fecffb98?w=500&auto=format&fit=crop&q=60',
        color: '#ed649e',
    },
    {
        title: 'An toàn sử dụng',
        description:
            'VelTra được phát triển với các tiêu chuẩn bảo mật cao nhất, bảo đảm an toàn cho mọi người dùng.',
        src: 'cactus.jpg',
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
            <main className="bg-transparent relative" ref={container}>
          <>
            <section className="text-black  h-[30vh]  w-full bg-transparent  flex flex-col justify-center items-center ">
              <div className="absolute z-0 bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

              <h3 className="text-yellow-600 font-semibold">
                Features
              </h3>
              <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
                Tính năng nổi bật
              </p>
              <p>
                Trải nghiệm những tính năng tuyệt vời trên VelTra
              </p>
            </section>
          </>

          <section className="text-white   w-full bg-transparent  ">
                    {projects.map((project, i) => {
                        const targetScale = 1 - (projects.length - i) * 0.05
                        return (
                            <Card
                                key={`p_${i}`}
                                i={i}
                                url={project?.link}
                                src={project?.src}
                                title={project?.title}
                                color={project?.color}
                                description={project?.description}
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
    src: string
    url: string
    color: string
    progress: MotionValue<number>
    range: [number, number]
    targetScale: number
}
export const Card: React.FC<CardProps> = ({
    i,
    title,
    description,
    src,
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

    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
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
                    top: `calc(-5vh + ${i * 25}px)`,
                }}
                className={`flex flex-col relative -top-[25%] h-[450px] w-[70%] rounded-md p-10 origin-top`}
            >
                <h2 className="text-3xl text-center font-semibold">{title}</h2>
                <div className={`flex h-full mt-5 gap-10`}>
                    <div className={`w-[40%] relative top-[10%]`}>
                        <p className="text-2xl font-semibold italic">{description}</p>
                        <span className="flex items-center gap-2 pt-2">
                            <a
                                href={'#'}
                                target="_blank"
                                className="underline cursor-pointer"
                            >
                                See more
                            </a>
                            <svg
                                width="22"
                                height="12"
                                viewBox="0 0 22 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z"
                                    fill="black"
                                />
                            </svg>
                        </span>
                    </div>

                    <div
                        className={`relative w-[60%] h-full rounded-lg overflow-hidden `}
                    >
                        <motion.div
                            className={`w-full h-full`}
                            style={{ scale: imageScale }}
                        >
                            <img src={url} alt="image" className="object-cover w-full h-full" />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
