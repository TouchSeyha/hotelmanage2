'use client';

import { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Input } from '~/components/ui/input';
import { cn } from '~/lib/utils';

const AMENITY_ICONS = [
  'Wifi',
  'Car',
  'ParkingCircle',
  'Utensils',
  'Coffee',
  'Dumbbell',
  'Waves',
  'Bath',
  'Tv',
  'AirVent',
  'Snowflake',
  'Wind',
  'Flame',
  'Sparkles',
  'ShowerHead',
  'BedDouble',
  'BedSingle',
  'Sofa',
  'Lamp',
  'DoorOpen',
  'Key',
  'Lock',
  'ShieldCheck',
  'Cctv',
  'Phone',
  'Smartphone',
  'Laptop',
  'Printer',
  'Briefcase',
  'Luggage',
  'Shirt',
  'WashingMachine',
  'Iron',
  'Refrigerator',
  'Microwave',
  'CookingPot',
  'UtensilsCrossed',
  'Wine',
  'Beer',
  'Cocktail',
  'Baby',
  'Accessibility',
  'Cigarette',
  'CigaretteOff',
  'PawPrint',
  'Dog',
  'Cat',
  'Trees',
  'Flower2',
  'Sun',
  'Umbrella',
  'Mountain',
  'Bike',
  'Ship',
  'Plane',
  'Bus',
  'TrainFront',
  'MapPin',
  'Compass',
  'Clock',
  'Calendar',
  'Bell',
  'BellRing',
  'Headphones',
  'Music',
  'Gamepad2',
  'Puzzle',
  'Book',
  'Newspaper',
  'Gift',
  'Heart',
  'Star',
  'Award',
  'Crown',
  'Gem',
  'Wallet',
  'CreditCard',
  'Receipt',
  'Percent',
  'Banknote',
  'Globe',
  'Languages',
  'MessageCircle',
  'Mail',
  'Send',
  'Users',
  'UserCheck',
  'Handshake',
  'ThumbsUp',
  'Smile',
  'PartyPopper',
  'Cake',
  'Pizza',
  'Salad',
  'Apple',
  'Croissant',
  'Sandwich',
  'Soup',
  'IceCream',
  'Cookie',
  'Egg',
  'Fish',
  'Beef',
  'Carrot',
  'Grape',
  'Cherry',
  'Banana',
  'Citrus',
  'LeafyGreen',
  'Pill',
  'Stethoscope',
  'Syringe',
  'Thermometer',
  'Activity',
  'HeartPulse',
  'Eye',
  'Ear',
  'Hand',
  'Footprints',
  'PersonStanding',
  'Armchair',
  'Tent',
  'Fence',
  'TreePine',
  'CloudSun',
  'Sunset',
  'MoonStar',
  'Zap',
  'Battery',
  'Plug',
  'Lightbulb',
  'Fan',
  'Heater',
  'Droplets',
  'Anchor',
  'LifeBuoy',
  'Sailboat',
  'FishSymbol',
  'Shell',
  'Palmtree',
  'Sunrise',
  'Rainbow',
  'Cloud',
  'Cloudy',
] as const;

interface IconPickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function IconPicker({
  value,
  onChange,
  placeholder = 'Select an icon...',
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredIcons = useMemo(() => {
    if (!search) return AMENITY_ICONS;
    const lowerSearch = search.toLowerCase();
    return AMENITY_ICONS.filter((name) => name.toLowerCase().includes(lowerSearch));
  }, [search]);

  const SelectedIcon = value
    ? (LucideIcons[value as keyof typeof LucideIcons] as LucideIcon | undefined)
    : null;

  const handleSelect = (iconName: string) => {
    onChange(iconName);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-start font-normal"
        >
          {SelectedIcon ? (
            <div className="flex items-center gap-2">
              <SelectedIcon className="h-4 w-4" />
              <span>{value}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground ml-auto"
              aria-label="Clear selection"
            >
              <LucideIcons.X className="h-4 w-4" />
            </button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="border-b p-2">
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
            autoComplete="off"
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-2">
          {filteredIcons.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">No icons found</p>
          ) : (
            <div className="grid grid-cols-6 gap-1">
              {filteredIcons.map((iconName) => {
                const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as
                  | LucideIcon
                  | undefined;
                if (!Icon) return null;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => handleSelect(iconName)}
                    className={cn(
                      'hover:bg-accent flex h-10 w-10 items-center justify-center rounded-md transition-colors',
                      value === iconName && 'bg-accent ring-ring ring-2'
                    )}
                    title={iconName}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
