
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getContactMessageById, updateContactMessage, type ContactMessageFromApi } from '@/lib/services/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Mail, Tag, User, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function ViewMessagePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  const [message, setMessage] = useState<ContactMessageFromApi | null>(null);
  const [status, setStatus] = useState<ContactMessageFromApi['status']>('unread');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      async function fetchMessage() {
        try {
          const data = await getContactMessageById(id);
          setMessage(data);
          setStatus(data.status);
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Error fetching message',
            description: error.message || 'An unexpected error occurred.',
          });
        }
      }
      fetchMessage();
    }
  }, [id, toast]);

  const handleStatusUpdate = async () => {
    if (!message) return;
    setIsSubmitting(true);
    try {
      await updateContactMessage(id, { status });
      toast({
        title: 'Success!',
        description: 'Message status updated successfully.',
      });
      // Optionally refetch or update local state to reflect change
      setMessage({ ...message, status });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error updating status',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!message) {
    return <div>Loading message...</div>;
  }

  return (
    <>
      <Toaster />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/messages"><ArrowLeft /></Link>
            </Button>
            <h1 className="text-2xl font-bold">View Message</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{message.subject}</CardTitle>
                <CardDescription>
                  Received on {format(new Date(message.created_at), 'PPPp')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{message.message}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reply to Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea placeholder={`Reply to ${message.name}...`} rows={5} />
                <Button>Send Reply</Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={`https://placehold.co/40x40.png`} alt={message.name} />
                    <AvatarFallback>{message.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{message.name}</p>
                    <p className="text-sm text-muted-foreground">{message.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Received: {format(new Date(message.created_at), 'PPP')}</span>
                    </div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Last updated: {format(new Date(message.updated_at), 'PPPp')}</span>
                    </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex items-center gap-2">
                    <Select value={status} onValueChange={(value) => setStatus(value as ContactMessageFromApi['status'])}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleStatusUpdate} disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Update'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
