import { useEffect, useState } from 'react';
import { MessageCircle, ThumbsUp, Users, FileText } from 'lucide-react';

import { http } from '@/api/http';
import { ErrorBoundary } from './Chart/ErrorBoundary';
import { ReactionChart } from './Chart/Chart1';
import { PostChart } from './Chart/Chart2';
import { CommentChart } from './Chart/Chart4';
import { MessageChart } from './Chart/Chart5';
import { DashboardCard } from './Chart/DBCard';

interface DashboardData {
  total: {
    posts: number;
    comments: number;
    users: number;
    reactions: number;
  };
  charts: {
    reactionsOverTime: Array<{
      reactionType: string;
      date: string;
      count: string;
    }>;
    reactionRatePerPost: number;
    postsOverTime: Array<{
      date: string;
      count: string;
    }>;
    commentsOverTime: Array<{
      date: string;
      count: string;
    }>;
    messagesOverTime: Array<{
      hour: string;
      count: string;
    }>;
  };
}

function App() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await http.get('/dashboards');
        setDashboardData(response.data); // Dữ liệu từ response Axios
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
console.log(dashboardData)
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!dashboardData) {
    return <div className="flex items-center justify-center min-h-screen">No data available</div>;
  }

  const stats = [
    {
      title: "Total Posts",
      value: dashboardData.total.posts,
      icon: FileText,
      description: "Total number of posts",
      trend: "+12.3%",
      color: "text-blue-500",
    },
    {
      title: "Total Comments",
      value: dashboardData.total.comments,
      icon: MessageCircle,
      description: "Total number of comments",
      trend: "+8.2%",
      color: "text-green-500",
    },
    {
      title: "Total Users",
      value: dashboardData.total.users,
      icon: Users,
      description: "Active users",
      trend: "+2.1%",
      color: "text-purple-500",
    },
    {
      title: "Total Reactions",
      value: dashboardData.total.reactions,
      icon: ThumbsUp,
      description: `${dashboardData.charts.reactionRatePerPost.toFixed(1)} reactions per post`,
      trend: "+15.3%",
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Real-time analytics and metrics</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <DashboardCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <ErrorBoundary>
            <ReactionChart data={dashboardData.charts.reactionsOverTime} />
          </ErrorBoundary>
          <ErrorBoundary>
            <PostChart data={dashboardData.charts.postsOverTime} />
          </ErrorBoundary>
          <ErrorBoundary>
            <CommentChart data={dashboardData.charts.commentsOverTime} />
          </ErrorBoundary>
          <ErrorBoundary>
            <MessageChart data={dashboardData.charts.messagesOverTime} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default App;