
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { UploadCloud, Trash2, Edit, Star, X, Plus, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
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
    DialogClose,
    DialogContent,
    DialogDescription as DialogDescriptionComponent,
    DialogHeader as DialogHeaderComponent,
    DialogTitle as DialogTitleComponent,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const initialImages = [
    {
        id: 1,
        room_id: 101,
        image_name: 'deluxe-room-main.jpg',
        image_url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
        alt_text: 'Spacious deluxe room with king size bed',
        is_primary: 1,
        display_order: 1,
        is_active: 1,
        upload_date: '2025-08-01 11:44:54',
        file_size: 2048576,
    },
    {
        id: 2,
        room_id: 101,
        image_name: 'deluxe-room-bathroom.jpg',
        image_url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop',
        alt_text: 'Modern bathroom with marble countertops',
        is_primary: 0,
        display_order: 2,
        is_active: 1,
        upload_date: '2025-08-01 11:45:20',
        file_size: 1802240,
    },
    {
        id: 3,
        room_id: 102,
        image_name: 'suite-living-area.jpg',
        image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop',
        alt_text: 'Living area of the presidential suite',
        is_primary: 1,
        display_order: 1,
        is_active: 1,
        upload_date: '2025-08-02 09:10:05',
        file_size: 2560000,
    },
    {
        id: 4,
        room_id: 102,
        image_name: 'suite-view.jpg',
        image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',
        alt_text: 'Balcony view from the presidential suite',
        is_primary: 0,
        display_order: 2,
        is_active: 0,
        upload_date: '2025-08-02 09:12:15',
        file_size: 2252800,
    }
];

type RoomImage = typeof initialImages[0];

export default function ManageRoomImagesPage() {
    const { toast } = useToast();
    const [images, setImages] = useState(initialImages);
    const [selectedImage, setSelectedImage] = useState<RoomImage | null>(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<RoomImage | null>(null);

    const handleEditClick = (image: RoomImage) => {
        setSelectedImage(image);
        setShowEditDialog(true);
    };

    const handleDeleteClick = (image: RoomImage) => {
        setImageToDelete(image);
    };

    const handleDeleteConfirm = () => {
        if (imageToDelete) {
            setImages(images.filter(img => img.id !== imageToDelete.id));
            toast({
                title: 'Success!',
                description: `Image "${imageToDelete.image_name}" has been deleted.`,
            });
            setImageToDelete(null);
        }
    };
    
    const handleSaveChanges = () => {
        // Here you would typically call an API to save the changes
        if (selectedImage) {
            setImages(images.map(img => img.id === selectedImage.id ? selectedImage : img));
            toast({
                title: 'Success!',
                description: `Image "${selectedImage.image_name}" has been updated.`,
            });
            setShowEditDialog(false);
            setSelectedImage(null);
        }
    }

  return (
    <>
    <Toaster />
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/rooms">Room Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Room Images</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <Card>
        <CardHeader>
            <CardTitle>Upload New Image</CardTitle>
            <CardDescription>Drag and drop files here or click to browse.</CardDescription>
        </CardHeader>
        <CardContent>
            <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, or GIF (MAX. 800x400px)</p>
                </div>
                <Input id="dropzone-file" type="file" className="hidden" multiple />
            </label>
        </CardContent>
      </Card>
      
      <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <Card>
            <CardHeader>
              <CardTitle>Image Gallery</CardTitle>
              <CardDescription>Manage all room images from one place.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {images.map(image => (
                      <Card key={image.id} className="overflow-hidden group">
                          <div className="relative">
                              <Image
                                  src={image.image_url}
                                  alt={image.alt_text}
                                  width={400}
                                  height={300}
                                  className="object-cover w-full h-40 transition-transform duration-300 group-hover:scale-105"
                              />
                              {image.is_primary ? (
                                  <Badge className="absolute top-2 left-2 bg-primary">Primary</Badge>
                              ) : (
                                  <Badge variant="secondary" className="absolute top-2 left-2">Secondary</Badge>
                              )}
                              <Badge variant={image.is_active ? "default" : "destructive"} className={`absolute top-2 right-2 ${image.is_active ? 'bg-green-500' : 'bg-red-500'}`}>
                                  {image.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                          </div>
                          <CardContent className="p-3 space-y-2">
                             <p className="text-xs text-muted-foreground">Room #{image.room_id}</p>
                             <p className="font-semibold text-sm truncate" title={image.image_name}>{image.image_name}</p>
                             <p className="text-xs text-muted-foreground truncate" title={image.alt_text}>{image.alt_text}</p>
                             <div className="flex justify-between items-center pt-2">
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(image)}>
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">Edit</span>
                                  </Button>
                                   <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDeleteClick(image)}>
                                          <Trash2 className="h-4 w-4" />
                                          <span className="sr-only">Delete</span>
                                      </Button>
                                  </AlertDialogTrigger>
                             </div>
                          </CardContent>
                      </Card>
                  ))}
              </div>
            </CardContent>
        </Card>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the image
                    <span className="font-bold"> {imageToDelete?.image_name}</span>.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>

    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeaderComponent>
                <DialogTitleComponent>Edit Image Details</DialogTitleComponent>
                <DialogDescriptionComponent>
                   Update information for {selectedImage?.image_name}.
                </DialogDescriptionComponent>
            </DialogHeaderComponent>
            {selectedImage && (
                 <div className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="edit-room-id">Room ID</Label>
                            <Input id="edit-room-id" value={selectedImage.room_id} onChange={(e) => setSelectedImage({...selectedImage, room_id: Number(e.target.value)})} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="edit-display-order">Display Order</Label>
                            <Input id="edit-display-order" type="number" value={selectedImage.display_order} onChange={(e) => setSelectedImage({...selectedImage, display_order: Number(e.target.value)})} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="edit-alt-text">Alt Text</Label>
                        <Input id="edit-alt-text" value={selectedImage.alt_text} onChange={(e) => setSelectedImage({...selectedImage, alt_text: e.target.value})} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Switch id="edit-is-primary" checked={selectedImage.is_primary === 1} onCheckedChange={(checked) => setSelectedImage({...selectedImage, is_primary: checked ? 1 : 0})} />
                            <Label htmlFor="edit-is-primary">Set as Primary</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="edit-is-active" checked={selectedImage.is_active === 1} onCheckedChange={(checked) => setSelectedImage({...selectedImage, is_active: checked ? 1 : 0})}/>
                            <Label htmlFor="edit-is-active">Active</Label>
                        </div>
                    </div>
                 </div>
            )}
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
            </div>
        </DialogContent>
    </Dialog>
    </>
  );
}
