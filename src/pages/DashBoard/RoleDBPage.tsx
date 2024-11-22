import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { columns } from "@/components/DashBoard/roles/columns";
import { RoleDialog } from "@/components/DashBoard/roles/role-dialog";
import { RolesTable } from "@/components/DashBoard/roles/roles-table";
import { useToast } from "@/hooks/use-toast";
import { rolesApi } from "@/services/api/roleService";
import { Role } from "@/types/dbType";
import { Button } from "@/components/ui/button";

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
        queryFn: () => rolesApi.getPermissions(1, 10, "module", "DESC", "REACTION TYPES"),
    });

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
  

    // Handlers
    const handleCreateRole = (data: any) => {
        createRoleMutation.mutate(data);
    };

   

    // Loading state
    if (isLoadingRoles || isLoadingPermissions) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-4">
           
                <h1 className="text-xl font-semibold">Roles Management</h1>
                {/* Button to open create dialog */}
                <Button onClick={handleCreateRole} variant="outline" className="mb-4">
                    Create Permission
                </Button>
        
            <RolesTable
                columns={columns}
                data={rolesData}
                onDelete={(id) => handleDeleteRole(id)}
                onUpdate={(id, role) =>
                    handleUpdateRole(id, { ...role, permissions: role.permissions })
                }
            />
        </div>
    );
}
