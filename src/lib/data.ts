import { Bus, TramFront, Ship, Bike, Zap } from 'lucide-react';

export const parkingLots = [
  { id: 1, name: 'Downtown Garage', available: 25, total: 150, price: '₹255/hr' },
  { id: 2, name: 'City Center Lot', available: 0, total: 50, price: '₹425/hr' },
  { id: 3, name: 'Uptown Parkade', available: 78, total: 300, price: '₹212/hr' },
];

export const publicTransport = [
  { id: 1, name: 'Bus 12', destination: 'North District', status: 'On Time', icon: Bus },
  { id: 2, name: 'Metro Line A', destination: 'Financial Core', status: 'Delayed', icon: TramFront },
  { id: 3, name: 'Ferry', destination: 'West Island', status: 'On Time', icon: Ship },
];

export const microMobility = [
  { id: 1, name: 'CityBike', type: 'Bike', range: 'N/A', price: '₹85 to unlock', icon: Bike },
  { id: 2, name: 'FlowScoot', type: 'E-Scooter', range: '25 km range', price: '₹25/min', icon: Zap },
  { id: 3, name: 'Cycle+', type: 'E-Bike', range: '40 km range', price: '₹21.25/min', icon: Bike },
];
