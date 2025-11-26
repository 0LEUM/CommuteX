'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Bus, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function TransportPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-primary/95 px-4 text-primary-foreground backdrop-blur-sm md:px-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Home</span>
          </Link>
        </Button>
        <h1 className="text-xl font-bold tracking-tight">Public Transport Booking</h1>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
            <CardHeader className="items-center text-center">
                <div className="rounded-full border border-primary/20 bg-primary/10 p-3">
                    <Bus className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Book Public Transport</CardTitle>
                <CardDescription>Buy tickets and plan your journey.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Future booking form can go here */}
                <div className="flex flex-col gap-4 py-4 text-center text-sm text-muted-foreground">
                    <p>Booking functionality is coming soon!</p>
                </div>
                <Button className="w-full" size="lg">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Buy Tickets
                </Button>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
