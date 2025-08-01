
'use client';

import { usePathname } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';

const pageInfo: { [key: string]: { title: string; description: string } } = {
  '/': { title: 'Dashboard', description: "Welcome back! Here's what's happening at your hotel today." },
  '/rooms': { title: 'Rooms Management', description: 'View, add, edit, or delete hotel rooms.' },
  '/rooms/new': { title: 'Create New Room', description: 'Add a new room to your hotel.' },
  '/rooms/types': { title: 'Room Types Management', description: 'Create, view, edit, and manage room types.' },
  '/rooms/types/new': { title: 'Create New Room Type', description: 'Add a new category of room for your hotel.' },
  '/amenities': { title: 'Amenities Management', description: 'Manage all hotel amenities available for rooms.' },
  '/amenities/new': { title: 'Create New Amenity', description: 'Add a new amenity to your hotel.' },
  '/reservations': { title: 'Booking Management (Rooms & Suites)', description: 'Manage Bookings' },
  '/reservations/new': { title: 'Create New Booking', description: 'Add a new room or suite booking.' },
  '/restaurant': { title: 'Restaurant & Dining Management', description: 'Manage dining venues, menu items, and reservations' }, 
  '/restaurant/new': { title: 'Add New Restaurant Venue', description: 'Create a new dining venue in your hotel.' },
  '/restaurant/menu/new': { title: 'Add New Menu Item', description: 'Add a new dish or beverage to a restaurant menu.' },
  '/restaurant/reservations/new': { title: 'Create Dining Reservation', description: 'Manually book a table for a guest.' },
  '/messages': { title: 'Contact Form Messages', description: 'Manage and respond to customer inquiries' },
  '/experience': { title: 'Experience Management', description: 'Manage and showcase unique guest experiences and activities.' },
  '/experience/new': { title: 'Add New Experience', description: 'Create a new guest experience to offer.' },
  '/weddings': { title: 'Wedding Management', description: 'Manage wedding packages, halls, and bookings' },  
  '/weddings/new': { title: 'Create New Wedding Package', description: 'Design a new package for wedding events.' },
  '/weddings/booking/new': { title: 'Create Wedding Booking', description: 'Book a new wedding event for a client.' },
  '/website-content': { title: 'Website Content Management', description: 'Manage your website content and pages' },
  '/user-management': { title: 'User Management', description: 'Manage admin accounts and permissions' },
  '/user-management/new': { title: 'Add New Admin', description: 'Create a new administrative user account.' },
  '/settings': { title: 'Settings', description: 'Manage your application and hotel settings.' },
  '/api-example': { title: 'API Connection Example', description: 'Demonstrating how to connect to a PHP back-end.'},
  '/customers': { title: 'Customer Management', description: 'View and manage your customer database.' },
  '/customers/new': { title: 'Customer Management', description: 'Add a new customer to your database.' },
  '/rooms/types/[id]': { title: 'Edit Room Type', description: `Updating details for a room type.` },
  '/amenities/[id]': { title: 'Edit Amenity', description: `Updating details for an amenity.` },
  '/reservations/[id]': { title: 'Booking Management (Rooms & Suites)', description: `Details for a booking.` },
  '/weddings/booking/[id]': { title: `Wedding Booking Details`, description: 'Details for a wedding booking.' },
  '/restaurant/menu/[id]': { title: `Edit Menu Item`, description: 'Manage a dining menu item.' },
  '/restaurant/reservations/[id]': { title: 'Restaurant Reservation Details', description: `Details for a dining reservation.` },
  '/experience/new-booking': { title: 'Experience Management', description: 'Create a new booking for this experience.' },
};

// Simplified dynamic logic to avoid enumerating params
const getDynamicPageInfo = (pathname: string) => {
    const pathSegments = pathname.split('/').filter(Boolean);

    if (pathSegments[0] === 'rooms' && pathSegments.length === 2 && pathSegments[1] !== 'new' && pathSegments[1] !== 'types') {
        return { title: 'Edit Room', description: `Editing Room ${pathSegments[1]}` };
    }
    if (pathSegments[0] === 'experience' && pathSegments.length === 2 && pathSegments[1] !== 'new') {
        const title = pathSegments[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return { title: 'Experience Details', description: `Bookings and details for ${title}` };
    }
    if (pathSegments[0] === 'experience' && pathSegments.length > 2) {
        const title = pathSegments[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        if(pathSegments[2] === 'edit'){
            return { title: 'Edit Experience', description: `Editing ${title}` };
        }
        if(pathSegments[2] === 'bookings' && pathSegments[3] === 'new'){
            return { title: 'New Experience Booking', description: `Creating a booking for ${title}` };
        }
        if(pathSegments[2] === 'booking' && pathSegments[3]){
             return { title: 'View Experience Booking', description: `Details for booking in ${title}` };
        }
    }
    
    // Fallback for any other dynamic routes or if no match
    const staticPath = `/${pathSegments.slice(0, -1).join('/')}/[id]`;
    if (pageInfo[staticPath]) {
        return pageInfo[staticPath];
    }
    
    return null;
}


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
    
    const dynamicInfo = getDynamicPageInfo(pathname);
    if (dynamicInfo) {
      return dynamicInfo;
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
