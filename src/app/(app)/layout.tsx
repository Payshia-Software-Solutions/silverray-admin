import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, Bell, User } from 'lucide-react';
import { Nav } from '@/components/nav';
import { AppLogo } from '@/components/app-logo';
import { Header } from '@/components/header';
import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader>
           <AppLogo />
        </SidebarHeader>
        <SidebarContent>
          <Nav />
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter className="p-4 flex flex-col gap-4">
           <Button variant="ghost" className="justify-start gap-2" asChild>
            <Link href="/settings">
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://placehold.co/40x40.png" alt="Admin" data-ai-hint="person avatar" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">Admin User</span>
              <span className="text-xs text-sidebar-foreground/70 truncate">admin@silverray.com</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-secondary/30">
        <header className="flex h-auto items-center gap-4 border-b bg-card px-6 py-4 sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
            <SidebarTrigger className="md:hidden" />
            <Header />
            <div className="flex-1 flex justify-end items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User Profile</span>
              </Button>
              <div className="flex items-center gap-3">
                 <div className="flex flex-col text-right">
                    <span className="text-sm font-semibold truncate">User Saman</span>
                    <span className="text-xs text-muted-foreground truncate">Administrator</span>
                 </div>
                 <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User Saman" data-ai-hint="person portrait" />
                    <AvatarFallback>US</AvatarFallback>
                 </Avatar>
              </div>
            </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
