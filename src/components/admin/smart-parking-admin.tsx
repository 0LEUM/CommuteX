'use client';

import { useEffect, useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useAuth, useUser } from '@/firebase';
import { collection, query, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Edit, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '../ui/skeleton';

interface ParkingLot {
  id: string;
  name: string;
  pricePerHour: number;
  totalSpaces: number;
  availableSpaces: number;
}

export default function SmartParkingAdmin() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editLot, setEditLot] = useState<ParkingLot | null>(null);

  const parkingLotsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'parking_lots')) : null),
    [firestore]
  );
  const { data: parkingLots, isLoading } = useCollection<ParkingLot>(parkingLotsQuery);

  const handleAddSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore || !auth) return;
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const newLot = {
      name: formData.get('name') as string,
      pricePerHour: parseFloat(formData.get('pricePerHour') as string),
      totalSpaces: parseInt(formData.get('totalSpaces') as string, 10),
      availableSpaces: parseInt(formData.get('totalSpaces') as string, 10), // Initially all spaces are available
    };

    addDocumentNonBlocking(collection(firestore, 'parking_lots'), newLot)
      .then(() => {
        toast({ title: 'Success', description: 'Parking lot added.' });
        setDialogOpen(false);
      })
      .catch(() => {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to add parking lot.' });
      })
      .finally(() => setIsSubmitting(false));
  };
  
  const handleUpdateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore || !editLot || !auth) return;
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const updatedData = {
      pricePerHour: parseFloat(formData.get('pricePerHour') as string),
      totalSpaces: parseInt(formData.get('totalSpaces') as string, 10),
      availableSpaces: parseInt(formData.get('availableSpaces') as string, 10),
    };

    const docRef = doc(firestore, 'parking_lots', editLot.id);
    updateDocumentNonBlocking(docRef, updatedData)
      .then(() => {
        toast({ title: 'Success', description: 'Parking lot updated.' });
        setDialogOpen(false);
        setEditLot(null);
      })
      .catch(() => {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update parking lot.' });
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleDelete = (lotId: string) => {
    if (!firestore || !auth) return;
    if (confirm('Are you sure you want to delete this parking lot?')) {
      const docRef = doc(firestore, 'parking_lots', lotId);
      deleteDocumentNonBlocking(docRef)
        .then(() => {
          toast({ title: 'Success', description: 'Parking lot deleted.' });
        })
        .catch(() => {
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete parking lot.' });
        });
    }
  };

  const openEditDialog = (lot: ParkingLot) => {
    setEditLot(lot);
    setDialogOpen(true);
  };
  
  const openAddDialog = () => {
    setEditLot(null);
    setDialogOpen(true);
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Parking Lots</CardTitle>
            <CardDescription>Add, edit, or remove parking lots from the system.</CardDescription>
          </div>
           <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={openAddDialog}>
                    <PlusCircle className="mr-2" />
                    Add Lot
                </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editLot ? 'Edit Parking Lot' : 'Add New Parking Lot'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={editLot ? handleUpdateSubmit : handleAddSubmit} className="space-y-4">
                {editLot ? (
                    <div className='space-y-2'>
                        <label className="text-sm font-medium">Lot Name</label>
                        <Input defaultValue={editLot.name} name="name" disabled />
                    </div>
                ) : (
                     <div className='space-y-2'>
                        <label htmlFor="name" className="text-sm font-medium">Lot Name</label>
                        <Input id="name" name="name" placeholder="e.g., North Gateway Garage" required />
                    </div>
                )}
                <div className='space-y-2'>
                    <label htmlFor="pricePerHour" className="text-sm font-medium">Price per Hour (₹)</label>
                    <Input id="pricePerHour" name="pricePerHour" type="number" step="0.01" placeholder="e.g., 50.50" defaultValue={editLot?.pricePerHour || ''} required />
                </div>
                 <div className='space-y-2'>
                    <label htmlFor="totalSpaces" className="text-sm font-medium">Total Spaces</label>
                    <Input id="totalSpaces" name="totalSpaces" type="number" placeholder="e.g., 150" defaultValue={editLot?.totalSpaces || ''} required />
                </div>
                 {editLot && (
                    <div className='space-y-2'>
                        <label htmlFor="availableSpaces" className="text-sm font-medium">Available Spaces</label>
                        <Input id="availableSpaces" name="availableSpaces" type="number" placeholder="e.g., 58" defaultValue={editLot?.availableSpaces || ''} required />
                    </div>
                )}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : editLot ? 'Update Lot' : 'Add Lot'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
                [...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-60" />
                        </div>
                        <div className="flex gap-2">
                             <Skeleton className="h-10 w-10" />
                             <Skeleton className="h-10 w-10" />
                        </div>
                    </div>
                ))
            ) : (
              parkingLots?.map((lot) => (
                <div key={lot.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <p className="font-semibold">{lot.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{lot.pricePerHour}/hr &bull; {lot.availableSpaces} / {lot.totalSpaces} spaces free
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => openEditDialog(lot)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(lot.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
            {!isLoading && parkingLots?.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    No parking lots found. Click "Add Lot" to get started.
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
