
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getPackageInclusions, deletePackageInclusion, createPackageInclusion, updatePackageInclusion, type PackageInclusionFromApi } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

interface InclusionItem {
  id?: number; // Optional for new items
  inclusion_id: string;
  inclusion_type: string;
  description: string;
}

export default function PackageInclusionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [inclusions, setInclusions] = useState<InclusionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInclusions() {
      try {
        setLoading(true);
        setError(null);
        const data = await getPackageInclusions();
        if (Array.isArray(data)) {
          setInclusions(data.map(item => ({ ...item, id: item.id })));
        } else {
          setInclusions([]);
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while fetching package inclusions.');
        setInclusions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchInclusions();
  }, []);

  const addInclusion = () => {
    // Use a more unique temporary client-side ID
    const tempId = `new-${Date.now()}-${Math.random()}`;
    const newInclusion: InclusionItem = {
      inclusion_id: tempId,
      inclusion_type: '',
      description: ''
    };
    setInclusions([...inclusions, newInclusion]);
  };

  const removeInclusion = async (index: number) => {
    const inclusionToRemove = inclusions[index];
    if (inclusionToRemove.id) { // Only try to delete if it exists on the server
        try {
            await deletePackageInclusion(inclusionToRemove.id);
            toast({ title: "Success", description: "Inclusion deleted successfully." });
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Error", description: error.message });
            return; // Don't remove from UI if delete fails
        }
    }
    setInclusions(inclusions.filter((_, i) => i !== index));
  };
  
  const handleInputChange = (index: number, field: keyof InclusionItem, value: string) => {
    const newInclusions = [...inclusions];
    (newInclusions[index] as any)[field] = value;
    setInclusions(newInclusions);
  };

  const handleSaveChanges = async () => {
    for (const inclusion of inclusions) {
        if (!inclusion.inclusion_type || !inclusion.description) {
            toast({ variant: 'destructive', title: 'Missing Information', description: `Please fill out all fields for "${inclusion.inclusion_type || 'new inclusion'}".` });
            return;
        }

        try {
            const payload = {
                inclusion_id: inclusion.inclusion_id,
                inclusion_type: inclusion.inclusion_type,
                description: inclusion.description,
                company_id: 'comm2',
                created_by: 'admin_user',
                updated_by: 'admin_user',
            };
            if (inclusion.id) {
                // Update existing
                await updatePackageInclusion(inclusion.id, payload);
            } else {
                // Create new
                await createPackageInclusion(payload);
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: `Error saving ${inclusion.inclusion_type}`, description: error.message });
            return; // Stop on first error
        }
    }
    toast({ title: "Success", description: "All changes saved successfully."});
    // Refetch data to get new IDs
    const data = await getPackageInclusions();
    if (Array.isArray(data)) {
        setInclusions(data.map(item => ({ ...item, id: item.id })));
    }
  };

  return (
    <>
      <Toaster />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Package Inclusions</h1>
            <Button onClick={addInclusion}>
                <Plus className="mr-2 h-4 w-4" /> Add Inclusion
            </Button>
        </div>
        
        {loading && <p className="p-4 text-center">Loading inclusions...</p>}
        {error && <p className="p-4 text-center text-red-500">{error}</p>}

        {!loading && !error && (
            <div className="space-y-4">
                {inclusions.map((inclusion, index) => (
                    <Card key={inclusion.id || inclusion.inclusion_id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Inclusion {index + 1}</CardTitle>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100 hover:text-red-600" onClick={() => removeInclusion(index)}>
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor={`type-title-${index}`}>Type/Title</Label>
                                    <Input 
                                        id={`type-title-${index}`} 
                                        placeholder="e.g., Catering"
                                        value={inclusion.inclusion_type}
                                        onChange={(e) => handleInputChange(index, 'inclusion_type', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`details-${index}`}>Details</Label>
                                    <Textarea 
                                        id={`details-${index}`} 
                                        placeholder="Detailed description of this inclusion"
                                        value={inclusion.description}
                                        onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
        
        <div className="flex justify-end pt-4">
            <Button onClick={handleSaveChanges} disabled={loading}>Save All Changes</Button>
        </div>
      </div>
    </>
  );
}
