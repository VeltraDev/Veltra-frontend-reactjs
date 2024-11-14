import React, { useState } from 'react';
import { SignInForm } from '@/components/auth/SignInForm';
import { AuthLinks } from '@/components/auth/AuthLinks';

export default function SignInPage() {
  const [loginStatus, setLoginStatus] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập vào tài khoản
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignInForm onStatusChange={setLoginStatus} />

          {loginStatus && (
            <div className={`mt-4 text-center ${
              loginStatus.includes('thành công') ? 'text-green-600' : 'text-red-600'
            }`}>
              {loginStatus}
            </div>
          )}

          <div className="mt-6">
            <AuthLinks />
          </div>
        </div>
      </div>
    </div>
  );
}