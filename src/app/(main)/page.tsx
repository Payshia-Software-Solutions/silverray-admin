
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
import { useState, useEffect } from 'react';
import { getRooms, getBookings, getContactMessages, RoomFromApi, BookingFromApi, ContactMessageFromApi } from '@/lib/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { format, isToday } from 'date-fns';

const quickActions = [
  { label: 'New Booking', icon: Plus, href: '/reservations/new', color: 'text-blue-500', bgColor: 'bg-blue-100' },
  { label: 'Manage Rooms', icon: BedDouble, href: '/rooms', color: 'text-green-500', bgColor: 'bg-green-100' },
  { label: 'New Experience', icon: Star, href: '/experience/new', color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
  { label: 'Wedding Package', icon: Heart, href: '/weddingpackages/new', color: 'text-red-500', bgColor: 'bg-red-100' },
  { label: 'View Messages', icon: Mail, href: '/messages', color: 'text-purple-500', bgColor: 'bg-purple-100' },
  { label: 'Dining Reservations', icon: UtensilsCrossed, href: '/restaurant/reservations/new', color: 'text-orange-500', bgColor: 'bg-orange-100' },
];

interface Activity {
    icon: React.ElementType;
    text: string;
    time: string;
    color: string;
    bgColor: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    availableRooms: 0,
    todaysBookings: 0,
    pendingMessages: 0,
    revenueToday: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [todaysCheckIns, setTodaysCheckIns] = useState<BookingFromApi[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [rooms, bookings, messages] = await Promise.all([
          getRooms(),
          getBookings(),
          getContactMessages(),
        ]);

        const availableRooms = rooms.filter(r => r.current_status === 'Available').length;
        
        const today = new Date();
        const todaysBookings = bookings.filter(b => isToday(new Date(b.check_in_date))).length;
        const checkIns = bookings.filter(b => isToday(new Date(b.check_in_date)) && (b.booking_status === 'Confirmed' || b.booking_status === 'Pending'));
        setTodaysCheckIns(checkIns);

        const pendingMessages = messages.filter(m => m.status === 'unread').length;
        
        const revenueToday = bookings
            .filter(b => isToday(new Date(b.check_in_date)))
            .reduce((acc, b) => acc + parseFloat(b.amount_paid), 0);
            
        setStats({
          availableRooms,
          todaysBookings,
          pendingMessages,
          revenueToday,
        });

        // Synthesize recent activity
        const latestBooking = bookings[0];
        const latestMessage = messages[0];
        const activity: Activity[] = [];
        if (latestBooking) {
            activity.push({ icon: Calendar, text: `New booking for Room ${latestBooking.room_number}`, time: format(new Date(latestBooking.created_at), 'PPp'), color: "text-blue-500", bgColor: "bg-blue-100" });
        }
        if (latestMessage) {
            activity.push({ icon: Mail, text: `New message: "${latestMessage.subject}"`, time: format(new Date(latestMessage.created_at), 'PPp'), color: "text-orange-500", bgColor: "bg-orange-100" });
        }
        setRecentActivity(activity);


      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
            <>
                <StatCard 
                    title="Available Rooms" 
                    value={stats.availableRooms.toString()}
                    description="Ready for guests" 
                    Icon={Bed}
                    iconBgColor="bg-green-100"
                    iconColor="text-green-600"
                />
                <StatCard 
                    title="Today's Check-ins" 
                    value={stats.todaysBookings.toString()}
                    description={`${todaysCheckIns.length} arrivals expected`}
                    Icon={Calendar}
                    iconBgColor="bg-blue-100"
                    iconColor="text-blue-600"
                />
                <StatCard 
                    title="Pending Messages" 
                    value={stats.pendingMessages.toString()}
                    description={stats.pendingMessages > 0 ? <><AlertCircle className="inline-block h-3 w-3 mr-1 text-red-500" /> Action required</> : 'All caught up'}
                    Icon={Mail}
                    iconBgColor="bg-orange-100"
                    iconColor="text-orange-600"
                />
                <StatCard 
                    title="Revenue Today" 
                    value={`LKR. ${stats.revenueToday.toLocaleString()}`}
                    description="Based on payments for today's arrivals" 
                    Icon={DollarSign}
                    iconBgColor="bg-yellow-100"
                    iconColor="text-yellow-600"
                />
            </>
        )}
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
             {loading ? (
                Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
             ) : recentActivity.length > 0 ? (
                 recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <div className={cn("p-2 rounded-full", activity.bgColor)}>
                           <activity.icon className={cn("h-5 w-5", activity.color)} />
                        </div>
                        <div>
                            <p className="font-medium text-sm">{activity.text}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                    </div>
                 ))
             ) : (
                <p className="text-muted-foreground text-center py-4">No recent activity to display.</p>
             )}
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
            {loading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
            ) : todaysCheckIns.length > 0 ? (
                todaysCheckIns.map((checkin, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={`https://placehold.co/40x40.png`} alt={checkin.customer?.full_name} data-ai-hint="person face" />
                            <AvatarFallback>{checkin.customer?.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                            <p className="font-semibold text-sm">{checkin.customer?.full_name}</p>
                            <p className="text-xs text-muted-foreground">Room {checkin.room_number} • {format(new Date(checkin.check_in_date), 'p')}</p>
                        </div>
                        <div className={cn("w-2 h-2 rounded-full", checkin.booking_status === 'Confirmed' ? 'bg-green-500' : 'bg-yellow-500')}></div>
                    </div>
                ))
            ) : (
                <p className="text-muted-foreground text-center py-4">No check-ins scheduled for today.</p>
            )}
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
            <p className="text-muted-foreground">Revenue chart will be displayed here.</p>
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
