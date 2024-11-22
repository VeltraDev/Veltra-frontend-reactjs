import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { permissionsApi } from "@/services/api/permissionService";
import { useToast } from "@/hooks/use-toast";

// Import ShadCN components

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PermissionsTable } from "@/components/DashBoard/permissions/permissions-table";
import { PermissionActions } from "@/components/DashBoard/permissions/permission-actions";


// Các HTTP method options
const methodOptions = ["GET", "POST", "PUT", "DELETE"];

export function PermissionsDBPage() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editPermission, setEditPermission] = useState(null); // Lưu permission cần sửa

    const { data, isLoading } = useQuery({
        queryKey: ["permissions"],
        queryFn: () => permissionsApi.getPermissions(),
    });

    const createPermission = useMutation({
        mutationFn: permissionsApi.createPermission,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
            toast({ title: "Success", description: "Permission created successfully" });
            setDialogOpen(false);
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error?.message || "An error occurred" });
        },
    });

    const updatePermission = useMutation({
        mutationFn: permissionsApi.updatePermission,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
            toast({ title: "Success", description: "Permission updated successfully" });
            setDialogOpen(false);
            setEditPermission(null); // Reset edit state
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error?.message || "An error occurred" });
        },
    });

    const deletePermission = useMutation({
        mutationFn: permissionsApi.deletePermission,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
            toast({ title: "Success", description: "Permission deleted successfully" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error?.message || "An error occurred" });
        },
    });

    // React Hook Form setup
    const { handleSubmit, register, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            apiPath: "",
            method: "",
            module: "",
        },
    });

    // Cập nhật giá trị method khi chọn trong Select
    const handleMethodChange = (value: string) => {
        setValue("method", value); // Cập nhật giá trị method trong form
    };

    // Form submit (create or update)
    const onSubmit = (data: any) => {
        if (editPermission) {
            updatePermission.mutate({ id: editPermission.id, ...data });
        } else {
            createPermission.mutate(data);
        }
    };

    // Open dialog for editing permission
    const handleEditPermission = (permission: any) => {
        setEditPermission(permission);
        setDialogOpen(true);
        reset(permission); // Reset form with the permission data for editing
    };

    // Open dialog for creating new permission
    const handleCreatePermission = () => {
        setEditPermission(null);
        setDialogOpen(true);
        reset(); // Reset form for creating new permission
    };

    // Handle delete permission
 

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Permissions Management</h1>

            {/* Button to open create dialog */}
            <Button onClick={handleCreatePermission} variant="outline" className="mb-4">
                Create Permission
            </Button>

            {/* Dialog to create or edit permission */}
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                {/* <DialogTrigger asChild>
                    <Button onClick={() => setDialogOpen(true)} variant="outline" />
                </DialogTrigger> */}

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editPermission ? "Edit Permission" : "Create Permission"}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Permission Name</Label>
                            <Input id="name" {...register("name", { required: "Permission name is required" })} placeholder="Enter permission name" />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="apiPath">API Path</Label>
                            <Input id="apiPath" {...register("apiPath", { required: "API path is required" })} placeholder="Enter API path (e.g., /api/v1/comments/:id/reactions)" />
                            {errors.apiPath && <p className="text-red-500 text-xs">{errors.apiPath.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="method">Method</Label>
                            <Select onValueChange={handleMethodChange} value={register("method").value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select HTTP Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    {methodOptions.map((method) => (
                                        <SelectItem key={method} value={method}>
                                            {method}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.method && <p className="text-red-500 text-xs">{errors.method.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="module">Module</Label>
                            <Input id="module" {...register("module", { required: "Module is required" })} placeholder="Enter module (e.g., COMMENTS)" />
                            {errors.module && <p className="text-red-500 text-xs">{errors.module.message}</p>}
                        </div>

                        <DialogFooter>
                            <Button type="submit" variant="primary">
                                {editPermission ? "Update" : "Create"}
                            </Button>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Permissions Table */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold">Existing Permissions</h2>
                <PermissionsTable
                    data={data?.results || []}
                 
                />

            </div>
        </div>
    );
}
