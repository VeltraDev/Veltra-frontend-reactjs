import { permissionColumns } from "@/components/DashBoard/permissions/columns";

import { UsersTable } from "../users/users-table";
import { Permission } from "@/types/dbType";


export function PermissionsTable({ data }: { data: Permission[] }) {
    return (
        <div>
            <UsersTable columns={permissionColumns} data={data} />
        </div>
    );
}
