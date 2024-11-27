import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReactionData {
    reactionType: string;
    date: string;
    count: string;
}

export function ReactionChart({ data }: { data: ReactionData[] }) {
    // Chuyển đổi dữ liệu thành dạng tổng hợp
    const groupedData = data.reduce((acc, item) => {
        const existing = acc.find(d => d.date === item.date);
        if (existing) {
            existing[item.reactionType] = parseInt(item.count, 10);
        } else {
            acc.push({
                date: item.date,
                [item.reactionType]: parseInt(item.count, 10),
            });
        }
        return acc;
    }, [] as Array<{ date: string;[key: string]: number | string }>);

    // Lấy danh sách tất cả các loại phản ứng để map cột
    const reactionTypes = Array.from(new Set(data.map(item => item.reactionType)));

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Reactions Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={groupedData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            {reactionTypes.map(type => (
                                <Bar key={type} dataKey={type} stackId="a" fill={`hsl(var(--primary))`} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
