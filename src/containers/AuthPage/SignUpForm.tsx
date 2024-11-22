"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";

import { http } from '@/api/http';
import { useNavigate } from "react-router-dom";
import PasswordInput from "@/components/auth/PasswordInput";
import EmailVerificationModal from "@/components/auth/EmailVerificationModal";
import ErrorModal from "@/components/auth/ErrorModal"; 

const formSchema = z.object({
    firstname: z.string().min(1, "Vui lòng nhập tên."),
    lastname: z.string().min(1, "Vui lòng nhập họ."),
    email: z
        .string()
        .email({
            message: "Vui lòng nhập một địa chỉ email hợp lệ.",
        }),
    password: z
        .string()
        .min(8, {
            message: "Mật khẩu phải có ít nhất 8 ký tự.",
        })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {
                message:
                    "Mật khẩu phải chứa ít nhất một chữ cái viết thường, một chữ cái viết hoa, một chữ số và một ký tự đặc biệt.",
            }
        ),
    passwordConfirmation: z.string(),
    marketingAccept: z.boolean().default(false).optional(),
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "Mật khẩu không khớp",
    path: ["passwordConfirmation"],
});

export default function SignUpForm() {
    const [verificationSent, setVerificationSent] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false); // Thêm trạng thái cho lỗi
    const [errorMessage, setErrorMessage] = useState<string>(""); // Thêm thông báo lỗi
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            passwordConfirmation: "",
            marketingAccept: false,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true); // Bắt đầu trạng thái loading
        try {
            const response = await http.post(
                "/auth/register",
                {
                    firstName: values.firstname,
                    lastName: values.lastname,
                    email: values.email,
                    password: values.password,
                },
            );

            if (response.code === 1000) {
                setVerificationSent(true);
                setEmail(values.email); // Lưu email để truyền vào modal
                setIsModalOpen(true); // Mở modal sau khi đăng ký thành công
            }
        } catch (error: any) {
            console.error("Đăng ký thất bại:", error.message);
            setErrorMessage(error.message || "Đã xảy ra lỗi, vui lòng thử lại."); // Đặt thông báo lỗi
            setErrorModalOpen(true); // Hiển thị modal lỗi
        } finally {
            setIsSubmitting(false); // Kết thúc trạng thái loading
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Tên</FormLabel>
                                <FormControl>
                                    <Input className="text-blue-500"
                                        type="text"
                                        placeholder="Nguyễn"
                                        {...field}
                                        disabled={isSubmitting} // Vô hiệu hóa khi đăng ký
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Họ</FormLabel>
                                <FormControl>
                                    <Input className="text-blue-500"
                                        type="text"
                                        placeholder="Văn A"
                                        {...field}
                                        disabled={isSubmitting} // Vô hiệu hóa khi đăng ký
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Email</FormLabel>
                                <FormControl>
                                    <Input className="text-blue-500"
                                        type="email"
                                        placeholder="nguyenvan@example.com"
                                        {...field}
                                        disabled={isSubmitting} // Vô hiệu hóa khi đăng ký
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <PasswordInput isDisabled={isSubmitting} /> {/* Truyền trạng thái vào */}
                    <FormField
                        control={form.control}
                        name="passwordConfirmation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Xác nhận mật khẩu</FormLabel>
                                <FormControl>
                                    <Input className="text-blue-500" type="password" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="marketingAccept"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isSubmitting} // Vô hiệu hóa khi đăng ký
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="text-white">
                                        Tôi muốn nhận email về sự kiện, cập nhật sản phẩm và thông báo từ công ty.
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />

                    <div className="text-sm text-gray-500">
                        Bằng việc tạo tài khoản, bạn đồng ý với{" "}
                        <a href="#" className="text-gray-700 underline">
                            điều khoản và điều kiện
                        </a>{" "}
                        và{" "}
                        <a href="#" className="text-gray-700 underline">
                            chính sách bảo mật
                        </a>
                        .
                    </div>

                    <div className="flex items-center justify-between">
                        <Button
                            type="submit"
                            className="text-white flex items-center justify-center"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center">
                                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                                    Đang xử lý...
                                </div>
                            ) : (
                                "Tạo tài khoản"
                            )}
                        </Button>
                        <p className="text-sm text-gray-500">
                            Đã có tài khoản?{" "}
                            <a href="#" className="text-gray-700 underline">
                                Đăng nhập
                            </a>
                            .
                        </p>
                    </div>
                </form>
            </Form>

            <EmailVerificationModal
                isOpen={isModalOpen}
                onRequestClose={() => {
                    setIsModalOpen(false);
                }}
                email={email} // Truyền email vào modal
            />

            <ErrorModal
                isOpen={errorModalOpen}
                onRequestClose={() => setErrorModalOpen(false)}
                errorMessage={errorMessage} // Truyền thông báo lỗi
                title="Đăng ký thất bại"
            />
        </>
    );
}
