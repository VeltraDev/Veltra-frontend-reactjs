import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const formSchema = z.object({
    username: z.string().min(3, {
        message: 'Username must be at least 3 characters.',
    }),
    password: z.string().min(6, {
        message: 'Password must be at least 6 characters.',
    }),
});

type FormData = z.infer<typeof formSchema>;

interface SignInFormProps {
    onStatusChange: (status: string) => void;
}

export function SignInForm({ onStatusChange }: SignInFormProps) {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || '/chat';

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = async (values: FormData) => {
        try {
            await login({
                username: values.username,
                password: values.password,
            });
            onStatusChange('Login successful!');
            navigate(from, { replace: true });
        } catch (error: any) {
            onStatusChange(error.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <input
                        {...form.register('username')}
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter your username"
                        disabled={isLoading}
                    />
                    {form.formState.errors.username && (
                        <p className="mt-1 text-sm text-red-600">{form.formState.errors.username.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        {...form.register('password')}
                        type="password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="********"
                        disabled={isLoading}
                    />
                    {form.formState.errors.password && (
                        <p className="mt-1 text-sm text-red-600">{form.formState.errors.password.message}</p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className="flex items-center">
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                        Signing in...
                    </div>
                ) : (
                    'Sign in'
                )}
            </button>
        </form>
    );
}