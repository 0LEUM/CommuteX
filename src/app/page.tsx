import Image from 'next/image';
import { ParkingSquare, Bus, Bike, Route, Wallet, Calendar, AlertCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RouteOptimizer from '@/components/route-optimizer';
import Logo from '@/components/icons/logo';
import { parkingLots, publicTransport, microMobility } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const parkingImage = PlaceHolderImages.find(p => p.id === 'parking');
  const transportImage = PlaceHolderImages.find(p => p.id === 'transport');
  const micromobilityImage = PlaceHolderImages.find(p => p.id === 'micromobility');

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-primary/95 px-4 text-primary-foreground backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-accent" />
          <h1 className="text-xl font-bold tracking-tight">CommuteX</h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="relative w-full overflow-hidden rounded-lg">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              data-ai-hint={heroImage.imageHint}
              fill
              className="object-cover"
            />
          )}
          <div className="relative flex h-[250px] flex-col items-start justify-end bg-gradient-to-t from-black/80 to-transparent p-6 md:h-[400px]">
            <h2 className="font-headline text-3xl font-bold text-white md:text-5xl">
              Your City, Seamlessly Connected
            </h2>
            <p className="mt-2 max-w-lg text-base text-gray-200 md:text-lg">
              AI-powered routing, parking, and transport in one unified hub.
            </p>
          </div>
        </div>

        <RouteOptimizer />

        <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
          <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4 bg-secondary/50 p-4">
              <ParkingSquare className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Smart Parking</CardTitle>
                <CardDescription>Real-time availability and reservations</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col p-4">
              {parkingImage && (
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-md">
                   <Image src={parkingImage.imageUrl} alt={parkingImage.description} data-ai-hint={parkingImage.imageHint} fill className="object-cover transition-transform hover:scale-105" />
                </div>
              )}
              <div className="flex flex-col gap-3">
                {parkingLots.map((lot) => (
                  <div key={lot.id} className="flex items-center justify-between gap-2 rounded-md border p-3">
                    <div>
                      <p className="font-semibold">{lot.name}</p>
                      <p className="text-sm text-muted-foreground">{lot.price}</p>
                    </div>
                    <Badge variant={lot.available > 0 ? 'default' : 'destructive'} className="bg-accent text-accent-foreground shrink-0">
                      {lot.available > 0 ? `${lot.available} spots` : 'Full'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4 bg-secondary/50 p-4">
              <Bus className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Public Transport</CardTitle>
                <CardDescription>Schedules, tickets, and live tracking</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col p-4">
              {transportImage && (
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-md">
                   <Image src={transportImage.imageUrl} alt={transportImage.description} data-ai-hint={transportImage.imageHint} fill className="object-cover transition-transform hover:scale-105" />
                </div>
              )}
              <div className="flex flex-col gap-3">
                {publicTransport.map((line) => (
                  <div key={line.id} className="flex items-center justify-between gap-2 rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      <line.icon className="h-5 w-5 text-muted-foreground"/>
                      <div>
                        <p className="font-semibold">{line.name}</p>
                        <p className="text-sm text-muted-foreground">{line.destination}</p>
                      </div>
                    </div>
                    <Badge variant={line.status === 'On Time' ? 'default' : 'outline'} className={line.status === 'On Time' ? 'bg-accent text-accent-foreground' : ''}>
                      {line.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4 bg-secondary/50 p-4">
              <Bike className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Micro-Mobility</CardTitle>
                <CardDescription>Bikes and e-scooters on demand</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col p-4">
              {micromobilityImage && (
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-md">
                   <Image src={micromobilityImage.imageUrl} alt={micromobilityImage.description} data-ai-hint={micromobilityImage.imageHint} fill className="object-cover transition-transform hover:scale-105" />
                </div>
              )}
              <div className="flex flex-col gap-3">
                {microMobility.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between gap-2 rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      <vehicle.icon className="h-5 w-5 text-muted-foreground"/>
                      <div>
                        <p className="font-semibold">{vehicle.name}</p>
                        <p className="text-sm text-muted-foreground">{vehicle.range}</p>
                      </div>
                    </div>
                     <Badge variant="default" className="bg-accent text-accent-foreground">{vehicle.price}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
