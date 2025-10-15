

'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const pageInfo: { [key: string]: { title: string; description: string } } = {
  '/': { title: 'Dashboard', description: "Welcome back! Here's what's happening at your hotel today." },
  '/rooms': { title: 'Rooms Management', description: 'View, add, edit, or delete hotel rooms.' },
  '/rooms/new': { title: 'Create New Room', description: 'Add a new room to your hotel.' },
  '/rooms/types': { title: 'Room Types Management', description: 'Create, view, edit, and manage room types.' },
  '/rooms/types/new': { title: 'Create New Room Type', description: 'Add a new category of room for your hotel.' },
  '/amenities': { title: 'Amenities Management', description: 'Manage all hotel amenities available for rooms.' },
  '/amenities/new': { title: 'Create New Amenity', description: 'Add a new amenity to your hotel.' },
  '/halls': { title: 'Hall Booking', description: 'Manage all halls available for weddings and events.' },
  '/halls/new': { title: 'Add new Hall', description: 'Add a new hall to your hotel.' },
  '/reservations': { title: 'Booking Management (Rooms & Suites)', description: 'Manage Bookings' },
  '/reservations/new': { title: 'Create New Booking', description: 'Add a new room or suite booking.' },
  '/bookings': { title: 'Bookings Management', description: 'Manage all bookings.' },
  '/bookings/new': { title: 'Create New Booking', description: 'Add a new booking record.' },
  '/restaurant': { title: 'Restaurant & Dining Management', description: 'Manage dining venues, menu items, and reservations' }, 
  '/restaurant/new': { title: 'Add New Restaurant Venue', description: 'Create a new dining venue in your hotel.' },
  '/restaurant/menu/new': { title: 'Add New Menu Item', description: 'Add a new dish or beverage to a restaurant menu.' },
  '/restaurant/reservations/new': { title: 'Create Dining Reservation', description: 'Manually book a table for a guest.' },
  '/restaurant/features': { title: 'Restaurant Features Management', description: 'Manage all features available for restaurants.' },
  '/restaurant/features/new': { title: 'Create New Restaurant Feature', description: 'Add a new feature for restaurants.' },
  '/messages': { title: 'Contact Form Messages', description: 'Manage and respond to customer inquiries' },
  '/experience': { title: 'Experience Management', description: 'Manage and showcase unique guest experiences and activities.' },
  '/experience/new': { title: 'Add New Experience', description: 'Create a new guest experience to offer.' },
  '/weddingpackages': { title: 'Wedding Management', description: 'Manage wedding packages, halls, and bookings' },  
  '/weddingpackages/new': { title: 'Create New Wedding Package', description: 'Design a new package for wedding events.' },
  '/events': { title: 'Event Management', description: 'Plan and manage corporate events, parties, and other functions.' },
  '/events/new': { title: 'Add New Event', description: 'Create a new event booking.' },
  '/package-inclusions': { title: 'Package Inclusions', description: 'Manage all package inclusions for weddings and events.' },
  '/package-inclusions/new': { title: 'Add new Inclusion', description: 'Add a new inclusion to your system.' },
  '/gallery': { title: 'Gallery Management', description: 'Manage your website\'s image gallery.' },
  '/website-content': { title: 'Website Content Management', description: 'Manage your website content and pages' },
  '/user-management': { title: 'User Management', description: 'Manage admin accounts and permissions' },
  '/user-management/new': { title: 'Add New Admin', description: 'Create a new administrative user account.' },
  '/user-management/roles/new': { title: 'Add New Role', description: 'Define a new user role and its permissions.' },
  '/settings': { title: 'Settings', description: 'Manage your application and hotel settings.' },
  '/customers': { title: 'Customer Management', description: 'View and manage your customer database.' },
  '/customers/new': { title: 'Add New Customer', description: 'Add a new customer to your database.' },
};

