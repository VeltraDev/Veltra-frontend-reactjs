import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";


const userFormSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  roleId: z.string().uuid(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormValues) => Promise<void>; // Xử lý async
}

export function UserForm({ user, onSubmit }: UserFormProps) {
  const [loading, setLoading] = useState(false);
const {toast} =useToast()
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user
      ? {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user?.role?.id,
      }
      : {
        email: "",
        firstName: "",
        lastName: "",
        roleId: "",
      },
  });

  const handleFormSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);
      await onSubmit(data);
      toast({ title: user ? "User updated successfully!" : "User created successfully!" });
    } catch (error: any) {
      toast({ title: "An error occurred", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="50acf616-d16f-48a3-b787-d545260ce3dc">USER</SelectItem>
                  <SelectItem value="58dfb4e4-6957-43d7-b078-7f2fe82b5328">ADMIN</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : user ? "Update User" : "Create User"}
        </Button>
      </form>
    </Form>
  );
}
