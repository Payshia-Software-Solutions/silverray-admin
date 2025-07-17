'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BedDouble, CalendarCheck, Globe, Heart, LayoutDashboard, Mail, Settings, Star, UserCog, Users, UtensilsCrossed } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/rooms', label: 'Room Management', icon: BedDouble },
  { href: '/reservations', label: 'Booking Management', icon: CalendarCheck },
  { href: '/customers', label: 'User Management', icon: Users },
  { href: '/restaurant', label: 'Restaurant & Dining', icon: UtensilsCrossed },
  { href: '/experience', label: 'Experience Management', icon: Star },
  { href: '/messages', label: 'Contact Messages', icon: Mail },
  { href: '/weddings', label: 'Wedding Management', icon: Heart },
  { href: '/website-content', label: 'Website Content', icon: Globe },
  { href: '/user-management', label: 'User Management', icon: UserCog },
 
];

export function Nav() {
  const pathname = usePathname();
  const { state } = useSidebar();

  const getParentPath = (path: string) => {
    const parts = path.split('/').filter(p => p);
    if (parts.length > 1) {
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
                    state === 'collapsed' ? 'opacity-0' : 'opacity-100'
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
