
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UploadCloud, Trash2, X, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getGalleryImages, uploadGalleryImage, deleteGalleryImage, type GalleryImageFromApi, CONTENT_PROVIDER_BASE_URL } from '@/lib/services/api';
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

interface ImageFile extends File {
  preview: string;
}

export default function GalleryPage() {
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImageFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<ImageFile[]>([]);
  const [imageToDelete, setImageToDelete] = useState<GalleryImageFromApi | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const galleryImages = await getGalleryImages();
      setImages(galleryImages);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to load images',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files).map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setFilesToUpload(prev => [...prev, ...selectedFiles]);
    }
  };

  const handleUpload = async () => {
    if (filesToUpload.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select files to upload.',
      });
      return;
    }
    setUploading(true);
    try {
      await Promise.all(
        filesToUpload.map(file => uploadGalleryImage(file, file.name))
      );
      toast({
        title: 'Upload successful',
        description: `${filesToUpload.length} image(s) have been uploaded.`,
      });
      setFilesToUpload([]);
      fetchImages(); // Refresh the gallery
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!imageToDelete) return;
    try {
        await deleteGalleryImage(imageToDelete.id);
        toast({
            title: 'Image Deleted',
            description: `Successfully deleted ${imageToDelete.image_name}.`,
        });
        setImages(images.filter(img => img.id !== imageToDelete.id));
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Deletion failed',
            description: error.message,
        });
    } finally {
        setImageToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster />
      <Card>
        <CardHeader>
          <CardTitle>Upload New Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
                <p className="mb-2 text-lg text-muted-foreground">
                  Drag & drop images here, or click to select files
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <Input id="dropzone-file" type="file" multiple className="hidden" onChange={handleFileChange} />
            </label>
          </div>
          {filesToUpload.length > 0 && (
            <div>
              <h3 className="font-semibold">Files to upload:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-2">
                {filesToUpload.map((file, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={file.preview}
                      alt={file.name}
                      width={150}
                      height={150}
                      className="rounded-md object-cover aspect-square"
                    />
                     <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => setFilesToUpload(filesToUpload.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Button onClick={handleUpload} disabled={uploading || filesToUpload.length === 0}>
            {uploading ? 'Uploading...' : `Upload ${filesToUpload.length} Image(s)`}
          </Button>
        </CardContent>
      </Card>
      
      <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <Card>
          <CardHeader>
            <CardTitle>Image Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading images...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map(image => (
                  <div key={image.id} className="relative group">
                    <Image
                      src={`${CONTENT_PROVIDER_BASE_URL}${image.image_url}`}
                      alt={image.alt_text || image.image_name}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover aspect-square"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" onClick={() => setImageToDelete(image)}>
                              <Trash2 />
                          </Button>
                      </AlertDialogTrigger>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the image
                <span className="font-bold">{imageToDelete?.image_name}</span>.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
