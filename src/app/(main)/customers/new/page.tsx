
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';

export default function NewCustomerPage() {
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const handleCreateCustomer = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // In a real app, you'd handle form submission here first
        setShowSuccessDialog(true);
    };
    
    return (
        <>
            <div className="space-y-6 max-w-4xl mx-auto">
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
                        <Button onClick={handleCreateCustomer}>
                            Create Customer
                        </Button>
                    </div>
                </form>
            </div>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Success</DialogTitle>
                        <DialogDescription>A new customer has been successfully created.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center text-center p-8">
                        <div className="p-4 bg-blue-100 rounded-full mb-4">
                            <div className="p-2 bg-blue-200 rounded-full">
                               <CheckCircle2 className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold mb-2">Successfully Created Customer!</h2>
                        <DialogClose asChild>
                            <Button className="mt-6" onClick={() => setShowSuccessDialog(false)}>Done</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
