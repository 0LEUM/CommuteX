
'use client';

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bike, Zap } from "lucide-react";
import React from "react";

interface MicroMobilityVehicle {
  id: string;
  name: string;
  type: 'bike' | 'e-scooter';
  price: string;
  batteryLevel?: number;
  available: boolean;
}

const iconMap = {
    'bike': Bike,
    'e-scooter': Zap
};


export default function MicroMobility() {
  const firestore = useFirestore();
  const vehiclesQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "micro_mobility_vehicles")) : null),
    [firestore]
  );
  const { data: vehicles, isLoading } = useCollection<MicroMobilityVehicle>(vehiclesQuery);

  if (isLoading) {
    return (
       <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-2 rounded-md border p-3">
             <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5" />
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {vehicles?.map((vehicle) => {
        const range = vehicle.type === 'e-scooter' ? `${vehicle.batteryLevel}% battery` : 'Mechanical';
        const Icon = iconMap[vehicle.type] || Bike;

        return (
          <div key={vehicle.id} className="flex items-center justify-between gap-2 rounded-md border p-3">
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-muted-foreground"/>
              <div>
                <p className="font-semibold">{vehicle.name}</p>
                <p className="text-sm text-muted-foreground">{range}</p>
              </div>
            </div>
            {vehicle.available ? 
              <Badge variant="default" className="bg-accent text-accent-foreground">{vehicle.price}</Badge>
              :
              <Badge variant="secondary">In Use</Badge>
            }
          </div>
        )
      })}
    </div>
  );
}
