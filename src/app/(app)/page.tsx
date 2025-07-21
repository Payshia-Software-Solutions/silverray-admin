
'use client';

import { 
  Bed, 
  Calendar, 
  Mail, 
  DollarSign, 
  Plus, 
  BedDouble, 
  Star, 
  Heart, 
  UtensilsCrossed, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';


const quickActions = [
  { label: 'New Booking', icon: Plus, href: '/reservations', color: 'text-blue-500', bgColor: 'bg-blue-100' },
  { label: 'Manage Rooms', icon: BedDouble, href: '/rooms', color: 'text-green-500', bgColor: 'bg-green-100' },
  { label: 'New Experience', icon: Star, href: '/experience', color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
  { label: 'Wedding Package', icon: Heart, href: '/weddings', color: 'text-red-500', bgColor: 'bg-red-100' },
  { label: 'View Messages', icon: Mail, href: '/messages', color: 'text-purple-500', bgColor: 'bg-purple-100' },
  { label: 'Dining Reservations', icon: UtensilsCrossed, href: '/restaurant', color: 'text-orange-500', bgColor: 'bg-orange-100' },
];

const recentActivity = [
    { icon: Calendar, text: "New booking created for Room 205", time: "2 minutes ago", color: "text-blue-500", bgColor: "bg-blue-100" },
    { icon: CheckCircle, text: "Guest checked in to Presidential Suite", time: "15 minutes ago", color: "text-green-500", bgColor: "bg-green-100" },
    { icon: Mail, text: "New contact form message received", time: "32 minutes ago", color: "text-orange-500", bgColor: "bg-orange-100" },
    { icon: Star, text: "New spa experience booking for tomorrow", time: "1 hour ago", color: "text-purple-500", bgColor: "bg-purple-100" },
    { icon: Bed, text: "Room 112 marked as under maintenance", time: "2 hours ago", color: "text-red-500", bgColor: "bg-red-100" },
];

const checkIns = [
    { name: "Sarah Johnson", room: "Room 301 • 2:00 PM", avatar: "https://placehold.co/40x40.png?text=SJ", status: "bg-green-500" },
    { name: "Michael Chen", room: "Room 156 • 3:30 PM", avatar: "https://placehold.co/40x40.png?text=MC", status: "bg-yellow-500" },
    { name: "Emily Davis", room: "Suite 401 • 4:15 PM", avatar: "https://placehold.co/40x40.png?text=ED", status: "bg-yellow-500" },
    { name: "Robert Wilson", room: "Room 203 • 5:00 PM", avatar: "https://placehold.co/40x40.png?text=RW", status: "bg-gray-300" },
];


export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Top Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title="Available Rooms" 
            value="24" 
            description="↑+2 from yesterday" 
            Icon={Bed}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
        />
        <StatCard 
            title="Today's Bookings" 
            value="12" 
            description="8 check-ins, 4 check-outs" 
            Icon={Calendar}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
        />
        <StatCard 
            title="Pending Messages" 
            value="7" 
            description={<><AlertCircle className="inline-block h-3 w-3 mr-1 text-red-500" /> 3 urgent responses</>}
            Icon={Mail}
            iconBgColor="bg-orange-100"
            iconColor="text-orange-600"
        />
        <StatCard 
            title="Revenue Today" 
            value="LKR. 42,000" 
            description="↑+15% vs yesterday" 
            Icon={DollarSign}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => (
            <Link href={action.href} key={action.label}>
              <Card className="hover:bg-primary/5 hover:shadow-lg transition-all text-center p-4 h-full flex flex-col items-center justify-center">
                <div className={cn("p-3 rounded-lg mb-2", action.bgColor)}>
                  <action.icon className={cn("h-6 w-6", action.color)} />
                </div>
                <p className="font-medium text-sm">{action.label}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity & Check-ins */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                    <div className={cn("p-2 rounded-full", activity.bgColor)}>
                       <activity.icon className={cn("h-5 w-5", activity.color)} />
                    </div>
                    <div>
                        <p className="font-medium text-sm">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                </div>
             ))}
             <div className="text-center pt-4">
                <Button variant="link" className="text-primary">View All Activity</Button>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Check-ins</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {checkIns.map((checkin, index) => (
                <div key={index} className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={checkin.avatar} alt={checkin.name} data-ai-hint="person face" />
                        <AvatarFallback>{checkin.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <p className="font-semibold text-sm">{checkin.name}</p>
                        <p className="text-xs text-muted-foreground">{checkin.room}</p>
                    </div>
                    <div className={cn("w-2 h-2 rounded-full", checkin.status)}></div>
                </div>
            ))}
             <div className="text-center pt-4">
                <Button variant="link" className="text-primary">View All Check-ins</Button>
             </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Revenue Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Revenue Overview</CardTitle>
          {/* Placeholder for potential controls like date range picker */}
          <div className="p-2 border rounded-md" />
        </CardHeader>
        <CardContent className="h-[250px] flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-8 h-8 rounded-md bg-gray-200" />
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Room
            </Button>
            <div className="w-2 h-2 bg-red-500 rounded-full" />
        </CardContent>
      </Card>

    </div>
  );
}

interface StatCardProps {
    title: string;
    value: string;
    description: React.ReactNode;
    Icon: React.ElementType;
    iconBgColor: string;
    iconColor: string;
}

function StatCard({ title, value, description, Icon, iconBgColor, iconColor }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{title}</p>
                    <div className={cn("p-2 rounded-lg", iconBgColor)}>
                        <Icon className={cn("h-5 w-5", iconColor)} />
                    </div>
                </div>
                <h3 className="text-3xl font-bold">{value}</h3>
                <p className="text-xs text-foreground">{description}</p>
            </CardHeader>
        </Card>
    );
}
