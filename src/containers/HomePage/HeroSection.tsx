
import { useState } from "react"

export default function HeroSection() {

  const [state, setState] = useState(false)


  const navigation = [
    { title: "Partners", path: "" },
    { title: "Customers", path: "" },
    { title: "Team", path: "" },

  ]

  return (


    <section className="">

      
      <div className='relative font-mono'>
        <div className="max-w-screen-xl z-10 mx-auto text-gray-600 gap-x-12 items-center justify-between overflow-hidden md:flex md:px-8">
          <div className="flex-none space-y-5 px-4 sm:max-w-lg md:px-0 lg:max-w-xl">
          <h1 className="text-sm text-primary font-medium">
            Kết nối không giới hạn với bạn bè UTH
            </h1>
            {/* <TextAnimation
              text="Trò chuyện, gọi video và học nhóm dễ dàng "
              variants={{
                hidden: { filter: 'blur(10px)', opacity: 0, y: 2},
                visible: {
                  filter: 'blur(0px)',
                  opacity: 1,
                  y: 0,
                  transition: { ease: 'linear' },
                },
              }}
              classname="text-4xl text-gray-800 font-extrabold md:text-5xl "
            /> */}
            <h2 className="text-4xl text-white font-extrabold md:text-5xl">
              Trò chuyện, học nhóm dễ dàng
          </h2>
          <p className="text-base text-white mt-4 ">
            Với VelTra, bạn có thể nhắn tin tức thì và tạo phòng học nhóm miễn phí.
            Tất cả đều trên một nền tảng duy nhất, giúp bạn kết nối và học tập hiệu quả hơn.
          </p>

          <div className="items-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
            <a href="" className="block py-2 px-4 text-center text-white font-medium bg-primary duration-150 hover:bg-primary active:bg-primary rounded-lg shadow-lg hover:shadow-none">
              Bắt đầu ngay
            </a>
            <a href="" className="flex items-center justify-center gap-x-2 py-2 px-4 text-white hover:text-gray-500 font-medium duration-150 active:bg-gray-100 border rounded-lg md:inline-flex">
             Truy cập ngay
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
        <div className="flex-none mt-14 md:mt-0 md:max-w-xl">
          <img
            src="https://tuyensinh.ut.edu.vn/wp-content/uploads/2023/04/IMG_3029-scaled.jpg"
            className=" md:rounded-tl-[108px]"
            alt=""
          />
        </div>
        </div>
      </div>
   

    </section>

  )
}