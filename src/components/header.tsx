
'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const pageInfo: { [key: string]: { title: string; description: string } } = {
  '/': { title: 'Dashboard', description: "Welcome back! Here's what's happening at your hotel today." },
  '/rooms': { title: 'Rooms Management', description: 'View, add, edit, or delete hotel rooms.' },
  '/rooms/new': { title: 'Create New Room', description: 'Add a new room to your hotel.' },
  '/reservations': { title: 'Booking Management (Rooms & Suites)', description: 'Manage Bookings' },
  '/reservations/new': { title: 'Booking Management (Rooms & Suites)', description: 'Manage Bookings' },
  '/restaurant': { title: 'Restaurant & Dining Management', description: 'Manage dining venues, menu items, and reservations' }, 
  '/restaurant/new': { title: 'Restaurant & Dining Management', description: 'Manage dining venues, menu items, and reservations' },
  '/restaurant/menu/new': { title: 'Restaurant & Dining Management', description: 'Manage dining venues, menu items, and reservations' },
  '/restaurant/reservations/new': { title: 'Restaurant & Dining Management', description: 'Manage dining venues, menu items, and reservations' },
  '/messages': { title: 'Contact Form Messages', description: 'Manage and respond to customer inquiries' },
  '/experience': { title: 'Experience Management', description: 'Manage and showcase unique guest experiences and activities.' },
  '/experience/new': { title: 'Add New Experience', description: 'Create a new guest experience to offer.' },
  '/weddings': { title: 'Wedding Management', description: 'Manage wedding packages, halls, and bookings' },  
  '/weddings/new': { title: 'Wedding Management', description: 'Manage wedding packages, halls, and bookings' },
  '/weddings/booking/new': { title: 'Wedding Management', description: 'Manage wedding packages, halls, and bookings' },
  '/website-content': { title: 'Website Content Management', description: 'Manage your website content and pages' },
  '/user-management': { title: 'User Management', description: 'Manage admin accounts and permissions' },
  '/user-management/new': { title: 'User Management', description: 'Manage admin accounts and permissions' },
  '/settings': { title: 'Settings', description: 'Manage your application and hotel settings.' },

  // Add other pages here
};

const dynamicPageInfo: { [key: string]: (params: any) => { title: string; description: string } } = {
  '/rooms/[id]': ({id}) => ({ title: `Rooms Management`, description: `Editing Room ${id}` }),
  '/reservations/[id]': ({id}) => ({ title: `Booking Management (Rooms & Suites)`, description: `Details for Booking #${id}` }),
  '/weddings/booking/[id]': ({id}) => ({ title: `Booking #${id}`, description: 'Details for wedding booking' }),
};


export function Header() {
  const pathname = usePathname();

  const { title, description } = useMemo(() => {
    // First, check for an exact match in static pages
    if (pageInfo[pathname]) {
      return pageInfo[pathname];
    }
    
    // Then, check for dynamic routes
    const pathSegments = pathname.split('/').filter(Boolean);
    
    for (const routePattern in dynamicPageInfo) {
      const patternSegments = routePattern.split('/').filter(Boolean);
      if (pathSegments.length === patternSegments.length) {
        const params: { [key: string]: string } = {};
        let match = true;
        for (let i = 0; i < patternSegments.length; i++) {
          if (patternSegments[i].startsWith('[') && patternSegments[i].endsWith(']')) {
            const paramName = patternSegments[i].slice(1, -1);
            params[paramName] = pathSegments[i];
          } else if (pathSegments[i] !== patternSegments[i]) {
            match = false;
            break;
          }
        }
        if (match) {
          return dynamicPageInfo[routePattern](params);
        }
      }
    }

    return { title: 'Page Not Found', description: '' };
  }, [pathname]);

  return (
    <div className="grid gap-1">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-blue-800">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
