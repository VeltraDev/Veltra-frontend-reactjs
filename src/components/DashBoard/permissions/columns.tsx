import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Permission } from "@/types/dbType";
import { PermissionActions } from "./permission-actions";

// Định nghĩa màu sắc cho từng HTTP method với màu sắc dịu nhẹ hơn
// Định nghĩa màu sắc cho từng HTTP method với màu sắc dịu nhẹ hơn
const methodColors: Record<string, string> = {
    GET: "bg-green-100 text-green-600",
    POST: "bg-blue-100 text-blue-600",
    PUT: "bg-yellow-100 text-yellow-600",
    DELETE: "bg-red-100 text-red-600",
};

// Các cột dữ liệu cho permissions
export const permissionColumns: ColumnDef<Permission>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Permission Name" />
        ),
        cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
        accessorKey: "apiPath",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="API Path" />
        ),
        cell: ({ row }) => <span>{row.original.apiPath}</span>,
    },
    {
        accessorKey: "method",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="HTTP Method" />
        ),
        cell: ({ row }) => {
            const method = row.original.method;
            const badgeClass = methodColors[method] || "bg-gray-100 text-gray-600 "; // Màu mặc định nếu không khớp
            return (
                <span
                    className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${badgeClass}`}
                >
                    {method}
                </span>
            ); // Thêm badge kiểu dáng
        },
    },
    {
        accessorKey: "module",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Module" />
        ),
        cell: ({ row }) => <span>{row.original.module}</span>,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => (
            <span>{format(new Date(row.original.createdAt), "PPP")}</span>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <PermissionActions per={row.original} />,
    },
];
