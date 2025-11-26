
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ParkingSquare, Bus, Bike, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import RouteOptimizer from '@/components/route-optimizer';
import Logo from '@/components/icons/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import SmartParking from '@/components/smart-parking';
import PublicTransport from '@/components/public-transport';
import MicroMobility from '@/components/micro-mobility';
import SeedDatabase from '@/components/seed-database';
import { useAuth } from '@/firebase';
import { Button } from './ui/button';

export default function MainPage() {
  const auth = useAuth();
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const parkingImage = PlaceHolderImages.find(p => p.id === 'parking');
  const transportImage = PlaceHolderImages.find(p => p.id === 'transport');
  const micromobilityImage = PlaceHolderImages.find(p => p.id === 'micromobility');

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-primary/95 px-4 text-primary-foreground backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-accent" />
          <h1 className="text-xl font-bold tracking-tight">CityFlow</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <SeedDatabase />
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
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
          <Link href="/parking" className="flex">
            <Card className="flex w-full flex-col overflow-hidden transition-all hover:shadow-lg">
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
                <SmartParking />
              </CardContent>
            </Card>
          </Link>

          <Link href="/transport" className="flex">
            <Card className="flex w-full flex-col overflow-hidden transition-all hover:shadow-lg">
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
                <PublicTransport />
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/micromobility" className="flex">
            <Card className="flex w-full flex-col overflow-hidden transition-all hover:shadow-lg">
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
                <MicroMobility />
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
