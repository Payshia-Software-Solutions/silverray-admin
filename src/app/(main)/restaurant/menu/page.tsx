

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Settings } from 'lucide-react';
import Image from 'next/image';

const menuItems = [
    {
        name: 'Grilled Atlantic Salmon',
        quality: 'Fresh, premium quality',
        image: 'https://picsum.photos/seed/salmon/40/40',
        imageHint: 'grilled salmon dish',
        category: 'Main Courses',
        price: 'LKR. 2300',
        description: 'Perfectly grilled salmon with seasonal vegetables and lemon butter sauce',
        status: 'Available',
        statusColor: 'bg-green-100 text-green-700'
    },
    {
        name: 'Caesar Salad',
        quality: 'Classic recipe',
        image: 'https://picsum.photos/seed/salad/40/40',
        imageHint: 'caesar salad bowl',
        category: 'Starters',
        price: 'LKR. 800',
        description: 'Fresh romaine lettuce with parmesan cheese and croutons',
        status: 'Available',
        statusColor: 'bg-green-100 text-green-700'
    },
    {
        name: 'Chocolate Lava Cake',
        quality: 'Signature dessert',
        image: 'https://picsum.photos/seed/cake/40/40',
        imageHint: 'chocolate lava cake dessert',
        category: 'Desserts',
        price: 'LKR. 600',
        description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
        status: 'Seasonal',
        statusColor: 'bg-yellow-100 text-yellow-700'
    }
];

export default function MenuItemsPage() {
    return (
        <Card>
            <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex-1">
                        <Label htmlFor="select-restaurant" className="text-sm">Select Restaurant:</Label>
                        <Select defaultValue="main-restaurant">
                            <SelectTrigger id="select-restaurant">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="main-restaurant">Main Restaurant</SelectItem>
                                <SelectItem value="poolside-grill">Poolside Grill & Bar</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-grow"></div>
                    <Button variant="outline"><Settings className="mr-2 h-4 w-4"/> Manage Category</Button>
                </div>

                <div className="flex items-center gap-4">
                    <Input placeholder="Search menu items..." className="flex-grow" />
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="starters">Starters</SelectItem>
                            <SelectItem value="main-courses">Main Courses</SelectItem>
                            <SelectItem value="desserts">Desserts</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {menuItems.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md" data-ai-hint={item.imageHint}/>
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">{item.quality}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-100 text-blue-700">{item.category}</Badge></TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={item.statusColor}>{item.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10">
                                            <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-red-100">
                                            <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t px-6 py-3">
                <div className="text-sm text-muted-foreground">
                    Showing 1 to 3 of 12 results
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">Previous</Button>
                    <Button variant="default" size="sm">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">Next</Button>
                </div>
            </CardFooter>
        </Card>
    );
}

