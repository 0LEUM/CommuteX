'use client';

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ParkingLot {
  name: string;
  pricePerHour: string;
  availableSpaces: number;
}

export default function SmartParking() {
  const firestore = useFirestore();
  const parkingLotsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "parking_lots")) : null),
    [firestore]
  );
  const { data: parkingLots, isLoading } = useCollection<ParkingLot>(parkingLotsQuery);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-2 rounded-md border p-3">
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {parkingLots?.map((lot) => (
        <div key={lot.id} className="flex items-center justify-between gap-2 rounded-md border p-3">
          <div>
            <p className="font-semibold">{lot.name}</p>
            <p className="text-sm text-muted-foreground">${lot.pricePerHour}/hr</p>
          </div>
          <Badge variant={lot.availableSpaces > 0 ? 'default' : 'destructive'} className="bg-accent text-accent-foreground shrink-0">
            {lot.availableSpaces > 0 ? `${lot.availableSpaces} spots` : 'Full'}
          </Badge>
        </div>
      ))}
    </div>
  );
}
