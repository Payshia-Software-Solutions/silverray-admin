
import { Hotel } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Card className="bg-primary/80 p-0.5">
        <CardContent className="p-1">
          <Hotel className="h-6 w-6 text-primary-foreground" />
        </CardContent>
      </Card>
      <div className='flex flex-col'>
        <span className="text-lg font-bold tracking-tight text-blue-800">Grand Silver Ray</span>
        <span className="text-xs text-sidebar-foreground/70">Hotel Admin</span>
      </div>
    </div>
  );
}
