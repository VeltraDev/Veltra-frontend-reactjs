import AppLogo from "./common/AppLogo"

export default function Footer(): JSX.Element {
    const footerNavs = [
        {
            href: 'javascript:void()',
            name: 'Điều khoản sử dụng'
        },
        {
            href: 'javascript:void()',
            name: 'Giấy phép'
        },
        {
            href: 'javascript:void()',
            name: 'Chính sách bảo mật'
        },
        {
            href: 'javascript:void()',
            name: 'Về chúng tôi'
        }
    ]
    return (
        <footer className="pt-10 bg-black">
            <div className="max-w-screen-xl mx-auto px-4 text-white  md:px-8">
                <div className="space-y-6 sm:max-w-md sm:mx-auto sm:text-center">
                    <AppLogo />
                    <p>
                        Veltra mang đến giải pháp kết nối video thời gian thực, tối ưu cho doanh nghiệp và cá nhân.
                    </p>
                    <div className="items-center gap-x-3 space-y-3 sm:flex sm:justify-center sm:space-y-0">
                        <a href="" className="block py-2 px-4 text-center text-white font-medium bg-yellow-600 duration-150 hover:bg-yellow-500 active:bg-yellow-700 rounded-lg shadow-lg hover:shadow-none">
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
                <div className="mt-10 py-10 border-t items-center justify-between sm:flex">
                    <p>© 2024 Veltra Inc. Bảo lưu mọi quyền.</p>
                    <ul className="flex flex-wrap items-center gap-4 mt-6 sm:text-sm sm:mt-0">
                        {
                            footerNavs.map((item, idx) => (
                                <li className="text-white hover:text-yellow-600  duration-150">
                                    <a key={idx} href={item.href}>
                                        {item.name}
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
         
        </footer>
    )
}
