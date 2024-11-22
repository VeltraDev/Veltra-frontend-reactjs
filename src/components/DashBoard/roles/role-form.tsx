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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

const roleFormSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface RoleFormProps {
  onSubmit: (data: RoleFormValues) => void;
  permissions: { id: string; name: string }[];
}

export function RoleForm({ onSubmit, permissions }: RoleFormProps) {
  const [selectAll, setSelectAll] = useState(false);
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);



  // Cập nhật selectedPermissions khi form submit
  const handleSubmit = (data: RoleFormValues) => {
    onSubmit({
      ...data,
      permissions: selectedPermissions, // Gửi danh sách permissions đã chọn
    });
  };

  const handleToggleSelectAll = () => {
    if (selectAll) {
      // Nếu đang chọn tất cả, bỏ chọn tất cả
      setSelectedPermissions([]);
    } else {
      // Nếu chưa chọn tất cả, chọn tất cả
      setSelectedPermissions(permissions.map((permission) => permission.id));
    }
    setSelectAll(!selectAll);
  };

  const handleTogglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((perm) => perm !== id) : [...prev, id]
    );
  };
  useEffect(() => {
    setSelectAll(
      selectedPermissions.length > 0 && selectedPermissions.length === permissions.length
    );
  }, [selectedPermissions, permissions]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name</FormLabel>
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
        <FormField
          control={form.control}
          name="permissions"
          render={() => (
            <FormItem>
              <FormLabel>Permissions</FormLabel>
              <div className="space-y-2">
                {/* Checkbox "Select All" */}
                <div className="flex items-center">
                  <Checkbox
                    checked={selectAll}
                    onChange={handleToggleSelectAll}
                  />
                  <span className="ml-2 font-semibold">Select All</span>
                </div>
                {/* Các quyền cụ thể */}
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center">
                    <Checkbox
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => handleTogglePermission(permission.id)}
                    />
                    <span className="ml-2">{permission.name}</span>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Create Role
        </Button>
      </form>
    </Form>
  );
}