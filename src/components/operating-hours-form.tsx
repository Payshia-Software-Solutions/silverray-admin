
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from './ui/textarea';
import { Clock, Users } from 'lucide-react';

export type DayHours = {
    open: boolean;
    open_time: string;
    close_time: string;
};

export type OperatingHoursState = {
    [key: string]: DayHours;
};

interface OperatingHoursFormProps {
    operatingHours: OperatingHoursState;
    setOperatingHours: React.Dispatch<React.SetStateAction<OperatingHoursState>>;
    register: any;
    errors: any;
}

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function OperatingHoursForm({ operatingHours, setOperatingHours, register, errors }: OperatingHoursFormProps) {

    const handleDayToggle = (day: string, checked: boolean) => {
        setOperatingHours(prev => ({
            ...prev,
            [day]: { ...prev[day], open: checked }
        }));
    };

    const handleTimeChange = (day: string, type: 'open_time' | 'close_time', value: string) => {
        setOperatingHours(prev => ({
            ...prev,
            [day]: { ...prev[day], [type]: value }
        }));
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Users className="h-5 w-5 text-primary"/>Capacity & Operating Hours</h3>
            <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input id="capacity" type="number" placeholder="Number of guests" {...register('capacity')} />
                {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity.message}</p>}
            </div>

            <div className="space-y-4">
                <Label>Operating Hours</Label>
                <div className="space-y-3">
                    {daysOfWeek.map(day => (
                        <div key={day} className="grid grid-cols-4 items-center gap-4 p-2 border rounded-md">
                            <div className="flex items-center space-x-2">
                                <Checkbox id={`open-${day}`} checked={operatingHours[day]?.open} onCheckedChange={(checked) => handleDayToggle(day, !!checked)} />
                                <Label htmlFor={`open-${day}`} className="capitalize font-medium">{day}</Label>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`open-time-${day}`} className="text-xs">Open Time</Label>
                                <Input id={`open-time-${day}`} type="time" disabled={!operatingHours[day]?.open} value={operatingHours[day]?.open_time || ''} onChange={(e) => handleTimeChange(day, 'open_time', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`close-time-${day}`} className="text-xs">Close Time</Label>
                                <Input id={`close-time-${day}`} type="time" disabled={!operatingHours[day]?.open} value={operatingHours[day]?.close_time || ''} onChange={(e) => handleTimeChange(day, 'close_time', e.target.value)} />
                            </div>
                            {!operatingHours[day]?.open && <p className="col-span-2 text-center text-sm text-muted-foreground">Closed</p>}
                        </div>
                    ))}
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="special-hours-notes">Special Hours Notes</Label>
                <Textarea id="special-hours-notes" placeholder="e.g., Brunch only on Sundays, Happy hour 5-7 PM"/>
            </div>
        </div>
    );
}
