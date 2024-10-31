import React, { useState, useEffect } from "react";
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
import http from "@/utils/http";

const formSchema = z.object({
    name: z.string().min(1, "Tên là bắt buộc").max(255, "Tên tối đa 255 ký tự"),
    description: z.string().min(1, "Mô tả là bắt buộc").max(255, "Mô tả tối đa 255 ký tự"),
    isActive: z.boolean(),
    permissions: z.string().min(1, "Phân quyền là bắt buộc").max(255, "Phân quyền tối đa 255 ký tự"),
});

export function RoleDB() {
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            permissions: "",
            isActive: true,
        },
    });

    useEffect(() => {
        async function fetchRoles() {
            try {
                const response = await http.get("/roles");
                setRoles(response.data.data || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching roles:", error);
                setLoading(false);
            }
        }

        fetchRoles();
    }, []);


    const permissionsOptions = roles.map(role => role.name);
    const permissionSchema = z.string().refine(value => permissionsOptions.includes(value), {
        message: "Phân quyền không hợp lệ.",
    });

    const extendedFormSchema = formSchema.extend({
        permissions: permissionSchema,
    });

    const formWithRoles = useForm<z.infer<typeof extendedFormSchema>>({
        resolver: zodResolver(extendedFormSchema),
        defaultValues: {
            name: "",
            description: "",
            permissions: "",
            isActive: true,
        },
    });


    function onSubmit(values: z.infer<typeof extendedFormSchema>) {
        console.log(values);
    }

    return (
        <Form {...formWithRoles}>
            <form noValidate onSubmit={formWithRoles.handleSubmit(onSubmit)} className="space-y-8">
                {/* Name Field */}
                <FormField
                    control={formWithRoles.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên vai trò</FormLabel>
                            <FormControl>
                                <Input placeholder="Tên vai trò" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Description Field */}
                <FormField
                    control={formWithRoles.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả</FormLabel>
                            <FormControl>
                                <Input placeholder="Mô tả vai trò" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Active Field */}
                <FormField
                    control={formWithRoles.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <FormLabel className="text-base">Kích hoạt</FormLabel>
                            <FormControl>
                                <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Permissions Field */}
                <FormField
                    control={formWithRoles.control}
                    name="permissions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phân quyền</FormLabel>
                            <FormControl>
                                <select
                                    {...field}
                                    disabled={loading}
                                    className="border p-2 rounded-md"
                                >
                                    <option value="">Chọn phân quyền</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.name}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading}>
                    {loading ? "Đang tải..." : "Lưu vai trò"}
                </Button>
            </form>
        </Form>
    );
}
