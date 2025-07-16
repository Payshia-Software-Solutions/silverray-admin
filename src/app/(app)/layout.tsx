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
import { LogOut, Settings } from 'lucide-react';
import { Nav } from '@/components/nav';
import { AppLogo } from '@/components/app-logo';

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
           <Button variant="ghost" className="justify-start gap-2">
            <Settings className="h-5 w-5" />
            <span className="text-sm font-medium">Settings</span>
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
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6 sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
                {/* Header content can go here */}
            </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
