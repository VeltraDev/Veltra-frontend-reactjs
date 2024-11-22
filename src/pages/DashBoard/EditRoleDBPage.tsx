import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
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
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { rolesApi } from "@/services/api/roleService";
import { permissionsApi } from "@/services/api/permissionService"; // Giả sử bạn có API này

const formSchema = z.object({
    name: z.string().min(1, "Role name is required").max(255),
    description: z.string().optional(),
    permissions: z.array(z.string()).nonempty("At least one permission is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function EditRolePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [availablePermissions, setAvailablePermissions] = useState<any[]>([]); // Để chứa permissions (id, name, apiPath,...)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            permissions: [],
        },
    });

    useEffect(() => {
        async function fetchData() {
            const permissionsData = await permissionsApi.getPermissions(); // Lấy permissions từ API
            setAvailablePermissions(permissionsData.results || []);

            if (id) {
                const roleData = await rolesApi.getRole(id); // Lấy role hiện tại từ API
                if (roleData.data) {
                    form.reset({
                        name: roleData.data.name,
                        description: roleData.data.description || "",
                        permissions: roleData.data.permissions.map((permission: { id: string }) => permission.id), // Chỉ lấy id permissions
                    });
                }
            }
            setIsLoading(false);
        }
        fetchData();
    }, [id, form]);

    const onSubmit = async (values: FormValues) => {
        if (id) {
            await rolesApi.updateRole(id, values);
        } else {
            await rolesApi.createRole(values);
        }
        navigate("/dashboard/roles");
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter role name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter description (optional)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="permissions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Permissions</FormLabel>
                            <div className="grid grid-cols-2 gap-4">
                                {availablePermissions?.map((permission) => (
                                    <div key={permission.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={field.value.includes(permission.id)} // Kiểm tra permission.id có trong mảng không
                                            onCheckedChange={(checked) => {
                                                const newValue = checked
                                                    ? [...field.value, permission.id] // Thêm permission.id vào mảng
                                                    : field.value.filter((id) => id !== permission.id); // Loại bỏ permission.id khỏi mảng
                                                field.onChange(newValue);
                                            }}
                                        />
                                        <label className="flex flex-col">
                                            <span>{permission.name}</span>
                                            <span className="text-xs text-gray-500">{permission.apiPath}</span>

                                            {/* Thêm màu sắc dựa trên method */}
                                            <span
                                                className={`text-xs ${permission.method === "GET"
                                                        ? "bg-green-100 text-green-700"
                                                        : permission.method === "POST"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : permission.method === "DELETE"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-gray-100 text-gray-700"
                                                    } inline-block mt-1 px-2 py-1 rounded-full`}
                                            >
                                                {permission.method}
                                            </span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">{id ? "Update Role" : "Create Role"}</Button>
            </form>
        </Form>
    );
}
