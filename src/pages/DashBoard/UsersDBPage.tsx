import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { columns } from "@/components/DashBoard/users/columns";
import { UserDialog } from "@/components/DashBoard/users/user-dialog";
import { UsersTable } from "@/components/DashBoard/users/users-table";

import { useToast } from "@/hooks/use-toast";
import { usersApi } from "@/services/api/userService";

export function UsersDBPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getUsers(),
  });

  const createUserMutation = useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      usersApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
  });

  const [editingUser, setEditingUser] = useState<any | null>(null);

  const handleCreateUser = async (data: any) => {
    try {
      await createUserMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUpdateUser = async (id: string, data: any) => {
    try {
      await updateUserMutation.mutateAsync({ id, data });
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Failed to load users. Please try again later.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <UserDialog
          onSubmit={(data) => handleCreateUser(data)}
        />
      </div>
      <UsersTable
        columns={columns}
        data={data?.results || []}
        onDelete={(id) => deleteUserMutation.mutate(id)}
        onEdit={(user) => setEditingUser(user)}
      />
      {editingUser && (
        <UserDialog
          user={editingUser}
          onSubmit={(data) => handleUpdateUser(editingUser.id, data)}
          trigger={null} // Hide trigger button for edit mode
        />
      )}
    </div>
  );
}
