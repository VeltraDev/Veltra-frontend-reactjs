import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { reactionTypesApi } from "@/services/api/userService";

const formSchema = z.object({
    type: z.string().min(1, "Reaction type is required").max(255),
    description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function EditReactionTypePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "",
            description: "",
        },
    });

    useEffect(() => {
        async function fetchData() {
            if (id) {
                const reactionTypeData = await reactionTypesApi.getReactionType(id);
                if (reactionTypeData?.data) {
                    form.reset({
                        type: reactionTypeData.data.type,
                        description: reactionTypeData.data.description || "",
                    });
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [id, form]);

    const onSubmit = async (values: FormValues) => {
        if (id) {
            await reactionTypesApi.updateReactionType(id, values);
        } else {
            await reactionTypesApi.createReactionType(values);
        }
        navigate("/dashboard/reaction-types");
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Reaction Type</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter reaction type" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter description (optional)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">{id ? "Update Reaction Type" : "Create Reaction Type"}</Button>
            </form>
        </Form>
    );
}
