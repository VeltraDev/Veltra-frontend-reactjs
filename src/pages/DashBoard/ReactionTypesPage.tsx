import { ReactionTypesTable } from "@/components/DashBoard/reactionTypes/reaction-types-table";
import { reactionTypesApi } from "@/services/api/reactionTypeService";

import { useQuery } from "@tanstack/react-query";


export function ReactionTypesPage() {
    const { data, isLoading } = useQuery({
        queryKey: ["reactionTypes"],
        queryFn: () => reactionTypesApi.getReactionTypes(),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Reaction Types Management</h1>
            <ReactionTypesTable data={data?.results || []} />
        </div>
    );
}
