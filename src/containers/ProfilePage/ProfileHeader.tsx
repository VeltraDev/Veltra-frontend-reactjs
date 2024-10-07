import React from 'react';
import { Link } from 'react-router-dom';


const accountData = {
    username: 'quanminh1374',
    fullName: 'Minh Quân',
    profileImage: 'https://cherryradio.com.au/uploads/singer/avatar/2021/04/15043/1618372223_600.jpg',
    posts: 0,
    followers: 5,
    following: 6,
    bio: '@quanminh1374',
    note: 'Ghi chú...'    
};

const ProfileHeader: React.FC = () => {
    return (
        <div className="flex items-center my-8">
            <div className="relative">
                <img src={accountData.profileImage} alt="Profile" className="rounded-full" width="100" height="100" />
                <div className="absolute top-0 left-0 bg-gray-800 text-white text-xs rounded-full px-2 py-1">{accountData.note}</div>
            </div>
            <div className="ml-8">
                <h2 className="text-2xl font-bold text-white">{accountData.username}</h2>
                <div className="flex items-center space-x-4 mt-2">
                    <Link to="/edit-profile" className="bg-gray-800 text-white px-4 py-2 rounded">Chỉnh sửa trang cá nhân</Link>
                    <button className="bg-gray-800 text-white px-4 py-2 rounded">Xem kho lưu trữ</button>
                    <i className="fas fa-cog text-white text-xl"></i>
                </div>
                <div className="flex space-x-4 mt-4 text-white">
                    <span>{accountData.posts} bài viết</span>
                    <span>{accountData.followers} người theo dõi</span>
                    <span>Đang theo dõi {accountData.following} người dùng</span>
                </div>
                <div className="mt-4">
                    <h3 className="font-bold">{accountData.fullName}</h3>
                    <p className="text-gray-400">{accountData.bio}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
