
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BedDouble, CalendarCheck, FileText, LayoutDashboard, UserCog, Users } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/rooms', label: 'Rooms', icon: BedDouble },
  { href: '/reservations', label: 'Reservations', icon: CalendarCheck },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/staff', label: 'Staff', icon: UserCog },
  { href: '/reports', label: 'Reports', icon: FileText },
];

export function Nav() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} legacyBehavior passHref>
            <SidebarMenuButton
              as="a"
              isActive={pathname === item.href}
              tooltip={item.label}
              className="justify-start"
            >
              <item.icon className="h-5 w-5" />
              <span
                className={cn(
                  'transition-opacity duration-200',
                  state === 'collapsed' ? 'opacity-0' : 'opacity-100'
                )}
              >
                {item.label}
              </span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
