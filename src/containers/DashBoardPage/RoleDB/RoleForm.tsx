import React, { useEffect, useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, Row, Col, Collapse, List, Switch, Input } from "antd";
import { CaretRightOutlined } from '@ant-design/icons';
import { http } from '@/api/http';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";

const { Panel } = Collapse;

const formSchema = z.object({
    name: z.string().min(1, "Tên là bắt buộc").max(255, "Tên tối đa 255 ký tự"),
    description: z.string().min(1, "Mô tả là bắt buộc").max(255, "Mô tả tối đa 255 ký tự"),
    permissions: z.array(z.string()),
});

interface RoleFormProps {
    initialValues?: {
        name: string;
        description: string;
        permissions: string[];
    };
    onSubmit: (values: z.infer<typeof formSchema>, removedPermissions?: string[]) => void;
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
                const response = await http.get("/permissions?page=1&limit=40&sortBy=module&order=DESC");
                setPermissions(response.data.results || []);
            } catch (error) {
                console.error("Error fetching permissions:", error);
            }
        }

        fetchPermissions();
    }, []);

    const groupedPermissions = permissions.reduce((acc, permission) => {
        const module = permission.module || "Other";
        if (!acc[module]) {
            acc[module] = [];
        }
        acc[module].push(permission);
        return acc;
    }, {});

    const handlePermissionChange = (module, selectedPermissions) => {
        const currentPermissions = form.getValues("permissions");
        const newPermissions = currentPermissions.filter(p => !groupedPermissions[module].some(gp => gp.id === p));
        const uniquePermissions = Array.from(new Set([...newPermissions, ...selectedPermissions]));
        form.setValue("permissions", uniquePermissions);
    };

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        const removedPermissions = initialValues?.permissions.filter(p => !values.permissions.includes(p)) || [];
        onSubmit(values, removedPermissions);
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <Row gutter={16}>
                        <Col span={12}>
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
                        </Col>
                        <Col span={12}>
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
                        </Col>
                        <Col span={24}>
                            <div className="mt-6 mb-4">
                                <h3 className="text-sm font-medium text-gray-900">Phân quyền</h3>
                            </div>
                            <FormItem label="Phân quyền">
                                <Collapse
                                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                    className="border-0"
                                >
                                    {Object.keys(groupedPermissions).map(module => (
                                        <Panel
                                            header={
                                                <div className="flex items-center justify-between w-full">
                                                    <span className="text-sm font-medium text-gray-700">{module}</span>
                                                    <Switch
                                                        checked={groupedPermissions[module].every(permission => form.watch("permissions").includes(permission.id))}
                                                        onChange={checked => {
                                                            const selectedPermissions = checked
                                                                ? [...form.watch("permissions"), ...groupedPermissions[module].map(permission => permission.id)]
                                                                : form.watch("permissions").filter(p => !groupedPermissions[module].some(gp => gp.id === p));
                                                            handlePermissionChange(module, selectedPermissions);
                                                        }}
                                                    />
                                                </div>
                                            }
                                            key={module}
                                            className="border-0"
                                        >
                                            <List
                                                className="divide-y divide-gray-100"
                                                dataSource={groupedPermissions[module]}
                                                renderItem={(permission) => (
                                                    <List.Item className="px-4 py-2 flex items-center justify-between">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium max-w-sm truncate text-gray-700">{permission.name}</span>
                                                        </div>
                                                        <Switch
                                                            checked={form.watch("permissions").includes(permission.id)}
                                                            onChange={checked => {
                                                                const selectedPermissions = checked
                                                                    ? [...form.watch("permissions"), permission.id]
                                                                    : form.watch("permissions").filter(p => p !== permission.id);
                                                                handlePermissionChange(module, selectedPermissions);
                                                            }}
                                                        />
                                                    </List.Item>
                                                )}
                                            />
                                        </Panel>
                                    ))}
                                </Collapse>
                            </FormItem>
                        </Col>
                    </Row>
                    <div className="flex justify-center">
                        <Button type="primary" htmlType="submit">
                            Lưu vai trò
                        </Button>
                        <Link to="/dashboard/role" className="ml-4">
                            <Button>
                                Quay lại
                            </Button>
                        </Link>
                    </div>
                </form>
            </Form>
        </>
    );
};