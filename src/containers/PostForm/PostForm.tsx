import React, { useState } from "react";
import { ImageIcon, XIcon } from "lucide-react"; // Import XIcon

const user = [
  {
    fullName: 'Lê Phạm Thanh Duy',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
  }
];

const PostForm = () => {
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaURLs, setMediaURLs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true); // State để điều khiển hiển thị modal

  // Handle content change
  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  // Handle media file selection
  const handleMediaChange = (event) => {
    const files = event.target.files;
    setMediaFiles(files);

    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setMediaURLs(urls);
  };

  // Handle removing media
  const handleRemoveMedia = (index) => {
    const newMediaURLs = mediaURLs.filter((_, i) => i !== index);
    const newMediaFiles = Array.from(mediaFiles).filter((_, i) => i !== index);
    
    setMediaURLs(newMediaURLs);
    setMediaFiles(newMediaFiles);
  };

  // Close modal when clicking outside the form
  const handleCloseModal = (event) => {
    if (event.target.id === "modal-overlay") {
      setIsModalOpen(false);
    }
  };

  return isModalOpen ? (
    <div 
      id="modal-overlay" 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleCloseModal}
    >
      <div className="relative w-[500px] bg-[#242526] rounded-lg shadow-md z-10">
        
        {/*  X đóng modal */}
        <button 
          onClick={() => setIsModalOpen(false)}
          className="absolute top-2 right-2 bg-[#4b4d4f] text-[#e0e2e6] rounded-full p-2 hover:bg-[#606062]"
        >
          <XIcon />
        </button>
        
        <div className="w-[500px] h-[64px] text-[#e0e2e6] text-[22px] font-bold text-center pt-4">Tạo bài viết</div>
        <div className="w-[500px] max-w-lg border-b-[0.5px] border-[#e0e2e644]"></div>

        <div className="p-6">
          <form encType="multipart/form-data">
            {user.map((item, index) => (
              <div key={index} className="flex mb-3 mt-[-10px]">
                <img src={item.avatar} alt="" className="rounded-[50%] w-[42px] h-[42px] mr-2" />
                <div className="text-[#e0e2e6] font-bold">{item.fullName}</div>
              </div>
            ))}

            <div>
              <textarea
                placeholder="Bạn đang nghĩ gì?"
                value={content}
                autoFocus
                onChange={handleContentChange}
                className="h-[150px] max-h-80 text-[#e0e2e6] text-[24px] pb-3 w-full bg-[#242526] border-none caret-[#e0e2e6] rounded-md focus:outline-none focus:ring-0 resize-none"
              />
            </div>

            {/* Hiển thị ảnh đã chọn và nút xóa */}
            <div className="flex flex-wrap mt-3">
              {mediaURLs.map((url, index) => (
                <div key={index} className="relative w-[80px] h-[80px] mr-2 mb-2">
                  <img
                    src={url}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-[#4b4d4f] text-[#e0e2e6] rounded-full w-5 h-5 flex items-center justify-center hover:bg-[#606062]"
                    onClick={() => handleRemoveMedia(index)}
                  >
                    <XIcon />
                  </button>
                </div>
              ))}
            </div>

            <div className="h-[56px] border-[0.5px] border-[#e0e2e644] rounded-md w-[452px]">
              <label className="text-[#e0e2e6] font-semibold cursor-pointer h-full flex items-center justify-around">
                <div className="mx-3">Thêm vào bài viết của bạn</div>
                <ImageIcon />
                <input
                  type="file"
                  accept="image/*, video/*"
                  multiple
                  onChange={handleMediaChange}
                  className="hidden" // Ẩn input file gốc
                />
              </label>
            </div>

          
            <button
              type="submit" 
              className="inline-block mt-4 w-[452px] mx-auto bg-[#505151] text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Đăng
            </button>
          </form>
        </div>

      </div>
    </div>
  ) : null;
};

export default PostForm;
