import { ChevronDownIcon } from "lucide-react"
import { cn } from "../../lib/utils";

export default function DoubleContainerGradientQna() {
  return (
    <div className="relative bg-black px-36 py-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <AdvancedGradient className="opacity-50" />
      </div>
      <div className="space-y-2">
        {[
          {
            question: "Veltra là gì?",
            answer: "Veltra là một nền tảng mạng xã hội và trò chuyện video thời gian thực, cho phép người dùng kết nối với nhau một cách dễ dàng."
          },
          {
            question: "Làm thế nào để đăng ký tài khoản?",
            answer: "Bạn có thể đăng ký tài khoản bằng cách nhấn vào nút 'Đăng ký' trên trang chủ và điền thông tin cần thiết."
          },
          {
            question: "Tôi có thể sử dụng Veltra miễn phí không?",
            answer: "Có, Veltra cung cấp các tính năng cơ bản miễn phí. Tuy nhiên, bạn có thể nâng cấp để sử dụng thêm nhiều tính năng cao cấp."
          }
        ].map((faq, index) => (
          <Testimonial
            key={index}
            title={faq.question}
            content={faq.answer}
          />
        ))}
      </div>
    </div>
  );
}

const Testimonial = ({ title, content }: { title: string; content: string }) => (
  <div className="relative overflow-hidden rounded-3xl border border-neutral-400/20 bg-neutral-500/10 backdrop-blur-2xl transition-all hover:bg-neutral-500/20">
    <details className="peer group max-h-96 w-full transform-gpu overflow-hidden transition-all">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 transition-all duration-300 group-open:pt-8 group-open:pl-8">
        <h6 className="font-medium text-lg text-neutral-600 tracking-tight dark:text-neutral-300">{title}</h6>
        <ChevronDownIcon className="group-open:-rotate-180 absolute top-5 right-5 size-5 transform-gpu text-neutral-600 transition-all dark:text-neutral-300" />
      </summary>
    </details>
    <div className="max-h-0 transform-gpu overflow-hidden font-medium text-neutral-700 transition-all duration-500 peer-open:max-h-40 dark:text-neutral-200">
      <p className="m-2 rounded-2xl bg-neutral-500/10 p-8">{content}</p>
    </div>
  </div>
);

const AdvancedGradient = ({ className }: { className?: string }) => (
  <>
    <style>{`
      @keyframes size-bounce { 50% { transform: scale(0.8); } 100% { transform: scale(1); } }
      @keyframes spin-right { 100% { transform: rotate(360deg); } }
      @keyframes spin-left { 100% { transform: rotate(-360deg); } }
    `}</style>
    <div className={cn("relative size-[400px] transform-gpu transition-all", className)}>
      {[
        { bg: "conic-gradient(#FF0080, #EE00FF, #00A6FF, #4797FF, #0044FF, #FF8000, #FF00CC)", anim: "spin-right 15s linear infinite" },
        { bg: "conic-gradient(#FFF, #12B4E6, #DC4CFC)", anim: "spin-right 10s linear infinite", bounce: true },
        { bg: "conic-gradient(#A6EFFF, #12ADE6, #4C63FC)", anim: "spin-left 15s linear infinite", bounce: true }
      ].map((item, index) => (
        <div key={index} className="absolute top-0 left-0 grid h-full w-full transform-gpu place-items-center" style={item.bounce ? { animation: "size-bounce 20s linear infinite" } : {}}>
          <div className={cn("absolute transform-gpu rounded-full", index === 0 ? "h-full w-full opacity-80 blur-3xl" : "size-[300px] blur-2xl", index === 2 ? "opacity-80" : "")} style={{ background: item.bg, animation: item.anim }} />
        </div>
      ))}
    </div>
  </>
);
