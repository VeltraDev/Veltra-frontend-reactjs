"use client";

import { StickyScrollRevealDemo } from "./StickyScrollRevealDemo";

const marqueeItems = [
    {
        avatar: "https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg",
        name: "Quách Phú Thuận",
        title: "Nhà sáng lập WeConnect",
        quote: "Veltra đã thay đổi cách chúng tôi kết nối với khách hàng. Chất lượng video mượt mà và tính năng hỗ trợ linh hoạt giúp doanh nghiệp của chúng tôi tạo nên những trải nghiệm tốt nhất."
    },
    {
        avatar: "https://randomuser.me/api/portraits/men/46.jpg",
        name: "Lê Trần Hoàng Kiên",
        title: "CTO của SoftCloud",
        quote: "Sự kết hợp giữa công nghệ hiện đại và hỗ trợ nhanh chóng từ đội ngũ Veltra đã giúp chúng tôi xây dựng nền tảng video call mạnh mẽ, đáp ứng nhu cầu của hàng ngàn khách hàng."
    },
    {
        avatar: "https://randomuser.me/api/portraits/men/86.jpg",
        name: "Đoàn Vĩnh Khang",
        title: "Giám đốc vận hành FinTech",
        quote: "Nhờ Veltra, quy trình làm việc với đối tác của chúng tôi trở nên dễ dàng hơn. Tốc độ kết nối nhanh chóng và chất lượng hình ảnh sắc nét thực sự mang lại giá trị cho dịch vụ của chúng tôi."
    },
    {
        avatar: "https://randomuser.me/api/portraits/men/87.jpg",
        name: "Nguyễn Anh Đức",
        title: "Kỹ sư phát triển phần mềm",
        quote: "Đội ngũ Veltra đã mang lại giải pháp gọi video ổn định, phù hợp với dự án của chúng tôi. Chúng tôi hài lòng với khả năng tùy chỉnh và sự hỗ trợ nhiệt tình từ họ."
    },
    // {
    //     avatar: "https://randomuser.me/api/portraits/men/88.jpg",
    //     name: "Trần Nguyễn Minh Quân",
    //     title: "Giám đốc sáng tạo",
    //     quote: "Veltra không chỉ là một nền tảng kết nối qua video, mà còn là công cụ tuyệt vời giúp chúng tôi xây dựng trải nghiệm khách hàng hoàn hảo. Chúng tôi rất hài lòng với dịch vụ mà họ cung cấp."
    // },
    // {
    //     avatar: "https://randomuser.me/api/portraits/men/89.jpg",
    //     name: "Lê Phạm Anh Duy",
    //     title: "Chuyên gia tư vấn kinh doanh",
    //     quote: "Veltra đã giúp chúng tôi tiết kiệm nhiều thời gian và chi phí trong việc kết nối với khách hàng qua video. Họ là đối tác tin cậy mà chúng tôi sẽ tiếp tục hợp tác lâu dài."
    // }
];

export default function TestimonialSection() {
    return (
        <>
        
            <style>
                {`
          @keyframes marquee {
            100% { transform: translateX(-50%); }
          }
        `}
            </style>
            <div
                className="w-full overflow-hidden  bg-black"
                style={{
                    maskImage:
                        "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                }}
            >
               
                <div
                    className="flex w-[200%] gap-4 pr-4"
                    style={{
                        animation: "marquee 15s linear infinite",
                    }}
                >
                    {[0, 1].map((index) => (
                        <div className="flex flex-1 gap-4" key={index}>
                            {marqueeItems.map((item) => (
                                <div className="flex-1" key={item.name}>
                                    <div className="h-full max-w-60 rounded-xl bg-neutral-100 p-2 text-neutral-600 dark:bg-neutral-800">
                                        <div className="flex items-center gap-3 mb-3">
                                            <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <p className="font-semibold text-neutral-600 text-sm dark:text-neutral-300">
                                                    {item.name}
                                                </p>
                                                <p className="text-neutral-500 text-xs dark:text-neutral-400">
                                                    {item.title}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-neutral-600 text-sm dark:text-neutral-300 line-clamp-4">
                                            "{item.quote}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
