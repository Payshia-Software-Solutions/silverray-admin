

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, Eye, Edit, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCustomers, deleteCustomer, type CustomerFromApi } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader as DialogHeaderComponent, DialogTitle as DialogTitleComponent, DialogClose } from '@/components/ui/dialog';
import { format } from 'date-fns';

const statusVariant = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  suspended: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
} as const;

export default function CustomerManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<CustomerFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerFromApi | null>(null);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
  const [deletedCustomerName, setDeletedCustomerName] = useState('');

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCustomers();
        setCustomers(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while fetching customers.');
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const handleDeleteClick = (customer: CustomerFromApi) => {
    setCustomerToDelete(customer);
  };

  const handleDeleteConfirm = async () => {
    if (customerToDelete) {
      try {
        await deleteCustomer(customerToDelete.id);
        setDeletedCustomerName(customerToDelete.full_name);
        setCustomers(prev => prev.filter(c => c.id !== customerToDelete.id));
        setShowDeleteSuccessDialog(true);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error Deleting Customer",
          description: error.message || "An unexpected error occurred.",
        });
      } finally {
        setCustomerToDelete(null);
      }
    }
  };


  return (
    <>
      <Toaster />
      <div className="space-y-6">
        <AlertDialog open={!!customerToDelete} onOpenChange={(open) => !open && setCustomerToDelete(null)}>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Customer Management</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search customers..." className="pl-8" />
                  </div>
                  <Button asChild>
                    <Link href="/customers/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Customer
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading && <p className="p-4 text-center">Loading customers...</p>}
              {error && <p className="p-4 text-center text-red-500">{error}</p>}
              {!loading && !error && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-semibold text-primary">{customer.customer_id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://placehold.co/40x40.png`} alt={customer.full_name} data-ai-hint="person face" />
                              <AvatarFallback>{customer.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            {customer.full_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{customer.email}</div>
                          <div className="text-xs text-muted-foreground">{customer.phone_number}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusVariant[customer.account_status]}>
                            {customer.account_status.charAt(0).toUpperCase() + customer.account_status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(customer.created_at), 'PPP')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10" asChild>
                              <Link href={`/customers/${customer.id}`}>
                                <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                              </Link>
                            </Button>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-red-100" onClick={() => handleDeleteClick(customer)}>
                                <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t px-6 py-3">
              <div className="text-sm text-muted-foreground">
                Showing 1 to {customers.length} of {customers.length} customers
              </div>
            </CardFooter>
          </Card>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-2xl font-bold">Delete Customer?</AlertDialogTitle>
              <AlertDialogDescription className="text-center text-lg">
                Are you sure you want to delete the customer: <strong className="text-red-500">{customerToDelete?.full_name}</strong>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
              <AlertDialogCancel onClick={() => setCustomerToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Dialog open={showDeleteSuccessDialog} onOpenChange={setShowDeleteSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeaderComponent className="sr-only">
            <DialogTitleComponent>Successfully Deleted</DialogTitleComponent>
          </DialogHeaderComponent>
          <div className="flex flex-col items-center justify-center text-center p-6 pt-8">
            <div className="p-4 bg-red-100 rounded-full mb-4">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold">Successfully Deleted {deletedCustomerName}!</h2>
          </div>
          <DialogClose asChild>
            <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted" onClick={() => setShowDeleteSuccessDialog(false)}>
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
