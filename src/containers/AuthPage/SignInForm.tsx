import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { clearError } from '@/redux/authSlice';
import { RootState } from '@/redux/store';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ErrorModal from '@/components/auth/ErrorModal';

const formSchema = z.object({
    username: z.string().min(3, {
        message: 'Username must be at least 3 characters.',
    }),
    password: z.string().min(6, {
        message: 'Password must be at least 6 characters.',
    }),
});

type FormData = z.infer<typeof formSchema>;

export function SignInForm() {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || '/chat';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const error = useSelector((state: RootState) => state.auth.error);
    const dispatch = useDispatch();

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
            navigate(from, { replace: true });
        } catch {
            setIsModalOpen(true); // Hiển thị modal lỗi
        }
    };

    useEffect(() => {
        if (error) {
            setIsModalOpen(true);
        }
    }, [error]);

    useEffect(() => {
        setIsModalOpen(false); 
    }, []);
    return (
        <>
            <ErrorModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                errorMessage={error || 'Thông tin đăng nhập không đúng. Vui lòng thử lại!'}
                title="Đăng nhập thất bại"
            />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Username</FormLabel>
                                <FormControl>
                                    <Input className="text-blue-500"
                                        type="text"
                                        placeholder="Enter your username"
                                        {...field}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage className='text-red-500' />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Password</FormLabel>
                                <FormControl>
                                    <Input className="text-blue-500"
                                        type="password"
                                        placeholder="********"
                                        {...field}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage className='text-red-500' />
                            </FormItem>
                        )}
                    />

                    <Button
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
                    </Button>

                    <p className="text-sm text-gray-500 ">
                        <Link to="/forgot-password" className="text-gray-700 underline hover:text-white"> Quên mật khẩu?</Link>
                    </p>
                </form>
            </Form>
        </>
    );
}
