import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface DashboardCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    description: string;
    trend: string;
    color: string;
}

export function DashboardCard({ title, value, icon: Icon, description, trend, color }: DashboardCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">{title}</h3>
                <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                    <span className={trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                        {trend}
                    </span>
                    <span className="ml-2">{description}</span>
                </div>
            </CardContent>
        </Card>
    );
}