'use client';

import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

type IconData = {
  name: string;
  category: string;
};

const SOLAR_ICONS: IconData[] = [
  { name: 'solar:album-broken', category: 'album' },
  { name: 'solar:folder-broken', category: 'folder' },
  { name: 'solar:folder-open-broken', category: 'folder' },
  { name: 'solar:backpack-broken', category: 'backpack' },
  { name: 'solar:bicycling-broken', category: 'bicycling' },
  { name: 'solar:book-broken', category: 'book' },
  { name: 'solar:fire-broken', category: 'fire' },
  { name: 'solar:bolt-broken', category: 'bolt' },
  { name: 'solar:cloud-broken', category: 'cloud' },
];

export function IconSelector({
  selectedIcon,
  onSelect,
  color,
}: {
  selectedIcon?: string;
  onSelect: (icon: string) => void;
  color?: string;
}) {
  const [search, setSearch] = useState('');

  const filteredIcons = useMemo(() => {
    if (!search) return SOLAR_ICONS;
    return SOLAR_ICONS.filter((icon) =>
      icon.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <div className="max-w-2xl">
      <div className="space-y-4">
        <Input
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex max-h-[500px] grid-cols-5 flex-wrap gap-1 overflow-y-auto">
          {filteredIcons.map((icon) => (
            <Button
              type="button"
              key={icon.name}
              onClick={() => {
                onSelect(icon.name);
              }}
              variant={icon.name === selectedIcon ? 'secondary' : 'ghost'}
            >
              <Icon style={{ color }} className="size-6" icon={icon.name} />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
