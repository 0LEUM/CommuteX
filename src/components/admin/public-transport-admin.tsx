
'use client';

import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Edit, Loader2, Bus, TramFront, Ship, Clock, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '../ui/badge';

interface PublicTransportRoute {
  id: string;
  routeName: string;
  type: 'bus' | 'metro' | 'ferry';
  price: number;
  status: 'On Time' | 'Delayed';
}

const iconMap = {
  bus: Bus,
  metro: TramFront,
  ferry: Ship,
};

export default function PublicTransportAdmin() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRoute, setEditRoute] = useState<PublicTransportRoute | null>(null);

  const routesQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'public_transport_routes')) : null),
    [firestore]
  );
  const { data: routes, isLoading } = useCollection<PublicTransportRoute>(routesQuery);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore) return;
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const routeData = {
      routeName: formData.get('routeName') as string,
      type: formData.get('type') as 'bus' | 'metro' | 'ferry',
      price: parseFloat(formData.get('price') as string),
      status: 'On Time', // Default status
    };
    
    if (editRoute) {
      // Update existing route
      const docRef = doc(firestore, 'public_transport_routes', editRoute.id);
      updateDocumentNonBlocking(docRef, {
          price: routeData.price
      })
        .then(() => {
          toast({ title: 'Success', description: 'Route updated.' });
          setDialogOpen(false);
          setEditRoute(null);
        })
        .catch(() => toast({ variant: 'destructive', title: 'Error', description: 'Failed to update route.' }))
        .finally(() => setIsSubmitting(false));
    } else {
      // Add new route
      addDocumentNonBlocking(collection(firestore, 'public_transport_routes'), routeData)
        .then(() => {
          toast({ title: 'Success', description: 'Route added.' });
          setDialogOpen(false);
        })
        .catch(() => toast({ variant: 'destructive', title: 'Error', description: 'Failed to add route.' }))
        .finally(() => setIsSubmitting(false));
    }
  };

  const handleDelete = (routeId: string) => {
    if (!firestore) return;
    if (confirm('Are you sure you want to delete this route?')) {
      const docRef = doc(firestore, 'public_transport_routes', routeId);
      deleteDocumentNonBlocking(docRef)
        .then(() => toast({ title: 'Success', description: 'Route deleted.' }))
        .catch(() => toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete route.' }));
    }
  };

  const handleStatusToggle = (route: PublicTransportRoute) => {
      if (!firestore) return;
      const newStatus = route.status === 'On Time' ? 'Delayed' : 'On Time';
      const docRef = doc(firestore, 'public_transport_routes', route.id);
      updateDocumentNonBlocking(docRef, { status: newStatus })
        .then(() => toast({ title: 'Status Updated', description: `${route.routeName} is now ${newStatus}.`}))
        .catch(() => toast({ variant: 'destructive', title: 'Error', description: 'Failed to update status.' }));
  }

  const openEditDialog = (route: PublicTransportRoute) => {
    setEditRoute(route);
    setDialogOpen(true);
  };
  
  const openAddDialog = () => {
    setEditRoute(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Public Transport</CardTitle>
            <CardDescription>Add, edit, or remove transport routes.</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <PlusCircle className="mr-2" />
                Add Route
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editRoute ? 'Edit Route' : 'Add New Route'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className='space-y-2'>
                  <label htmlFor="routeName" className="text-sm font-medium">Route Name</label>
                  <Input id="routeName" name="routeName" placeholder="e.g., Express 101" defaultValue={editRoute?.routeName || ''} required disabled={!!editRoute} />
                </div>
                 <div className='space-y-2'>
                    <label htmlFor="type" className="text-sm font-medium">Transport Type</label>
                    <Select name="type" defaultValue={editRoute?.type || undefined} required disabled={!!editRoute}>
                        <SelectTrigger id="type">
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bus">Bus</SelectItem>
                            <SelectItem value="metro">Metro</SelectItem>
                            <SelectItem value="ferry">Ferry</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className='space-y-2'>
                  <label htmlFor="price" className="text-sm font-medium">Price (₹)</label>
                  <Input id="price" name="price" type="number" step="0.01" placeholder="e.g., 25.00" defaultValue={editRoute?.price || ''} required />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : editRoute ? 'Update Route' : 'Add Route'}
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
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-10 w-10" />
                  </div>
                </div>
              ))
            ) : (
              routes?.map((route) => {
                  const Icon = iconMap[route.type] || Bus;
                  return (
                    <div key={route.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <Icon className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <p className="font-semibold">{route.routeName}</p>
                          <p className="text-sm text-muted-foreground">
                            ₹{typeof route.price === 'number' ? route.price.toFixed(2) : '0.00'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleStatusToggle(route)}>
                          {route.status === 'On Time' ? <Clock className="mr-2" /> : <AlertTriangle className="mr-2 text-destructive" />}
                          {route.status}
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(route)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(route.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  );
                }
              )
            )}
             {!isLoading && routes?.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    No transport routes found. Click "Add Route" to get started.
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
