import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { permissionsApi } from "@/services/api/permissionService";


const formSchema = z.object({
    name: z.string().min(1, "Permission name is required").max(255),
    apiPath: z.string().min(1, "API path is required").max(255),
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"], {
        errorMap: () => ({ message: "Method is required" }),
    }),
    module: z.string().min(1, "Module is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function EditPermissionPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [permission, setPermission] = useState(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            apiPath: "",
            method: "",
            module: "",
        },
    });
 
    useEffect(() => {
        async function fetchData() {
            if (id) {
                const data  = await permissionsApi.getPermission(id);
                setPermission(data);
                form.reset({
                    name: data?.name,
                    apiPath: data?.apiPath,
                    method: data?.method,
                    module: data?.module,
                });
            }
        }
        fetchData();
    }, [id, form]);

    const onSubmit = async (values: FormValues) => {
        if (id) {
            await permissionsApi.updatePermission(id, values);
            navigate("/dashboard/permissions");
        }
    };

    if (!permission) {
        return <div>Loading...</div>;
    }

    return (
        <Form {...form}>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Permission Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Permission Name" {...field} />
                        </FormControl>
                        <FormDescription>Enter the permission name</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="apiPath" render={({ field }) => (
                    <FormItem>
                        <FormLabel>API Path</FormLabel>
                        <FormControl>
                            <Input placeholder="API Path" {...field} />
                        </FormControl>
                        <FormDescription>Enter the API path</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="method" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Method</FormLabel>
                        <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select HTTP method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GET">GET</SelectItem>
                                    <SelectItem value="POST">POST</SelectItem>
                                    <SelectItem value="PUT">PUT</SelectItem>
                                    <SelectItem value="PATCH">PATCH</SelectItem>
                                    <SelectItem value="DELETE">DELETE</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormDescription>Select the HTTP method</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="module" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Module</FormLabel>
                        <FormControl>
                            <Input placeholder="Module" {...field} />
                        </FormControl>
                        <FormDescription>Enter the module name</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
