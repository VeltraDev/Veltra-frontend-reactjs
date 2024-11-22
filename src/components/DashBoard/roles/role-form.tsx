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
import { useState, useEffect } from "react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5; // Số lượng mục mỗi trang

  // Lọc danh sách permissions theo search query
  const filteredPermissions = permissions.filter((permission) =>
    permission.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPermissions.length / itemsPerPage);
  const currentPermissions = filteredPermissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleSubmit = (data: RoleFormValues) => {
    onSubmit({
      ...data,
      permissions: selectedPermissions,
    });
  };

  const handleToggleSelectAll = () => {
    const currentIds = currentPermissions.map((permission) => permission.id);
    if (currentIds.every((id) => selectedPermissions.includes(id))) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !currentIds.includes(id))
      );
    } else {
      setSelectedPermissions((prev) => [...new Set([...prev, ...currentIds])]);
    }
    setSelectAll(!selectAll);
  };

  const handleTogglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((perm) => perm !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const currentIds = currentPermissions.map((permission) => permission.id);
    setSelectAll(currentIds.every((id) => selectedPermissions.includes(id)));
  }, [currentPermissions, selectedPermissions]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

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
              <div className="space-y-4">
                {/* Input Search */}
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Search permissions..."
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                {/* Checkbox "Select All" */}
                <div className="flex items-center">
                  <Checkbox
                    checked={selectAll}
                    onChange={handleToggleSelectAll}
                  />
                  <span className="ml-2 font-semibold">Select All (Page)</span>
                </div>
                {/* Danh sách quyền */}
                {currentPermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center">
                    <Checkbox
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => handleTogglePermission(permission.id)}
                    />
                    <span className="ml-2">{permission.name}</span>
                  </div>
                ))}
                {/* Điều hướng phân trang */}
                <div className="flex justify-between mt-4">
                  <Button
                    variant="secondary"
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
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
