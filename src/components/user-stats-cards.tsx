import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle2, MinusCircle, Star } from "lucide-react";

interface UserStatsCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ title, count, icon }) => {
  return (
    <Card className="w-[200px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
      </CardContent>
    </Card>
  );
};

const UserStatsCards: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <UserStatsCard
        title="Total Admins"
        count={24}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <UserStatsCard
        title="Active Users"
        count={22}
        icon={<CheckCircle2 className="h-4 w-4 text-muted-foreground" />}
      />
      <UserStatsCard
        title="Inactive Users"
        count={2}
        icon={<MinusCircle className="h-4 w-4 text-muted-foreground" />}
      />
      <UserStatsCard
        title="Super Admins"
        count={3}
        icon={<Star className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
};

export default UserStatsCards;