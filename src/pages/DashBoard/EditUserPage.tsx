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
import { rolesApi, usersApi } from "@/services/api/userService";
import { User } from "@/types/auth";

const formSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(255),
    lastName: z.string().min(1, "Last name is required").max(255),
    email: z.string().email("Invalid email format"),
    roleId: z.string().min(1, "Role is required"), // Expecting role ID
});

type FormValues = z.infer<typeof formSchema>;

type Role = {
    id: string;
    name: string;
};

export function EditUserDBPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<Role[]>([]); // List of roles

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            roleId: "",
        },
    });

    useEffect(() => {
        async function fetchData() {
            if (id) {
                const userData = await usersApi.getUser(id);
                const rolesData = await rolesApi.getRoles(); // Fetch roles for selection
                if (userData?.data && rolesData?.data) {
                    setUser(userData.data);
                    setRoles(rolesData.data.results);
                    form.reset({
                        firstName: userData.data.firstName,
                        lastName: userData.data.lastName,
                        email: userData.data.email,
                        roleId: userData.data.role.id,
                    });
                }
            }
        }
        fetchData();
    }, [id, form]);

    const onSubmit = async (values: FormValues) => {
        if (id) {
            
            const { email, ...userData } = values;
            await usersApi.updateUser(id, userData);
            navigate("/dashboard/users");
        }
    };


    if (!user || roles.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <Form {...form}>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                            <Input placeholder="First Name" {...field} />
                        </FormControl>
                        <FormDescription>Enter the user's first name</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormDescription>Enter the user's last name</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormDescription>Enter the user's email</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="roleId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.id}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormDescription>Select the user's role</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
