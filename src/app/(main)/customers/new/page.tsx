
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function NewCustomerPage() {
    // In a real app, you'd use react-hook-form and zod for validation
    
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Card className="border-none shadow-none">
                <CardHeader>
                    <CardTitle>Create New Customer</CardTitle>
                    <CardDescription>Fill out the form below to add a new customer to your database.</CardDescription>
                </CardHeader>
            </Card>

            <form className="space-y-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Customer Identity</CardTitle>
                        <CardDescription>Provide basic identification and contact details for the new customer.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="customer-id">Customer ID *</Label>
                                <Input id="customer-id" placeholder="e.g., CUST-005" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customer-type">Customer Type *</Label>
                                <Select>
                                    <SelectTrigger id="customer-type">
                                        <SelectValue placeholder="Select customer type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="individual">Individual</SelectItem>
                                        <SelectItem value="corporate">Corporate</SelectItem>
                                        <SelectItem value="vip">VIP</SelectItem>
                                        <SelectItem value="group">Group</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label htmlFor="full-name">Full Name *</Label>
                            <Input id="full-name" placeholder="Enter customer's full name" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input id="email" type="email" placeholder="customer@example.com" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea id="address" placeholder="Enter customer's mailing address" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Account Status</CardTitle>
                        <CardDescription>Manage the customer's account status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="flex items-center space-x-2">
                            <Switch id="status" defaultChecked />
                            <Label htmlFor="status">Set customer account to Active</Label>
                        </div>
                    </CardContent>
                </Card>
                
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" asChild>
                        <Link href="/customers">Cancel</Link>
                    </Button>
                    <Button type="submit">
                        Create Customer
                    </Button>
                </div>
            </form>
        </div>
    );
}
