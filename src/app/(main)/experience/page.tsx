
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Star, CheckCircle, Calendar, Clock, DollarSign, Users, Ticket, Pencil, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader as DialogHeaderComponent,
  DialogTitle as DialogTitleComponent,
  DialogDescription as DialogDescriptionComponent,
  DialogClose,
} from '@/components/ui/dialog';
import { getExperiences, deleteExperience, type ExperienceFromApi, getExperienceImages, CONTENT_PROVIDER_BASE_URL } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const stats = [
  { label: 'Total Experiences', value: '12', icon: Star, color: 'text-blue-500', bgColor: 'bg-blue-100' },
  { label: 'Active Experiences', value: '9', icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-100' },
  { label: 'Total Bookings', value: '247', icon: Calendar, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
];

export default function ExperienceManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<ExperienceFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [experienceToDelete, setExperienceToDelete] = useState<ExperienceFromApi | null>(null);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
  const [deletedExperienceTitle, setDeletedExperienceTitle] = useState('');

  useEffect(() => {
    async function fetchExperiences() {
      try {
        setLoading(true);
        setError(null);
        const data = await getExperiences();
        const experiencesWithImages = await Promise.all(data.map(async (exp) => {
            try {
                const images = await getExperienceImages(exp.id);
                const primaryImage = images.find(img => img.is_primary) || images[0];
                return { ...exp, images_url: primaryImage ? CONTENT_PROVIDER_BASE_URL + primaryImage.image_url : null };
            } catch (e) {
                console.error(`Failed to load image for experience ${exp.id}`, e);
                return { ...exp, images_url: null };
            }
        }));
        setExperiences(experiencesWithImages);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        toast({
          variant: 'destructive',
          title: 'Failed to fetch experiences',
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchExperiences();
  }, [toast]);

  const handleDeleteClick = (experience: ExperienceFromApi) => {
    setExperienceToDelete(experience);
  };

  const handleCancelDelete = () => {
    setExperienceToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (experienceToDelete) {
      try {
        await deleteExperience(experienceToDelete.id);
        setDeletedExperienceTitle(experienceToDelete.name);
        setExperiences(prev => prev.filter(exp => exp.id !== experienceToDelete.id));
        setShowDeleteSuccessDialog(true);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error Deleting Experience",
          description: error.message || "An unexpected error occurred.",
        });
      } finally {
        setExperienceToDelete(null);
      }
    }
  };


  return (
    <div className="space-y-6">
      <Toaster />
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
               <div className={cn('p-2 rounded-md', stat.bgColor)}>
                <stat.icon className={cn('h-4 w-4', stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Add */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search experiences..."
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>
        <Button onClick={() => router.push('/experience/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      </div>

      <AlertDialog open={!!experienceToDelete} onOpenChange={(open) => !open && handleCancelDelete()}>
        {/* Experiences Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading && Array.from({ length: 6 }).map((_, i) => <Card key={i} className="h-80 animate-pulse bg-muted"></Card>)}
          {error && <p className="text-red-500 col-span-full">{error}</p>}
          {!loading && !error && experiences.map((experience) => {
            const isValidImageUrl = experience.images_url && (experience.images_url.startsWith('http') || experience.images_url.startsWith('data:'));
            return (
            <Card key={experience.id} className="flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="relative w-full h-48">
                <Image
                  src={isValidImageUrl ? experience.images_url : 'https://placehold.co/600x400'}
                  alt={experience.name}
                  fill
                  className="object-cover"
                  data-ai-hint="experience photo"
                />
                 {experience.status && (
                  <span className={cn(
                      'absolute top-2 right-2 px-2.5 py-1 text-xs font-semibold rounded-full text-white',
                      experience.status === 'Active' && 'bg-green-500',
                      experience.status === 'Seasonal' && 'bg-orange-500',
                      experience.status === 'Inactive' && 'bg-gray-500'
                  )}>
                    {experience.status}
                  </span>
                 )}
              </div>
              <CardContent className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-2">{experience.name}</h3>
                <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4"/>
                        <span>{experience.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4"/>
                        <span>LKR {Number(experience.Price).toFixed(2)} per {experience.pricing_basis}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4"/>
                        <span>{experience.advance_booking_required ? 'Advance booking required' : 'Walk-in available'}</span>
                    </div>
                </div>
                <div className="mt-auto flex justify-between items-center pt-2 gap-2">
                  <Button className="w-full" variant="default" onClick={() => router.push(`/experience/${experience.id}`)}>View Bookings</Button>
                  <Button asChild variant="outline" size="icon">
                    <Link href={`/experience/${experience.id}/edit`}>
                      <Pencil className="h-4 w-4"/>
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                   <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="group hover:bg-red-100" onClick={() => handleDeleteClick(experience)}>
                     <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-500"/>
                     <span className="sr-only">Delete</span>
                    </Button>
                   </AlertDialogTrigger>
                </div>
              </CardContent>
            </Card>
          )})}
        </div>
        <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Delete this Experience ?</AlertDialogTitle>
              <AlertDialogDescription className="text-center text-red-500 text-lg">
                {experienceToDelete?.name}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
              <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
             <button onClick={handleCancelDelete} className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                <X className="h-5 w-5" />
              </button>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showDeleteSuccessDialog} onOpenChange={setShowDeleteSuccessDialog}>
        <DialogContent className="sm:max-w-md">
            <DialogHeaderComponent className="sr-only">
                <DialogTitleComponent>Success</DialogTitleComponent>
                <DialogDescriptionComponent>The experience was successfully deleted.</DialogDescriptionComponent>
            </DialogHeaderComponent>
            <div className="flex flex-col items-center justify-center text-center p-6 pt-8">
                <div className="p-4 bg-red-100 rounded-full mb-4">
                   <Trash2 className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold">Successfully Deleted {deletedExperienceTitle} !</h2>
            </div>
            <DialogClose asChild>
              <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
              </button>
            </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    