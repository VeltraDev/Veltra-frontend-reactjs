

import { reactionTypeColumns } from "./columns";
import { UsersTable } from "../users/users-table";
import { ReactionType } from "@/types/dbType";

interface ReactionTypesTableProps {
    data: ReactionType[];
}

export function ReactionTypesTable({ data }: ReactionTypesTableProps) {
    return <UsersTable columns={reactionTypeColumns} data={data} />;
}
