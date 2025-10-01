
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image 
        src="https://content-provider.payshia.com/silver-ray/gallery-images/1/logopng-68dd3a98e6243.png" 
        alt="Grand Silver Ray logo" 
        width={40} 
        height={40} 
        className="rounded-md object-contain"
      />
      <div className='flex flex-col'>
        <span className="text-lg font-bold tracking-tight text-blue-800">Grand Silver Ray</span>
        <span className="text-xs text-sidebar-foreground/70">Hotel Admin</span>
      </div>
    </div>
  );
}
