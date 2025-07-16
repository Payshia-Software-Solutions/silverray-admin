
import { Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/page-header';

const dailyReport = {
  bookings: 12,
  checkIns: 8,
  checkOuts: 5,
  occupancy: 78,
};

const monthlyReport = {
  revenue: {
    amount: '$45,231.89',
    change: '+20.1% from last month',
  },
  bookings: {
    count: 152,
    change: '+15.2% from last month',
  },
  avgOccupancy: {
    rate: '82%',
    change: '+5% from last month',
  },
};

const recentBookings = [
  { id: 'RES001', guest: 'John Doe', room: 'RM102', checkIn: '2024-08-15', checkOut: '2024-08-20', status: 'Checked-In' },
  { id: 'RES002', guest: 'Jane Smith', room: 'RM302', checkIn: '2024-08-16', checkOut: '2024-08-18', status: 'Checked-In' },
  { id: 'RES003', guest: 'Peter Jones', room: 'RM201', checkIn: '2024-08-17', checkOut: '2024-08-22', status: 'Confirmed' },
  { id: 'RES004', guest: 'Mary Johnson', room: 'RM101', checkIn: '2024-08-15', checkOut: '2024-08-17', status: 'Checked-Out' },
];

const statusVariant = {
  'Confirmed': 'default',
  'Checked-In': 'outline',
  'Checked-Out': 'secondary',
  'Canceled': 'destructive',
} as const;


export default function ReportsPage() {
  return (
    <>
      <PageHeader title="Reports" description="View and export daily and monthly reports.">
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Reports
        </Button>
      </PageHeader>
      
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Today's Report</CardTitle>
            <CardDescription>A summary of hotel activity for today.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className='p-4'>
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                <div className="text-2xl font-bold">{dailyReport.bookings}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='p-4'>
                <CardTitle className="text-sm font-medium">Check-ins</CardTitle>
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                <div className="text-2xl font-bold">{dailyReport.checkIns}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='p-4'>
                <CardTitle className="text-sm font-medium">Check-outs</CardTitle>
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                <div className="text-2xl font-bold">{dailyReport.checkOuts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='p-4'>
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                <div className="text-2xl font-bold">{dailyReport.occupancy}%</div>
                <Progress value={dailyReport.occupancy} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Report Summary</CardTitle>
            <CardDescription>Performance metrics for the current month.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monthlyReport.revenue.amount}</div>
                <p className="text-xs text-muted-foreground">{monthlyReport.revenue.change}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monthlyReport.bookings.count}</div>
                <p className="text-xs text-muted-foreground">{monthlyReport.bookings.change}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Occupancy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monthlyReport.avgOccupancy.rate}</div>
                <p className="text-xs text-muted-foreground">{monthlyReport.avgOccupancy.change}</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((res) => (
                  <TableRow key={res.id}>
                    <TableCell className="font-medium">{res.id}</TableCell>
                    <TableCell>{res.guest}</TableCell>
                    <TableCell>{res.room}</TableCell>
                    <TableCell>{res.checkIn}</TableCell>
                    <TableCell>{res.checkOut}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[res.status as keyof typeof statusVariant]}>
                        {res.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
