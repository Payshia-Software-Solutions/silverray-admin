import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Star, Bed, Calendar } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const stats = [
  { label: 'Total Experiences', value: '12', icon: Star, color: 'bg-blue-100', iconColor: 'text-blue-600' },
  { label: 'Active Experiences', value: '9', icon: Bed, color: 'bg-green-100', iconColor: 'text-green-600' },
  { label: 'Total Bookings', value: '247', icon: Calendar, color: 'bg-yellow-100', iconColor: 'text-yellow-600' },
];

const experiences = [
    {
        title: 'Tea Factory Tour',
        description: '60 minutes\n$85 per person\nAdvance booking required',
        image: 'https://placehold.co/600xx400',
        status: 'Active',
    },
    {
        title: 'Sunrise Yoga Session',
        description: '45 minutes\n$25 per person\nWalk-in available',
        image: 'https://placehold.co/600x400',
        status: 'Active',
    },
    {
        title: 'Cultural Dance Performance',
        description: '80 Capacity\nFree for guests\nAdvance booking required',
        image: 'https://placehold.co/600x400',
        status: 'Seasonal',
    },
    {
        title: 'Sapphire Trail Adventure',
        description: '3 hours\n$85 per person\nAdvance booking required',
        image: 'https://placehold.co/600x400',
        status: 'Active',
    },
    {
        title: 'Cooking Masterclass',
        description: '2 hours\n$45 per person\nWalk-in available',
        image: 'https://placehold.co/600x400',
        status: 'Inactive',
    },
    {
        title: 'Bird Watching Tour',
        description: '2.5 hours\n$35 per person\nAdvance booking required',
        image: 'https://placehold.co/600x400',
        status: 'Active',
    },
];


export default function ExperienceManagementPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Experience Management</h1>
      <p className="text-muted-foreground">Manage engaging experiences offered to guests</p>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <div className={cn('p-2 rounded-md', stat.color)}>
                <stat.icon className={cn('h-4 w-4', stat.iconColor)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Add */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search experiences..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      </div>

      {/* Experiences Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {experiences.map((experience, index) => (
          <Card key={index} className="flex flex-col">
            <div className="relative w-full h-48">
              <Image
                src={experience.image}
                alt={experience.title}
                fill
                className="rounded-t-lg object-cover"
              />
               {experience.status && (
                <span className={cn(
                    'absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full',
                    experience.status === 'Active' && 'bg-green-500 text-white',
                    experience.status === 'Seasonal' && 'bg-orange-500 text-white',
                    experience.status === 'Inactive' && 'bg-gray-500 text-white'
                )}>
                  {experience.status}
                </span>
               )}
            </div>
            <CardContent className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold mb-2">{experience.title}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{experience.description}</p>
              <div className="mt-auto flex justify-between items-center pt-4">
                <Button variant="outline" size="sm">View Bookings</Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="w-8 h-8">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil h-4 w-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                    </Button>
                     <Button variant="outline" size="icon" className="w-8 h-8 text-red-500 hover:text-red-600">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 h-4 w-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}