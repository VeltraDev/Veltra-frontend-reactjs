import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Edit, Trash } from "lucide-react";
import { Permission, Role } from "@/types/dbType";
import { permissionsApi } from "@/services/api/permissionService";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface PermissionActionsProps {
  per: Permission;
}
export function PermissionActions({ per }: PermissionActionsProps) {
  const navigate = useNavigate()
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const deleteRoleMutation = useMutation({
    mutationFn: (id: string) => permissionsApi.deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
    },
  });

  const handleUpdatePer = (id: string) => {
    navigate(`/dashboard/permissions/edit/${id}`);
  };

  const handleDeletePer = (id: string) => {
    console.log(id)
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
        <DropdownMenuItem onClick={() => handleUpdatePer(per.id)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDeletePer(per.id)}
          className="text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
