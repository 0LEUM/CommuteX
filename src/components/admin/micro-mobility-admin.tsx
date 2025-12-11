
'use client';

import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Edit, Loader2, Bike, Zap, Battery, Power } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface MicroMobilityVehicle {
  id: string;
  name: string;
  type: 'bike' | 'e-scooter';
  price: string;
  batteryLevel: number;
  available: boolean;
}

const iconMap = {
  bike: Bike,
  'e-scooter': Zap,
};

export default function MicroMobilityAdmin() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<MicroMobilityVehicle | null>(null);

  const vehiclesQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'micro_mobility_vehicles')) : null),
    [firestore]
  );
  const { data: vehicles, isLoading } = useCollection<MicroMobilityVehicle>(vehiclesQuery);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore) return;
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const vehicleData = {
      name: formData.get('name') as string,
      type: formData.get('type') as 'bike' | 'e-scooter',
      price: formData.get('price') as string,
      batteryLevel: formData.get('type') === 'e-scooter' ? parseInt(formData.get('batteryLevel') as string, 10) : 100,
      available: true,
    };
    
    if (editVehicle) {
      // Update existing vehicle
      const docRef = doc(firestore, 'micro_mobility_vehicles', editVehicle.id);
      updateDocumentNonBlocking(docRef, {
        price: vehicleData.price,
        batteryLevel: vehicleData.batteryLevel
      })
        .then(() => {
          toast({ title: 'Success', description: 'Vehicle updated.' });
          setDialogOpen(false);
          setEditVehicle(null);
        })
        .catch(() => toast({ variant: 'destructive', title: 'Error', description: 'Failed to update vehicle.' }))
        .finally(() => setIsSubmitting(false));
    } else {
      // Add new vehicle
      addDocumentNonBlocking(collection(firestore, 'micro_mobility_vehicles'), vehicleData)
        .then(() => {
          toast({ title: 'Success', description: 'Vehicle added.' });
          setDialogOpen(false);
        })
        .catch(() => toast({ variant: 'destructive', title: 'Error', description: 'Failed to add vehicle.' }))
        .finally(() => setIsSubmitting(false));
    }
  };

  const handleDelete = (vehicleId: string) => {
    if (!firestore) return;
    if (confirm('Are you sure you want to delete this vehicle?')) {
      const docRef = doc(firestore, 'micro_mobility_vehicles', vehicleId);
      deleteDocumentNonBlocking(docRef)
        .then(() => toast({ title: 'Success', description: 'Vehicle deleted.' }))
        .catch(() => toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete vehicle.' }));
    }
  };

  const handleAvailabilityToggle = (vehicle: MicroMobilityVehicle) => {
      if (!firestore) return;
      const newAvailability = !vehicle.available;
      const docRef = doc(firestore, 'micro_mobility_vehicles', vehicle.id);
      updateDocumentNonBlocking(docRef, { available: newAvailability })
        .then(() => toast({ title: 'Availability Updated', description: `${vehicle.name} is now ${newAvailability ? 'available' : 'unavailable'}.`}))
        .catch(() => toast({ variant: 'destructive', title: 'Error', description: 'Failed to update availability.' }));
  }

  const openEditDialog = (vehicle: MicroMobilityVehicle) => {
    setEditVehicle(vehicle);
    setDialogOpen(true);
  };
  
  const openAddDialog = () => {
    setEditVehicle(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Micro-Mobility</CardTitle>
            <CardDescription>Add, edit, or remove bikes and e-scooters.</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <PlusCircle className="mr-2" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className='space-y-2'>
                  <Label htmlFor="name">Vehicle Name</Label>
                  <Input id="name" name="name" placeholder="e.g., CityBike" defaultValue={editVehicle?.name || ''} required disabled={!!editVehicle} />
                </div>
                 <div className='space-y-2'>
                    <Label htmlFor="type">Vehicle Type</Label>
                    <Select name="type" defaultValue={editVehicle?.type || undefined} required disabled={!!editVehicle}>
                        <SelectTrigger id="type">
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bike">Bike</SelectItem>
                            <SelectItem value="e-scooter">E-Scooter</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" type="text" placeholder="e.g., ₹24/min or ₹80 to unlock" defaultValue={editVehicle?.price || ''} required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor="batteryLevel">Battery Level (%)</Label>
                  <Input id="batteryLevel" name="batteryLevel" type="number" min="0" max="100" placeholder="e.g., 85" defaultValue={editVehicle?.batteryLevel || ''} required />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : editVehicle ? 'Update Vehicle' : 'Add Vehicle'}
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
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-6" />
                        <div className="space-y-1">
                            <Skeleton className="h-5 w-28" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-10" />
                    </div>
                </div>
              ))
            ) : (
              vehicles?.map((vehicle) => {
                  const Icon = iconMap[vehicle.type] || Bike;
                  return (
                    <div key={vehicle.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <Icon className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <p className="font-semibold">{vehicle.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.price}
                            {vehicle.type === 'e-scooter' && ` • ${vehicle.batteryLevel}%`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                            <Switch id={`available-${vehicle.id}`} checked={vehicle.available} onCheckedChange={() => handleAvailabilityToggle(vehicle)} />
                            <Label htmlFor={`available-${vehicle.id}`}>{vehicle.available ? 'Available' : 'In Use'}</Label>
                        </div>
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(vehicle)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(vehicle.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  );
                }
              )
            )}
             {!isLoading && vehicles?.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    No vehicles found. Click "Add Vehicle" to get started.
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
