import React from 'react';
import { BookUser, Bookmark, Grid3X3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SocialMediaPost from './Post'
const accountData = {
    posts: 1,
};

const ProfileContent: React.FC = () => {
    return (
        <div>
            <div className="border-t border-gray-700 mt-8">
                <div className="flex justify-center space-x-8 mt-4">
                    <Link to="/saved" className="text-gray-400 hover:text-white flex items-center p-2 hover:bg-gray-700 rounded">
                        <Grid3X3 />
                        <span className="ml-3 ">BÀI VIẾT</span>
                    </Link>
                    <Link to="/saved" className="text-gray-400 hover:text-white flex items-center p-2 hover:bg-gray-700 rounded">
                        <Bookmark />
                        <span className="ml-3 ">ĐÃ LƯU</span>
                    </Link>
                    <Link to="/taged" className="text-gray-400 hover:text-white flex items-center p-2 hover:bg-gray-700 rounded">
                        <BookUser />
                        <span className="ml-3 ">ĐƯỢC GẮN THẺ</span>
                    </Link>
                </div>
            </div>
            {accountData.posts === 0 ? (
                <div className="flex flex-col items-center mt-16">
                    <i className="fas fa-camera text-6xl text-gray-600"></i>
                    <h2 className="text-2xl font-bold mt-4">Chia sẻ ảnh</h2>
                    <p className="text-gray-400 mt-2 text-center">Khi bạn chia sẻ ảnh, ảnh sẽ xuất hiện trên trang cá nhân của bạn.</p>
                    <a href="#" className="text-blue-500 mt-4">Chia sẻ ảnh đầu tiên của bạn</a>
                </div>
            ) : (
                <div className="mt-4">
                    <div className="p-4">
                        <SocialMediaPost />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileContent;
