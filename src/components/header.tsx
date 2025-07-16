'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const pageInfo: { [key: string]: { title: string; description: string } } = {
  '/': { title: 'Dashboard', description: "Welcome back! Here's what's happening at your hotel today." },
  '/rooms': { title: 'Rooms Management', description: 'View, add, edit, or delete hotel rooms.' },
  '/reservations': { title: 'Reservations', description: 'Manage all guest reservations and their status.' },
  '/customers': { title: 'User Management', description: 'Manage all your guest and customer records.' },
  // Add other pages here
};


export function Header() {
  const pathname = usePathname();
  const { title, description } = useMemo(() => {
    return pageInfo[pathname] ?? { title: 'Page Not Found', description: '' };
  }, [pathname]);

  return (
    <div className="grid gap-1">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
