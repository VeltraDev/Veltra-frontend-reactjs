"use client"

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
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { http } from '@/api/http';

// Schema validation
const formSchema = z.object({
  newPassword: z.string()
    .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/, {
      message: "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt.",
    }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu không khớp.",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const [resetStatus, setResetStatus] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get('token');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await http.post(
        `/auth/reset-password`,
        {
          token,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.statusCode === 201) {
        setResetStatus("Đặt lại mật khẩu thành công. Đang chuyển hướng đến trang đăng nhập...");
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      } else {
        setResetStatus("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error('Đặt lại mật khẩu thất bại:', error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          setResetStatus("Định dạng mật khẩu không hợp lệ. Vui lòng đảm bảo mật khẩu đáp ứng các yêu cầu.");
        } else {
          setResetStatus("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
      } else {
        setResetStatus("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Mật khẩu mới</FormLabel>
              <FormControl>
                <Input className="text-white placeholder:text-white" type="password" {...field} />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-gray-500">
                Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
              </p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Xác nhận mật khẩu mới</FormLabel>
              <FormControl>
                <Input className="text-white placeholder:text-white" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="text-white">Đặt lại mật khẩu</Button>

        {resetStatus && (
          <p className={`text-center ${resetStatus.includes("thành công") ? "text-green-600" : "text-red-600"}`}>
            {resetStatus}
          </p>
        )}
      </form>
    </Form>
  );
}
