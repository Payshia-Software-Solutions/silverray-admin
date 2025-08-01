
'use client';

import { usePathname } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';

const pageInfo: { [key: string]: { title: string; description: string } } = {
  '/': { title: 'Dashboard', description: "Welcome back! Here's what's happening at your hotel today." },
  '/rooms': { title: 'Rooms Management', description: 'View, add, edit, or delete hotel rooms.' },
  '/rooms/new': { title: 'Create New Room', description: 'Add a new room to your hotel.' },
  '/rooms/images': { title: 'Room Image Management', description: 'Upload, edit, and manage all room images.' },
  '/rooms/types': { title: 'Room Types Management', description: 'Create, view, edit, and manage room types.' },
  '/rooms/types/new': { title: 'Create New Room Type', description: 'Add a new category of room for your hotel.' },
  '/amenities': { title: 'Amenities Management', description: 'Manage all hotel amenities available for rooms.' },
  '/amenities/new': { title: 'Create New Amenity', description: 'Add a new amenity to your hotel.' },
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
  '/api-example': { title: 'API Connection Example', description: 'Demonstrating how to connect to a PHP back-end.'},
  '/customers': { title: 'Customer Management', description: 'View and manage your customer database.' },
  '/customers/new': { title: 'Customer Management', description: 'Add a new customer to your database.' },
  // Add other pages here
};

const dynamicPageInfo: { [key: string]: (params: { [key: string]: string }) => { title: string; description: string } } = {
  '/rooms/[id]': (params) => ({ title: 'Rooms Management', description: `Editing Room ${params.id}` }),
  '/rooms/types/[id]': (params) => ({ title: 'Edit Room Type', description: `Updating details for room type ID ${params.id}` }),
  '/amenities/[id]': (params) => ({ title: 'Edit Amenity', description: `Updating details for amenity ID ${params.id}` }),
  '/reservations/[id]': (params) => ({ title: 'Booking Management (Rooms & Suites)', description: `Details for Booking #${params.id}` }),
  '/weddings/booking/[id]': (params) => ({ title: `Booking #${params.id}`, description: 'Details for wedding booking' }),
  '/restaurant/menu/[id]': (params) => ({ title: `Restaurant & Dining Management`, description: 'Manage dining venues, menu items, and reservations' }),
  '/restaurant/reservations/[id]': (params) => ({ title: 'Restaurant & Dining', description: `Details for reservation #${params.id}` }),
  '/experience/[id]/bookings/new': (params) => ({ title: 'Experience Management', description: 'Create a new booking for this experience.' }),
  '/experience/[id]/edit': (params) => {
    const title = params.id.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    return { title: 'Experience Management', description: title };
  },
  '/experience/[id]/booking/[bookingId]': (params) => {
    const title = params.id.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    return { title: 'Experience Management', description: title };
  },
  '/experience/[id]': (params) => {
    const title = params.id.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    return { title: 'Experience Management', description: title };
  },
};


export function Header() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { title, description } = useMemo(() => {
    if (!isMounted) return { title: 'Loading...', description: 'Please wait...' };

    if (pageInfo[pathname]) {
      return pageInfo[pathname];
    }
    
    const pathSegments = pathname.split('/').filter(Boolean);
    
    for (const routePattern in dynamicPageInfo) {
      const patternSegments = routePattern.split('/').filter(Boolean);
      if (patternSegments.length !== pathSegments.length) continue;

      const params: { [key: string]: string } = {};
      let match = true;

      for (let i = 0; i < patternSegments.length; i++) {
        const patternSegment = patternSegments[i];
        const pathSegment = pathSegments[i];

        if (patternSegment.startsWith('[') && patternSegment.endsWith(']')) {
          const paramName = patternSegment.slice(1, -1);
          params[paramName] = pathSegment;
        } else if (patternSegment !== pathSegment) {
          match = false;
          break;
        }
      }

      if (match) {
        return dynamicPageInfo[routePattern](params);
      }
    }

    return { title: 'Page Not Found', description: "The page you are looking for does not exist." };
  }, [pathname, isMounted]);

  if (!isMounted) {
    return (
        <div className="grid gap-1">
            <div className="h-9 w-1/2 rounded-md bg-muted animate-pulse" />
            <div className="h-5 w-3/4 rounded-md bg-muted animate-pulse" />
        </div>
    );
  }

  return (
    <div className="grid gap-1">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-blue-800">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
