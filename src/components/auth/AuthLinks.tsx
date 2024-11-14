import React from 'react';
import { Link } from 'react-router-dom';

export function AuthLinks() {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500">
        Bằng cách tạo tài khoản, bạn đồng ý với{' '}
        <Link to="/terms" className="text-gray-700 underline hover:text-blue-600">
          điều khoản và điều kiện
        </Link>{' '}
        và{' '}
        <Link to="/privacy" className="text-gray-700 underline hover:text-blue-600">
          chính sách bảo mật
        </Link>{' '}
        của chúng tôi.
      </div>

      <div className="text-sm text-gray-500 text-center">
        <Link to="/forgot-password" className="text-gray-700 underline hover:text-blue-600">
          Quên mật khẩu?
        </Link>
      </div>

      <div className="text-sm text-gray-500 text-center">
        Bạn chưa có tài khoản?{' '}
        <Link to="/signup" className="text-gray-700 underline hover:text-blue-600">
          Đăng ký
        </Link>
      </div>
    </div>
  );
}