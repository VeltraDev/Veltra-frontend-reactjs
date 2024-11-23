import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReactionData {
    reactionType: string;
    date: string;
    count: string;
}

export function ReactionChart({ data }: { data: ReactionData[] }) {
    const formattedData = data.map(item => ({
        ...item,
        count: parseInt(item.count, 10)
    }));

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Reactions Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={formattedData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="reactionType" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="hsl(var(--primary))" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}