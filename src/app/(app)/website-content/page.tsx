'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Folder, Users, Info, Phone, Gift, Link } from 'lucide-react';

export default function WebsiteContentPage() {
  const contentData = [
    {
      page: 'Home Page - Hero Banner',
      section: 'Main landing section',
      type: 'Dynamic Section',
      status: 'Published',
      lastUpdated: 'Dec 8, 2024 2:30 PM',
      icon: Folder,
    },
    {
      page: 'Guest Reviews',
      section: 'Customer testimonials',
      type: 'Dynamic List',
      status: 'Published',
      lastUpdated: 'Dec 7, 2024 4:15 PM',
      icon: Users,
    },
    {
      page: 'About Us Page',
      section: 'Hotel information and story',
      type: 'Static Page',
      status: 'Published',
      lastUpdated: 'Dec 5, 2024 10:20 AM',
      icon: Info,
    },
    {
      page: 'Contact Information',
      section: 'Phone, email, address details',
      type: 'Dynamic Section',
      status: 'Published',
      lastUpdated: 'Dec 4, 2024 9:45 AM',
      icon: Phone,
    },
    {
      page: 'Latest Offers & Packages',
      section: 'Special deals and promotions',
      type: 'Dynamic List',
      status: 'Draft',
      lastUpdated: 'Dec 3, 2024 3:20 PM',
      icon: Gift,
    },
    {
      page: 'Footer - Quick Links',
      section: 'Navigation and information links',
      type: 'Dynamic Section',
      status: 'Published',
      lastUpdated: 'Dec 1, 2024 11:30 AM',
      icon: Link,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Website Content Management
        </h2>
        <p className="text-muted-foreground">
          Manage your website content and pages
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search content pages..." className="w-full pl-8" />
        </div>
        <Input placeholder="mm/dd/yyyy" className="w-[150px]" />
        <Button>Apply Filters</Button>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Content
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Page/Section</TableHead>
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
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p>{item.page}</p>
                        <p className="text-xs text-muted-foreground">{item.section}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs rounded-md bg-purple-100 text-purple-700">
                      {item.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-md ${item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>{item.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
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