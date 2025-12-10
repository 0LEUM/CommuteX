'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Route, Navigation, Loader2, Clock, DollarSign, FileText, AlertCircle, Sparkles, Map } from 'lucide-react';
import { getOptimalRoute, State } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoogleMapView from './google-map-view';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Find Optimal Route
    </Button>
  );
}

// Extend state data to include start and end locations for the map
interface RouteData extends NonNullable<State['data']> {
  startLocation?: string;
  endLocation?: string;
}

export default function RouteOptimizer() {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useActionState(getOptimalRoute, initialState);
  const routeData = state.data as RouteData | null;

  return (
    <Card className="w-full overflow-hidden shadow-lg">
      <CardHeader className="bg-primary/5 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary p-3">
            <Route className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl">AI Route Optimizer</CardTitle>
            <CardDescription>Find the fastest, cheapest, and smartest way to travel.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 p-4 md:grid-cols-2 md:p-6">
        <form action={dispatch} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <label htmlFor="startLocation" className="text-sm font-medium">Start Location</label>
            <Input id="startLocation" name="startLocation" placeholder="e.g., 123 Main St, Cityville" required />
            {state.errors?.startLocation && (
              <p className="text-sm text-destructive">{state.errors.startLocation[0]}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="endLocation" className="text-sm font-medium">End Location</label>
            <Input id="endLocation" name="endLocation" placeholder="e.g., Central Park, Cityville" required />
             {state.errors?.endLocation && (
              <p className="text-sm text-destructive">{state.errors.endLocation[0]}</p>
            )}
          </div>
           {state.errors?._form && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.errors._form[0]}</AlertDescription>
              </Alert>
            )}
          <SubmitButton />
        </form>

        <div className="flex flex-col rounded-lg border bg-secondary/30">
           <Tabs defaultValue="details" className="flex h-full flex-col">
            <TabsList className="w-full rounded-b-none rounded-t-lg">
              <TabsTrigger value="details" className="w-full gap-2"><FileText /> Details</TabsTrigger>
              <TabsTrigger value="map" className="w-full gap-2"><Map /> Map</TabsTrigger>
            </TabsList>
            <div className="flex-1 p-4">
              <TabsContent value="details">
                 {routeData ? (
                  <div className="flex flex-col gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-2 font-semibold">
                          <FileText className="h-4 w-4 text-primary"/>
                          <span>Summary</span>
                        </div>
                        <p className="pl-6 text-muted-foreground">{routeData.routeSummary}</p>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 font-semibold">
                              <Clock className="h-4 w-4 text-primary"/>
                              <span>Travel Time</span>
                          </div>
                          <p className="text-right text-muted-foreground">{routeData.estimatedTravelTime}</p>
                          <div className="flex items-center gap-2 font-semibold">
                              <DollarSign className="h-4 w-4 text-primary"/>
                              <span>Est. Cost</span>
                          </div>
                          <p className="text-right text-muted-foreground">{routeData.costEstimate}</p>
                      </div>
                      <Separator />
                      <div>
                          <div className="flex items-center gap-2 font-semibold mb-2">
                              <Navigation className="h-4 w-4 text-primary"/>
                              <span>Route Details</span>
                          </div>
                          <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap rounded-md bg-background/50 p-3">
                            {routeData.optimalRoute}
                          </div>
                      </div>
                  </div>
                ) : (
                  <div className="flex h-full min-h-[200px] items-center justify-center">
                      <p className="text-center text-muted-foreground">Enter your locations to see route details.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="map">
                {routeData?.startLocation && routeData?.endLocation ? (
                   <div className="relative aspect-video w-full overflow-hidden rounded-md">
                     <GoogleMapView 
                       startLocation={routeData.startLocation}
                       endLocation={routeData.endLocation}
                     />
                  </div>
                ) : (
                  <div className="flex h-full min-h-[200px] items-center justify-center">
                    <p className="text-center text-muted-foreground">Map will be displayed here after a route is generated.</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
