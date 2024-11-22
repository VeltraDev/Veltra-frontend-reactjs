import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserForm } from "../users/user-form";
import { RoleForm } from "./role-form";

interface RoleDialogProps {
  onSubmit: (data: any) => void;
  permissions: { id: string; name: string }[];
  role?: any;
}

export function RoleDialog({ onSubmit, permissions, role }: RoleDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {role ? "Edit Role" : "Add Role"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{role ? "Edit Role" : "Create Role"}</DialogTitle>
        </DialogHeader>
        <RoleForm
          onSubmit={onSubmit}
          permissions={permissions}
          initialValues={role}
        />
      </DialogContent>
    </Dialog>
  );
}