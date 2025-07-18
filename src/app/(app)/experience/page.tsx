
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Star, CheckCircle, Calendar, Clock, DollarSign, Users, Ticket, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const stats = [
  { label: 'Total Experiences', value: '12', icon: Star, color: 'text-blue-500', bgColor: 'bg-blue-100' },
  { label: 'Active Experiences', value: '9', icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-100' },
  { label: 'Total Bookings', value: '247', icon: Calendar, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
];

const experiences = [
    {
        title: 'Tea Factory Tour',
        details: [
            { icon: Clock, text: '90 minutes' },
            { icon: DollarSign, text: '$65 per person' },
            { icon: Ticket, text: 'Advance booking required' },
        ],
        image: 'https://placehold.co/600x400',
        imageHint: 'tea plantation',
        status: 'Active',
    },
    {
        title: 'Sunrise Yoga Session',
        details: [
            { icon: Clock, text: '60 minutes' },
            { icon: DollarSign, text: '$25 per person' },
            { icon: Users, text: 'Walk-in available' },
        ],
        image: 'https://placehold.co/600x400',
        imageHint: 'yoga sunrise',
        status: 'Active',
    },
    {
        title: 'Cultural Dance Performance',
        details: [
            { icon: Clock, text: '45 minutes' },
            { icon: DollarSign, text: 'Free for guests' },
            { icon: Ticket, text: 'Advance booking required' },
        ],
        image: 'https://placehold.co/600x400',
        imageHint: 'cultural dance',
        status: 'Seasonal',
    },
    {
        title: 'Sapphire Trail Adventure',
        details: [
            { icon: Clock, text: '3 hours' },
            { icon: DollarSign, text: '$85 per person' },
            { icon: Ticket, text: 'Advance booking required' },
        ],
        image: 'https://placehold.co/600x400',
        imageHint: 'nature trail',
        status: 'Active',
    },
    {
        title: 'Cooking Masterclass',
        details: [
            { icon: Clock, text: '2 hours' },
            { icon: DollarSign, text: '$45 per person' },
            { icon: Users, text: 'Walk-in available' },
        ],
        image: 'https://placehold.co/600x400',
        imageHint: 'cooking class',
        status: 'Inactive',
    },
    {
        title: 'Bird Watching Tour',
        details: [
            { icon: Clock, text: '2.5 hours' },
            { icon: DollarSign, text: '$35 per person' },
            { icon: Ticket, text: 'Advance booking required' },
        ],
        image: 'https://placehold.co/600x400',
        imageHint: 'bird watching',
        status: 'Active',
    },
];


export default function ExperienceManagementPage() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
               <div className={cn('p-2 rounded-md', stat.bgColor)}>
                <stat.icon className={cn('h-4 w-4', stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Add */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search experiences..."
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      </div>

      {/* Experiences Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {experiences.map((experience, index) => (
          <Card key={index} className="flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48">
              <Image
                src={experience.image}
                alt={experience.title}
                fill
                className="object-cover"
                data-ai-hint={experience.imageHint}
              />
               {experience.status && (
                <span className={cn(
                    'absolute top-2 right-2 px-2.5 py-1 text-xs font-semibold rounded-full text-white',
                    experience.status === 'Active' && 'bg-green-500',
                    experience.status === 'Seasonal' && 'bg-orange-500',
                    experience.status === 'Inactive' && 'bg-gray-500'
                )}>
                  {experience.status}
                </span>
               )}
            </div>
            <CardContent className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold mb-2">{experience.title}</h3>
              <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                  {experience.details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-2">
                          <detail.icon className="h-4 w-4"/>
                          <span>{detail.text}</span>
                      </div>
                  ))}
              </div>
              <div className="mt-auto flex justify-between items-center pt-2 gap-2">
                <Button variant="outline" className="w-full">View Bookings</Button>
                <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4"/>
                    <span className="sr-only">Edit</span>
                </Button>
                 <Button variant="outline" size="icon" className="text-red-500 hover:bg-red-500 hover:text-white">
                   <Trash2 className="h-4 w-4"/>
                   <span className="sr-only">Delete</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
