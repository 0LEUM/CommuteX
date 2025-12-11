
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger, SidebarHeader, SidebarContent } from '@/components/ui/sidebar';
import { ParkingSquare, Bus, Bike, LogOut, Loader2 } from 'lucide-react';
import Logo from '@/components/icons/logo';
import SmartParkingAdmin from '@/components/admin/smart-parking-admin';
import PublicTransportAdmin from '@/components/admin/public-transport-admin';
import MicroMobilityAdmin from '@/components/admin/micro-mobility-admin';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('smart-parking');

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdminAuthenticated') === 'true';
    if (!isAdmin) {
      router.replace('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    router.push('/admin/login');
  };

  if (!isAuthenticated) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Logo className="h-8 w-8 text-accent" />
            <span className="text-lg font-semibold">Admin Panel</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={activeSection === 'smart-parking'} onClick={() => setActiveSection('smart-parking')}>
                <ParkingSquare />
                Smart Parking
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={activeSection === 'public-transport'} onClick={() => setActiveSection('public-transport')}>
                <Bus />
                Public Transport
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={activeSection === 'micro-mobility'} onClick={() => setActiveSection('micro-mobility')}>
                <Bike />
                Micro-Mobility
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <div className="mt-auto p-2">
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
                <LogOut />
                <span>Logout</span>
            </Button>
        </div>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold capitalize">{activeSection.replace('-', ' ')}</h1>
        </header>
        <main className="flex-1 p-4 lg:p-6">
            {activeSection === 'smart-parking' && <SmartParkingAdmin />}
            {activeSection === 'public-transport' && <PublicTransportAdmin />}
            {activeSection === 'micro-mobility' && <MicroMobilityAdmin />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
