'use client';

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bike, Zap } from "lucide-react";
import React from "react";

interface MicroMobilityVehicle {
  type: 'bike' | 'e-scooter';
  id: string; // The vehicle ID is usually the name
  batteryLevel?: number;
}

const vehicleIdToDetails: { [key: string]: { name: string, price: string } } = {
    'citybike-001': { name: 'CityBike', price: '₹80 to unlock' },
    'flowscoot-001': { name: 'FlowScoot', price: '₹24/min' },
    'cycleplus-001': { name: 'Cycle+', price: '₹20/min' },
};

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
        const details = vehicleIdToDetails[vehicle.id] || { name: 'Unknown Vehicle', price: 'N/A' };
        const range = vehicle.batteryLevel ? `${vehicle.batteryLevel}% battery` : 'N/A';
        const Icon = iconMap[vehicle.type] || Bike;

        return (
          <div key={vehicle.id} className="flex items-center justify-between gap-2 rounded-md border p-3">
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-muted-foreground"/>
              <div>
                <p className="font-semibold">{details.name}</p>
                <p className="text-sm text-muted-foreground">{range}</p>
              </div>
            </div>
              <Badge variant="default" className="bg-accent text-accent-foreground">{details.price}</Badge>
          </div>
        )
      })}
    </div>
  );
}