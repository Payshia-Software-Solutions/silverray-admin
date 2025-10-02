

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BedDouble, CalendarCheck, Globe, Heart, LayoutDashboard, Mail, Settings, Star, UserCog, Users, UtensilsCrossed, Terminal, Shield, Image, ClipboardList, PlusSquare, Building, Gift } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/rooms', label: 'Room Management', icon: BedDouble },
  { href: '/amenities', label: 'Amenities Management', icon: Shield },
  { href: '/reservations', label: 'Room Booking Management', icon: CalendarCheck },
  { 
    href: '/restaurant', 
    label: 'Restaurant & Dining', 
    icon: UtensilsCrossed,
  },
  { href: '/experience', label: 'Experience Management', icon: Star },
  { href: '/customers', label: 'Customer Management', icon: Users },
  { href: '/messages', label: 'Contact Messages', icon: Mail },
  { href: '/weddingpackages', label: 'Wedding Management', icon: Heart },
  { href: '/events', label: 'Event Management', icon: Gift },
  { href: '/gallery', label: 'Gallery Management', icon: Image },
  { href: '/website-content', label: 'Website Content', icon: Globe },
  { href: '/user-management', label: 'User Management', icon: UserCog },
 
];

export function Nav() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getParentPath = (path: string) => {
    const parts = path.split('?')[0].split('/').filter(p => p);
    if (parts.length > 1) {
       if (parts[0] === 'rooms' && (parts[1] === 'images' || parts[1] === 'types')) {
        return `/${parts[0]}/${parts[1]}`;
      }
      if (parts[0] === 'restaurant' && parts[1] === 'features') {
        return `/${parts[0]}`;
      }
      return `/${parts[0]}`;
    }
    return path;
  }

  const currentParentPath = getParentPath(pathname);

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
            asChild
            isActive={currentParentPath === getParentPath(item.href)}
            tooltip={item.label}
            className="justify-start group"
            >
            <Link href={item.href}>
                <item.icon className="h-5 w-5 text-sidebar-foreground/70 group-data-[active=true]:text-inherit" />
                <span
                className={cn(
                    'transition-opacity duration-200 text-sm font-medium',
                    (state === 'collapsed' && isMounted) && 'opacity-0'
                )}
                >
                {item.label}
                </span>
            </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
