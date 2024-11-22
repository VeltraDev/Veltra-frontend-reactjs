import { Plus } from "lucide-react";
import { UserForm } from "./user-form";
import { User } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UserDialogProps {
  user?: User;
  trigger?: React.ReactNode;
  onSubmit: (data: any) => Promise<void>;
}

export function UserDialog({ user, trigger, onSubmit }: UserDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Create User"}</DialogTitle>
        </DialogHeader>
        <UserForm user={user} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
