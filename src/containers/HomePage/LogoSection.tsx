export default function LogoSection(): JSX.Element {
  return (
    <div className="py-14 ">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
            Những người đang sử dụng VelTra
          </h3>
          <p className="text-gray-600 mt-3">
            VelTra giúp bạn kết nối và giao tiếp một cách dễ dàng hơn với bạn bè và đồng nghiệp.
          </p>
        </div>
        <div className="mt-12 flex justify-center">
          <ul className="inline-grid grid-cols-2 gap-x-10 gap-y-6 md:gap-x-16 md:grid-cols-3 lg:grid-cols-4">

            {/* LOGO 1 */}
            <li>
              <svg className="w-28 my-auto" viewBox="0 0 163 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Thêm nội dung SVG cho logo 1 */}
              </svg>
            </li>

            {/* LOGO 2 */}
            <li>
              <svg className="w-28 my-auto" viewBox="0 0 129 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Thêm nội dung SVG cho logo 2 */}
              </svg>
            </li>

            {/* LOGO 3 */}
            <li>
              <svg className="w-28 my-auto" viewBox="0 0 135 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Thêm nội dung SVG cho logo 3 */}
              </svg>
            </li>

            {/* LOGO 4 */}
            <li>
              <svg className="w-28 my-auto" viewBox="0 0 164 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Thêm nội dung SVG cho logo 4 */}
              </svg>
            </li>

            {/* LOGO 5 */}
            <li>
              <svg className="w-28 my-auto" viewBox="0 0 148 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Thêm nội dung SVG cho logo 5 */}
              </svg>
            </li>

            {/* LOGO 6 */}
            <li>
              <svg className="w-28 my-auto" viewBox="0 0 100 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Thêm nội dung SVG cho logo 6 */}
              </svg>
            </li>

            {/* LOGO 7 */}
            <li>
              <svg className="w-28 my-auto" viewBox="0 0 98 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Thêm nội dung SVG cho logo 7 */}
              </svg>
            </li>

            {/* LOGO 8 */}
            <li>
              <svg className="w-28 my-auto" viewBox="0 0 121 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Thêm nội dung SVG cho logo 8 */}
              </svg>
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
}
