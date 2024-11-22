import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Permission } from "@/types/dbType";


const permissionFormSchema = z.object({
    name: z.string().min(3, "Permission name must be at least 3 characters"),
    description: z.string().optional(),
});

type PermissionFormValues = z.infer<typeof permissionFormSchema>;

interface PermissionFormProps {
    permission?: Permission;
    onSubmit: (data: PermissionFormValues) => void;
}

export function PermissionForm({ permission, onSubmit }: PermissionFormProps) {
    const form = useForm<PermissionFormValues>({
        resolver: zodResolver(permissionFormSchema),
        defaultValues: permission || { name: "", description: "" },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
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
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    {permission ? "Update Permission" : "Create Permission"}
                </Button>
            </form>
        </Form>
    );
}
