
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';

export default function NewCustomerPage() {
    // In a real app, you'd use react-hook-form and zod for validation
    
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Customer</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="full-name">Full Name</Label>
                            <Input id="full-name" placeholder="Enter customer's full name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="customer@example.com" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea id="address" placeholder="Enter customer's address" />
                        </div>
                         <div className="flex items-center space-x-2">
                            <Switch id="status" defaultChecked />
                            <Label htmlFor="status">Active</Label>
                        </div>
                        
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" asChild>
                                <Link href="/customers">Cancel</Link>
                            </Button>
                            <Button type="submit">
                                Create Customer
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
