
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

    // Clear existing data before seeding
    const collections = ['parking_lots', 'public_transport_routes', 'micro_mobility_vehicles'];
    
    const clearCollections = async () => {
      // Note: This is a simple clearing for prototyping. 
      // For large collections, a more robust Cloud Function based approach would be needed.
    };
    
    const seedData = () => {
      const parkingLots = [
        { id: 'lot-a', name: 'North Gateway Garage', pricePerHour: 50, availableSpaces: 58, totalSpaces: 150 },
        { id: 'lot-b', name: 'Downtown Plaza Lot', pricePerHour: 75, availableSpaces: 12, totalSpaces: 50 },
        { id: 'lot-c', name: 'West End Parking', pricePerHour: 40, availableSpaces: 0, totalSpaces: 75 },
      ];
      parkingLots.forEach(lot => {
        const docRef = doc(firestore, 'parking_lots', lot.id);
        batch.set(docRef, lot);
      });

      const publicTransportRoutes = [
        { id: 'route-1', routeName: 'Express 101', type: 'bus', price: 20, status: 'On Time', stops: ['stop-north-1', 'stop-financial-1'] },
        { id: 'route-2', routeName: 'Metro Line A', type: 'metro', price: 45, status: 'Delayed', stops: ['stop-financial-1', 'stop-west-island-1'] },
        { id: 'route-3', routeName: 'Island Ferry', type: 'ferry', price: 150, status: 'On Time', stops: ['stop-west-island-1'] },
      ];
      publicTransportRoutes.forEach(route => {
        const docRef = doc(firestore, 'public_transport_routes', route.id);
        batch.set(docRef, route);
      });

      const microMobilityVehicles = [
        { id: 'citybike-001', name: 'CityBike', type: 'bike', price: '₹80 to unlock', batteryLevel: 100, available: true },
        { id: 'flowscoot-001', name: 'FlowScoot', type: 'e-scooter', price: '₹24/min', batteryLevel: 78, available: true },
        { id: 'cycleplus-001', name: 'Cycle+', type: 'bike', price: '₹20/min', batteryLevel: 100, available: false },
      ];
      microMobilityVehicles.forEach(vehicle => {
        const docRef = doc(firestore, 'micro_mobility_vehicles', vehicle.id);
        batch.set(docRef, vehicle);
      });

      batch.commit()
        .then(() => {
          toast({
            title: 'Database Seeding',
            description: 'Database re-seeded successfully!',
          });
        })
        .catch((error) => {
          toast({
            variant: 'destructive',
            title: 'Seeding Failed',
            description: 'Could not seed the database. Check permissions.',
          });
          const permissionError = new FirestorePermissionError({
            path: `[batch operation]`,
            operation: 'write',
            requestResourceData: { 
              info: "Batch write for seeding all collections."
            },
          });
          errorEmitter.emit('permission-error', permissionError);
        })
        .finally(() => {
          setIsSeeding(false);
        });
    }

    // A simple approach without collection deletion for now, just overwrite docs
    seedData();
  };

  return (
    <Button type="button" variant="outline" size="sm" disabled={isSeeding} onClick={handleSeed}>
      {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
      {isSeeding ? 'Seeding...' : 'Seed Database'}
    </Button>
  );
}
