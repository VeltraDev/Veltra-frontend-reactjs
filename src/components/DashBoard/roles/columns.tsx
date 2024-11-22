import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { UserActions } from "../users/user-actions";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RoleActions } from "./role-actions";
import { useState } from "react";
import { Select, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SelectContent } from "@radix-ui/react-select";
import { differenceInDays } from "date-fns"; // Để tính toán ngày chênh lệch

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = row.original.name;
      return (
        <Badge variant="outline" className="font-semibold">
          {name}
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.original.description;
      return <span className="text-sm">{description}</span>;
    },
  },
  {
    accessorKey: "permissions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Permissions" />
    ),
    cell: ({ row }) => {
      const [permissions, setPermissions] = useState(row.original.permissions || []);
      const [sortedBy, setSortedBy] = useState<"name" | "module" | "method">("name");
      const [page, setPage] = useState(1);
      const pageSize = 5; // Hiển thị 5 quyền mỗi lần

      // Hàm sắp xếp quyền
      const sortPermissions = (criteria: "name" | "module" | "method") => {
        const sorted = [...permissions].sort((a, b) =>
          a[criteria].localeCompare(b[criteria])
        );
        setSortedBy(criteria);
        setPermissions(sorted);
      };

      // Hàm tải thêm quyền (phân trang)
      const loadMore = () => setPage(page + 1);

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Badge variant="secondary" className="cursor-pointer">
              {permissions.length} permissions
            </Badge>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Permissions List</DialogTitle>
              <DialogDescription>
                Below is the list of permissions for this role.
              </DialogDescription>
            </DialogHeader>

            {/* Bộ lọc sắp xếp */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm font-medium">Sort by:</p>
              <Select
                value={sortedBy}
                onValueChange={(value) => sortPermissions(value as any)}
              >
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="module">Module</SelectItem>
                  <SelectItem value="method">Method</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Danh sách quyền */}
            <div className="mt-4 space-y-3">
              {permissions.slice(0, page * pageSize).map((perm: any) => (
                <div
                  key={perm.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <HoverCard>
                      <HoverCardTrigger>
                        <p className="text-sm font-medium cursor-pointer">{perm.name}</p>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-64">
                        <p className="text-sm font-medium">{perm.name}</p>
                        <p className="text-xs text-gray-500">{perm.apiPath}</p>
                        <p className="text-xs text-gray-400">{perm.description || "No description"}</p>
                      </HoverCardContent>
                    </HoverCard>
                    <p className="text-xs text-gray-500">{perm.apiPath}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${perm.method === "GET"
                        ? "bg-green-100 text-green-700"
                        : perm.method === "POST"
                          ? "bg-blue-100 text-blue-700"
                          : perm.method === "DELETE"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {perm.method}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Nút tải thêm */}
            {permissions.length > page * pageSize && (
              <Button variant="secondary" onClick={loadMore} className="mt-4">
                Load more
                <Badge variant="outline" className="ml-2">{page * pageSize} / {permissions.length}</Badge>
              </Button>
            )}
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt);
      const daysAgo = differenceInDays(new Date(), createdAt);

      return (
        <span
          
        >
          {format(createdAt, "PPP")}
        </span>

      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <RoleActions role={row.original} />,
  },
];
