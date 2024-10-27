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
import http from "@/utils/http";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
    username: z.string().email({
        message: "Vui lòng nhập địa chỉ username hợp lệ.",
    }),
    password: z.string().min(6, {
        message: "Mật khẩu phải chứa ít nhất 6 ký tự.",
    }),
});

export default function SignInPage() {
    const [loginStatus, setLoginStatus] = useState<string | null>(null);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "thuyy566@gmail.com",
            password: "veltra123",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await http.post(
                "/auth/login",
                {
                    username: values.username,
                    password: values.password,
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (response.data && response.data.data.access_token) {
               
                localStorage.setItem("accessToken", response.data.data.access_token);
                localStorage.setItem("user", JSON.stringify(response.data.data.user));

                const userRole = response.data.data.user.role.name;
                setLoginStatus("Đăng nhập thành công!");

                if (userRole === "ADMIN") {
                    navigate("/dashboard"); 
                } else {
                    navigate("/"); 
                }
            } else {
                const message =
                    response.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
                setLoginStatus(message);
            }
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
            setLoginStatus(message);
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input
                                    className="text-white"
                                    type="text"
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
                            <FormLabel>Mật khẩu</FormLabel>
                            <FormControl>
                                <Input
                                    className="text-white"
                                    type="password"
                                    placeholder="********"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="text-sm text-gray-500">
                    Bằng cách tạo tài khoản, bạn đồng ý với{" "}
                    <a href="#" className="text-gray-700 underline">
                        điều khoản và điều kiện
                    </a>{" "}
                    và{" "}
                    <a href="#" className="text-gray-700 underline">
                        chính sách bảo mật
                    </a>{" "}
                    của chúng tôi.
                </div>

                <div className="flex items-center justify-between">
                    <Button type="submit" className="text-white">
                        Đăng nhập
                    </Button>

                    {loginStatus && (
                        <p
                            className={`text-center ${loginStatus.includes("thành công")
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                        >
                            {loginStatus}
                        </p>
                    )}

                    <p className="text-sm text-gray-500">
                        Bạn đã có tài khoản?{" "}
                        <a href="#" className="text-gray-700 underline">
                            Đăng nhập
                        </a>
                        .
                    </p>
                </div>

                <p className="text-sm text-gray-500 text-center">
                    <a href="/forgot-password" className="text-gray-700 underline">
                        Quên mật khẩu?
                    </a>
                </p>
            </form>
        </Form>
    );
}
