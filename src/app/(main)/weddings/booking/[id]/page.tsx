
'use client';

import {
  ArrowLeft,
  Calendar,
  Gift,
  Home,
  Users,
  Heart,
  Check,
  Plus,
  Wallet,
  Building,
  Printer,
  Edit,
  Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-4 rounded-lg bg-card p-4">
    <div className="rounded-full bg-primary/10 p-3">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </div>
);

export default function WeddingBookingDetailsPage() {
    const params = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-start">
            <div>
                 <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                        <BreadcrumbLink href="/weddings">Wedding Management</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        <BreadcrumbPage>Booking #{params.id}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex items-center gap-4 mt-4">
                    <h1 className="text-3xl font-bold">Booking #{params.id} - Mr & Mrs. Silva</h1>
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-base">Confirmed</Badge>
                </div>
                <p className="text-muted-foreground">Wedding Date: December 15, 2025</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline"><Edit className="mr-2 h-4 w-4"/> Edit</Button>
                <Button variant="outline"><Printer className="mr-2 h-4 w-4"/> Print</Button>
                 <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4"/> Delete</Button>
            </div>
        </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Calendar} label="Date" value="Dec 15, 2025" />
        <StatCard icon={Gift} label="Package" value="Premium Gold" />
        <StatCard icon={Building} label="Hall" value="Grand Ballroom" />
        <StatCard icon={Users} label="Guests" value="150 People" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="text-primary" />
                Couple Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p><strong>Names:</strong> Saman Silva & Nimali Ekanayake</p>
              <p><strong>Email:</strong> saman@email.com</p>
              <p><strong>Phone:</strong> +94 762213088</p>
              <p><strong>Address:</strong> 123, Main Street, Rathnapura</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="text-primary" />
                  Wedding Package - Premium Gold
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  'Catering for 150 guests',
                  'Basic floral decoration',
                  'Standard sound system',
                  'Wedding cake',
                  'Basic photography',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="text-primary" />
                  Hall Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p><strong>Hall:</strong> Grand Ballroom</p>
                <p><strong>Capacity:</strong> 200 guests</p>
                <p><strong>Setup:</strong> Round tables with stage</p>
                <p><strong>Time:</strong> 6:00 PM - 12:00 AM</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <Card className="bg-yellow-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="text-primary" />
                Additional Services & Add-ons
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Premium Photography Upgrade', desc: 'Professional photographer + videographer', price: '60,000' },
                { name: 'Live Band Performance', desc: '4-piece jazz band - 3 hours', price: '60,000' },
                { name: 'Late Night Snack Station', desc: 'Mini burgers & fries for 150 guests', price: '60,000' },
                { name: 'Extra Hour Extension', desc: 'Hall booking until 1:00 AM', price: '60,000' },
              ].map((item, i) => (
                <div key={i} className="rounded-lg border bg-card p-3">
                  <div className="flex justify-between">
                    <p className="font-semibold">{item.name}</p>
                    <p className="font-bold">LKR. {item.price}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="text-primary" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Package Price</span>
                    <span>LKR. 283,000</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Add-ons Cost</span>
                    <span>LKR. 224,000</span>
                </div>
                <div className="flex justify-between font-semibold">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>LKR. 507,000</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Charges (6.8%)</span>
                    <span>LKR. 24,000</span>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
