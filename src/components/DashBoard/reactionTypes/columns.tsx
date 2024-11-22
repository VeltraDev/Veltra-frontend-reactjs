import { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ReactionType } from "@/types/dbType";

export const reactionTypeColumns: ColumnDef<ReactionType>[] = [
    {
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Reaction Type" />
        ),
        cell: ({ row }) => <span>{row.original.type}</span>,
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
        accessorKey: "updatedAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Updated At" />
        ),
        cell: ({ row }) => (
            <span>{format(new Date(row.original.updatedAt), "PPP")}</span>
        ),
    },
];
