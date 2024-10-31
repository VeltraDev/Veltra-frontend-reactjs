import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EditProfilePage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl text-white font-bold my-4">Chỉnh sửa hồ sơ</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <div className="mt-4">
            <label htmlFor="avatar" className="block mb-2 text-white">
              Ảnh đại diện:
            </label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-black border-2 border-gray-500 text-white"
            />
          </div>
          <label htmlFor="name" className="block mb-2 text-white">
            Tên:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-black border-2 border-gray-500 text-white"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="email" className="block mb-2 text-white">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-black border-2 border-gray-500 text-white"
          />
        </div>
        {/* Thêm các trường nhập liệu cho các thông tin hồ sơ khác */}
        <div className="mt-6 flex justify-end">
          <Link to="/profile" type="submit" className="bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded">
            Lưu thay đổi
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;