const getDynamicPageInfo = (pathname: string) => {
    const pathSegments = pathname.split('/').filter(Boolean);

    if (pathSegments[0] === 'rooms' && pathSegments.length === 2 && pathSegments[1] !== 'new' && pathSegments[1] !== 'types') {
        return { title: 'Edit Room', description: 'Editing Room ' + pathSegments[1] };
    }
     if (pathSegments[0] === 'rooms' && pathSegments[1] === 'types' && pathSegments.length > 2 && pathSegments[2] !== 'new') {
        return { title: 'Edit Room Type', description: 'Updating details for a room type.' };
    }
     if (pathSegments[0] === 'amenities' && pathSegments.length > 1 && pathSegments[1] !== 'new') {
        return { title: 'Edit Amenity', description: 'Updating details for an amenity.' };
    }
    if (pathSegments[0] === 'halls' && pathSegments.length > 1 && pathSegments[1] !== 'new') {
        return { title: 'Edit Hall', description: 'Updating details for a hall.' };
    }
    if (pathSegments[0] === 'events' && pathSegments.length > 1 && pathSegments[1] !== 'new') {
        return { title: 'Edit Event', description: 'Updating details for an event.' };
    }
     if (pathSegments[0] === 'package-inclusions' && pathSegments.length > 1 && pathSegments[1] !== 'new') {
        return { title: 'Edit Package Inclusion', description: 'Updating details for an inclusion.' };
    }
    if (pathSegments[0] === 'customers' && pathSegments.length > 1 && pathSegments[1] !== 'new') {
        return { title: 'Edit Customer', description: 'Updating details for a customer.' };
    }
     if (pathSegments[0] === 'messages' && pathSegments.length > 1 && pathSegments[1] !== 'new') {
        return { title: 'View Message', description: 'Viewing message details.' };
    }
    if (pathSegments[0] === 'user-management' && pathSegments.length > 1) {
        if (pathSegments[1] !== 'new' && pathSegments[1] !== 'roles') {
            return { title: 'Edit User', description: 'Updating details for a user.' };
        }
        if (pathSegments[1] === 'roles' && pathSegments[2] && pathSegments[2] !== 'new') {
            return { title: 'Edit Role', description: 'Update an existing user role and its permissions.' };
        }
    }
     if (pathSegments[0] === 'reservations' && pathSegments.length > 1 && pathSegments[1] !== 'new') {
        return { title: 'Booking Management (Rooms & Suites)', description: 'Details for a booking.' };
    }
    if (pathSegments[0] === 'bookings' && pathSegments.length > 1 && pathSegments[1] !== 'new') {
        return { title: 'Edit Booking', description: 'Details for booking #' + pathSegments[1] + '.' };
    }
     if (pathSegments[0] === 'weddingpackages' && pathSegments.length > 1 && pathSegments[1] !== 'new' && pathSegments[1] !== 'booking') {
        return { title: 'Edit Wedding Package', description: 'Update details for a wedding package.' };
    }
     if (pathSegments[0] === 'weddingpackages' && pathSegments[1] === 'booking' && pathSegments.length > 2 && pathSegments[2] !== 'new') {
        return { title: 'Wedding Booking Details', description: 'Details for a wedding booking.' };
    }
    if (pathSegments[0] === 'restaurant' && pathSegments[1] === 'edit' && pathSegments.length === 3) {
      return { title: 'Edit Restaurant Venue', description: 'Updating details for a restaurant venue.' };
    }
    if (pathSegments[0] === 'restaurant' && pathSegments.length > 1) {
        if(pathSegments[1] === 'menu' && pathSegments[2] && pathSegments[2] !== 'new'){
            return { title: 'Edit Menu Item', description: 'Manage a dining menu item.' };
        }
        if(pathSegments[1] === 'reservations' && pathSegments[2] && pathSegments[2] !== 'new'){
             return { title: 'Restaurant Reservation Details', description: 'Details for a dining reservation.' };
        }
         if(pathSegments[1] === 'features' && pathSegments.length > 1 && pathSegments[2] !== 'new'){
             return { title: 'Edit Restaurant Feature', description: 'Updating details for a restaurant feature.' };
        }
        if(pathSegments[1] === 'edit' && pathSegments.length === 3){
            return { title: 'Edit Restaurant Venue', description: 'Updating details for a restaurant venue.' };
        }
    }
    if (pathSegments[0] === 'experience' && pathSegments.length > 1) {
        const title = pathSegments[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        if (pathSegments.length === 2) {
            return { title: 'Experience Details', description: 'Bookings and details for ' + title };
        }
        if(pathSegments[2] === 'edit'){
            return { title: 'Edit Experience', description: 'Editing ' + title };
        }
        if(pathSegments[2] === 'bookings' && pathSegments.length > 3 && pathSegments[3] === 'new'){
            return { title: 'New Experience Booking', description: 'Creating a booking for ' + title };
        }
        if(pathSegments[2] === 'booking' && pathSegments.length > 3){
             return { title: 'View Experience Booking', description: 'Details for booking in ' + title };
        }
    }
    
    return null;
}


export function Header() {
  const pathname = usePathname();
  const [pageDetails, setPageDetails] = useState<{ title: string; description: string } | null>(null);

  useEffect(() => {
      const info = pageInfo[pathname] || getDynamicPageInfo(pathname) || { title: 'Page Not Found', description: "The page you are looking for does not exist." };
      setPageDetails(info);
  }, [pathname]);

  if (!pageDetails) {
    return (
        <div className="grid gap-1">
            <div className="h-8 w-48 bg-muted rounded-md animate-pulse"></div>
            <div className="h-5 w-72 bg-muted rounded-md animate-pulse"></div>
        </div>
    );
  }

  return (
    <div className="grid gap-1">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-blue-800">{pageDetails.title}</h1>
      <p className="text-muted-foreground">{pageDetails.description}</p>
    </div>
  );
}
