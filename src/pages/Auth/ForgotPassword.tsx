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

import http from "@/utils/http";

const formSchema = z.object({
  email: z.string().email({
    message: "Vui lòng nhập địa chỉ email hợp lệ.",
  }),
});

export default function ForgotPasswordPage() {
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await http.post('/auth/forgot-password', {
        email: values.email,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data && response.data.code === 201) {
        setRequestStatus("Yêu cầu đặt lại mật khẩu thành công. Vui lòng kiểm tra email của bạn.");
      } else {
        setRequestStatus("Yêu cầu đặt lại mật khẩu thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error('Yêu cầu đặt lại mật khẩu thất bại:', error);
      setRequestStatus("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="johndoe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="text-white">Đặt lại mật khẩu</Button>

        {requestStatus && (
          <p className={`text-center ${requestStatus.includes("thành công") ? "text-green-600" : "text-red-600"}`}>
            {requestStatus}
          </p>
        )}

        <p className="text-sm text-gray-500">
          Nhớ mật khẩu?
          <a href="/sign-in" className="text-gray-700 underline"> Đăng nhập</a>.
        </p>
      </form>
    </Form>
  );
}
