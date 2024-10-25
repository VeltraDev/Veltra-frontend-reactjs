import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Select from "react-select";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formSchema = z.object({
    name: z.string().min(1, "Tên là bắt buộc").max(255, "Tên tối đa 255 ký tự"),
    description: z.string().min(1, "Mô tả là bắt buộc").max(255, "Mô tả tối đa 255 ký tự"),
    permissions: z.array(z.string()),
});

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZiN2VjOGE2LWQ2YTQtNDUyNy1iODgyLWFiYzYyNzIxOTA2YiIsImVtYWlsIjoidHJhbnF1YW5taWthekBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJUcuG6p24gTmd1eeG7hW4gTWluaCIsImxhc3ROYW1lIjoiUXXDom4iLCJyb2xlIjp7ImlkIjoiNWM1Zjg2YzgtMWQ4ZS00ZTYyLThkOTctOGIyNjE1NGJhM2IxIiwibmFtZSI6IkFETUlOIn0sImlhdCI6MTcyOTg1NjMxMSwiZXhwIjoxNzI5ODU4MTExfQ.U5S0OJ8gSwnZ5tpJ1Crdzu20S6On9w33tk4ijvL4FsY';

interface RoleFormProps {
    initialValues?: {
        name: string;
        description: string;
        permissions: string[];
    };
    onSubmit: (values: z.infer<typeof formSchema>) => void;
}

export const RoleForm: React.FC<RoleFormProps> = ({ initialValues, onSubmit }) => {
    const [permissions, setPermissions] = useState<any[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues || {
            name: "",
            description: "",
            permissions: [],
        },
    });

    useEffect(() => {
        async function fetchPermissions() {
            try {
                const response = await http.get("/permissions?page=1&limit=40&sortBy=module&order=DESC", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPermissions(response.data.data.results || []);
            } catch (error) {
                console.error("Error fetching permissions:", error);
            }
        }

        fetchPermissions();
    }, []);

    const permissionOptions = permissions.map(permission => ({
        value: permission.id,
        label: permission.name,
    }));

    const availablePermissionOptions = permissionOptions.filter(option => !form.watch("permissions").includes(option.value));

    return (
        <>
            <ToastContainer />
            <Form {...form}>
                <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Name Field */}
                    <FormField
                        control={form.control}
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
                        control={form.control}
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

                    {/* Permissions Field */}
                    <FormField
                        control={form.control}
                        name="permissions"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phân quyền</FormLabel>
                                <FormControl>
                                    
                                        <Select
                                            isMulti
                                            options={availablePermissionOptions}
                                            value={permissionOptions.filter(option => field.value.includes(option.value))}
                                            onChange={(selectedOptions) => {
                                                field.onChange(selectedOptions.map(option => option.value));
                                            }}
                                        />
                                    
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-center ">
                        <Button className="text-white" type="submit">
                            Lưu vai trò
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
};