'use client';

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Bus, TramFront, Ship } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface PublicTransportRoute {
  routeName: string;
  type: 'bus' | 'metro' | 'ferry';
  stops: string[]; // This would be IDs to another collection
}

// In a real app you might fetch the stop details, but we'll hardcode for simplicity
const stopIdToName: { [key: string]: string } = {
  'stop-north-1': 'North District',
  'stop-financial-1': 'Financial Core',
  'stop-west-island-1': 'West Island',
};

// A mock for real-time updates which would come from another collection
const routeIdToRealtime: { [key: string]: { status: 'On Time' | 'Delayed' } } = {
  'route-1': { status: 'On Time' },
  'route-2': { status: 'Delayed' },
  'route-3': { status: 'On Time' },
};

const iconMap = {
  bus: Bus,
  metro: TramFront,
  ferry: Ship,
};


export default function PublicTransport() {
  const firestore = useFirestore();
  const routesQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "public_transport_routes")) : null),
    [firestore]
  );
  const { data: routes, isLoading } = useCollection<PublicTransportRoute>(routesQuery);

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
      {routes?.map((line) => {
        const destination = line.stops.length > 0 ? stopIdToName[line.stops[0]] || 'Unknown' : 'Unknown';
        const realtime = routeIdToRealtime[line.id] || { status: 'On Time' };
        const Icon = iconMap[line.type] || Bus;
        
        return (
          <div key={line.id} className="flex items-center justify-between gap-2 rounded-md border p-3">
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-muted-foreground"/>
              <div>
                <p className="font-semibold">{line.routeName}</p>
                <p className="text-sm text-muted-foreground">{destination}</p>
              </div>
            </div>
            <Badge variant={realtime.status === 'On Time' ? 'default' : 'outline'} className={realtime.status === 'On Time' ? 'bg-accent text-accent-foreground' : ''}>
              {realtime.status}
            </Badge>
          </div>
        )
      })}
    </div>
  );
}