import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { columns } from "@/components/DashBoard/roles/columns";
import { RoleDialog } from "@/components/DashBoard/roles/role-dialog";
import { RolesTable } from "@/components/DashBoard/roles/roles-table";
import { useToast } from "@/hooks/use-toast";
import { rolesApi } from "@/services/api/roleService";
import { Role } from "@/types/dbType";

export function RolesDBPage() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // Fetch roles
    const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
        queryKey: ["roles"],
        queryFn: rolesApi.getRoles,
    });

    // Fetch permissions
    const { data: permissionsData, isLoading: isLoadingPermissions } = useQuery({
        queryKey: ["permissions"],
        queryFn: () => rolesApi.getPermissions(1, 60, "module", "DESC", "REACTION TYPES"),
    });
    console.log(permissionsData)
    // Create role mutation
    const createRoleMutation = useMutation({
        mutationFn: rolesApi.createRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            toast({
                title: "Success",
                description: "Role created successfully",
            });
        },
    });

    // Update role mutation
    const updateRoleMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Role> }) =>
            rolesApi.updateRole(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            toast({
                title: "Success",
                description: "Role updated successfully",
            });
        },
    });

    // Delete role mutation
    const deleteRoleMutation = useMutation({
        mutationFn: (id: string) => rolesApi.deleteRole(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            toast({
                title: "Success",
                description: "Role deleted successfully",
            });
        },
    });

    // Handlers
    const handleCreateRole = (data: any) => {
        createRoleMutation.mutate(data);
    };

    const handleUpdateRole = (id: string, data: Partial<Role>) => {
        updateRoleMutation.mutate({ id, data });
    };

    const handleDeleteRole = (id: string) => {
        deleteRoleMutation.mutate(id);
    };

    // Loading state
    if (isLoadingRoles || isLoadingPermissions) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-4">
           
                <h1 className="text-xl font-semibold">Roles Management</h1>
                <RoleDialog onSubmit={handleCreateRole} permissions={permissionsData} />
         
            <RolesTable
                columns={columns}
                data={rolesData}
                onDelete={handleDeleteRole}
                onUpdate={(id, role) =>
                    handleUpdateRole(id, { ...role, permissions: role.permissions })
                }
            />
        </div>
    );
}
