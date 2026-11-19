import React from 'react';
import {
  Sparkles,
  Truck,
  Bug,
  Trees,
  ShieldCheck,
  Paintbrush,
  Flame,
  Wind,
  Droplets,
  DoorClosed,
  CheckCircle,
  Wrench,
  LucideProps,
} from 'lucide-react';

interface ServiceIconProps extends LucideProps {
  name: string;
}

export default function ServiceIcon({ name, ...props }: ServiceIconProps) {
  switch (name) {
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'Truck':
      return <Truck {...props} />;
    case 'Bug':
      return <Bug {...props} />;
    case 'Trees':
      return <Trees {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} />;
    case 'Paintbrush':
      return <Paintbrush {...props} />;
    case 'Flame':
      return <Flame {...props} />;
    case 'Wind':
      return <Wind {...props} />;
    case 'Droplets':
      return <Droplets {...props} />;
    case 'DoorClosed':
      return <DoorClosed {...props} />;
    default:
      return <Wrench {...props} />;
  }
}
