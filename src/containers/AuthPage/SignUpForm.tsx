"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import http from "@/utils/http";
import { useNavigate } from "react-router-dom";

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

export default function TrangDangKy() {
    const [verificationSent, setVerificationSent] = useState<boolean>(false);
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

            if (response.data && response.data.code === 1000) {
                setVerificationSent(true);
            }
        } catch (error) {
            console.error("Đăng ký thất bại:", error);
        }
    }

    if (verificationSent) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                    <h2 className="text-2xl font-bold mb-4">Vui lòng kiểm tra email của bạn</h2>
                    <p className="mb-4">
                        Một email xác minh đã được gửi đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn để xác minh tài khoản.
                    </p>
                    <p className="text-sm text-gray-500">
                        Chưa nhận được email? Kiểm tra thư mục spam hoặc{" "}
                        <Button
                            variant="link"
                            className="p-0 h-auto font-normal"
                            onClick={() => setVerificationSent(false)}
                        >
                            thử đăng ký lại
                        </Button>
                        .
                    </p>
                </div>
            </div>
        );
    }

    return (
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
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Mật khẩu</FormLabel>
                            <FormControl>
                                <Input className="text-blue-500" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="passwordConfirmation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Xác nhận mật khẩu</FormLabel>
                            <FormControl>
                                <Input className="text-blue-500" type="password" {...field} />
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
                    <Button type="submit" className="text-white">
                        Tạo tài khoản
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
    );
}
