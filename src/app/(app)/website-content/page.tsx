
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Info, Phone, Gift, Link, Star, Home, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function WebsiteContentPage() {
  const contentData = [
    {
      page: 'Home Page - Hero Banner',
      section: 'Main landing section',
      type: 'Dynamic Section',
      status: 'Published',
      lastUpdated: 'Dec 8, 2024 2:30 PM',
      icon: Home,
      typeColor: 'bg-blue-100 text-blue-700',
    },
    {
      page: 'Guest Reviews',
      section: 'Customer testimonials',
      type: 'Dynamic List',
      status: 'Published',
      lastUpdated: 'Dec 7, 2024 4:15 PM',
      icon: Star,
      typeColor: 'bg-purple-100 text-purple-700',
    },
    {
      page: 'About Us Page',
      section: 'Hotel information and story',
      type: 'Static Page',
      status: 'Published',
      lastUpdated: 'Dec 5, 2024 10:20 AM',
      icon: Info,
      typeColor: 'bg-gray-100 text-gray-700',
    },
    {
      page: 'Contact Information',
      section: 'Phone, email, address details',
      type: 'Dynamic Section',
      status: 'Published',
      lastUpdated: 'Dec 4, 2024 9:45 AM',
      icon: Phone,
      typeColor: 'bg-blue-100 text-blue-700',
    },
    {
      page: 'Latest Offers & Packages',
      section: 'Special deals and promotions',
      type: 'Dynamic List',
      status: 'Draft',
      lastUpdated: 'Dec 3, 2024 3:20 PM',
      icon: Gift,
      typeColor: 'bg-purple-100 text-purple-700',
    },
    {
      page: 'Footer - Quick Links',
      section: 'Navigation and information links',
      type: 'Dynamic Section',
      status: 'Published',
      lastUpdated: 'Dec 1, 2024 11:30 AM',
      icon: Link,
      typeColor: 'bg-blue-100 text-blue-700',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search content pages..." className="w-full pl-8" />
        </div>
        <Input placeholder="" className="w-[150px] hidden md:block" />
        <Input placeholder="" className="w-[150px] hidden md:block" />
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Content
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Page/Section</TableHead>
                <TableHead>Content Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p>{item.page}</p>
                        <p className="text-xs text-muted-foreground">{item.section}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${item.typeColor} border-transparent`}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border-transparent ${item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-3 w-3" />
                      Edit Content
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
