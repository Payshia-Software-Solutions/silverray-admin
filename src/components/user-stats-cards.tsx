
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle2, MinusCircle, Star } from "lucide-react";

interface UserStatsCardProps {
  title: string;
  value: string;
  Icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
}

function UserStatsCard({ title, value, Icon, iconBgColor, iconColor }: UserStatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
               <div className={`p-2 rounded-md ${iconBgColor}`}>
                <Icon className={`h-4 w-4 ${iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
    );
}


const UserStatsCards: React.FC = () => {
  return (
    <div>
        <h2 className="text-xl font-semibold mb-4">User Summary</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <UserStatsCard
            title="Total Admins"
            value="24"
            Icon={Users}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
        />
        <UserStatsCard
            title="Active Users"
            value="22"
            Icon={CheckCircle2}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
        />
        <UserStatsCard
            title="Inactive Users"
            value="2"
            Icon={MinusCircle}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
        />
        <UserStatsCard
            title="Super Admins"
            value="3"
            Icon={Star}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
        />
        </div>
    </div>
  );
};

export default UserStatsCards;
