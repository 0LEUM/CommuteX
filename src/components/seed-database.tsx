'use client';

import { useState } from 'react';
import { writeBatch, doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Database, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function SeedDatabase() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = () => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firestore is not initialized.',
      });
      return;
    }

    setIsSeeding(true);
    
    const batch = writeBatch(firestore);

    const parkingLots = [
      { id: 'lot-a', name: 'North Gateway Garage', pricePerHour: 3.50, availableSpaces: 58, totalSpaces: 150 },
      { id: 'lot-b', name: 'Downtown Plaza Lot', pricePerHour: 5.00, availableSpaces: 12, totalSpaces: 50 },
      { id: 'lot-c', name: 'West End Parking', pricePerHour: 2.75, availableSpaces: 0, totalSpaces: 75 },
    ];
    parkingLots.forEach(lot => {
      const docRef = doc(firestore, 'parking_lots', lot.id);
      batch.set(docRef, { ...lot, seeding: true });
    });

    const publicTransportRoutes = [
      { id: 'route-1', routeName: 'Express 101', type: 'bus', stops: ['stop-north-1', 'stop-financial-1'] },
      { id: 'route-2', routeName: 'Metro Line A', type: 'metro', stops: ['stop-financial-1', 'stop-west-island-1'] },
      { id: 'route-3', routeName: 'Island Ferry', type: 'ferry', stops: ['stop-west-island-1'] },
    ];
    publicTransportRoutes.forEach(route => {
      const docRef = doc(firestore, 'public_transport_routes', route.id);
      batch.set(docRef, { ...route, seeding: true });
    });

    const microMobilityVehicles = [
      { id: 'citybike-001', type: 'bike', batteryLevel: 100, available: true },
      { id: 'flowscoot-001', type: 'e-scooter', batteryLevel: 78, available: true },
      { id: 'cycleplus-001', type: 'bike', batteryLevel: 100, available: true },
    ];
    microMobilityVehicles.forEach(vehicle => {
      const docRef = doc(firestore, 'micro_mobility_vehicles', vehicle.id);
      batch.set(docRef, { ...vehicle, seeding: true });
    });

    batch.commit()
      .then(() => {
        toast({
          title: 'Database Seeding',
          description: 'Database seeded successfully!',
        });
      })
      .catch((error) => {
        // Since batch writes don't give individual document context,
        // we create a more general error.
        const permissionError = new FirestorePermissionError({
          path: `[batch operation]`,
          operation: 'write',
          requestResourceData: { 
            info: "Batch write for parking_lots, public_transport_routes, and micro_mobility_vehicles."
          },
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSeeding(false);
      });
  };

  return (
    <Button type="button" variant="outline" size="sm" disabled={isSeeding} onClick={handleSeed}>
      {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
      {isSeeding ? 'Seeding...' : 'Seed Database'}
    </Button>
  );
}
