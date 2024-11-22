import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { rolesApi } from "@/services/api/roleService";
import { Role } from "@/types/dbType";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RoleActionsProps {
  role: Role;
  onEdit: (role: Role) => void; // Callback khi chỉnh sửa
  onDelete: (role: Role) => void; // Callback khi xóa
}

export function RoleActions({ role, onEdit, onDelete }: RoleActionsProps) {
  const navigate = useNavigate()
  const { toast } = useToast();
  const queryClient = useQueryClient();


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

  const handleUpdateRole = (id: string, data: Partial<Role>) => {
    navigate(`/dashboard/roles/edit/${id}`);
  };

  const handleDeleteRole = (id: string) => {
   
    deleteRoleMutation.mutate(id);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleUpdateRole(role.id)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDeleteRole(role.id)}
          className="text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
