'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type Item = typeof PlaceHolderImages[number];

export function WorkPageClient({ items }: { items: Item[] }) {
  const [visibleItems, setVisibleItems] = useState(10);

  const showMoreItems = () => {
    setVisibleItems((prev) => prev + 5);
  };

  return (
    <div className="flex flex-col items-center">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 p-4">
            {items.slice(0, visibleItems).map((item) => (
            <Link key={item.id} href={`/work/${item.id}`} className="break-inside-avoid block group">
                <div className="relative aspect-auto overflow-hidden rounded-lg border border-neutral-700/60 hover:border-neutral-500 transition-colors duration-300">
                <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={800}
                    height={1200}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={item.imageHint}
                />
                <div className="absolute inset-0 bg-black/20" />
                </div>
            </Link>
            ))}
        </div>
        {visibleItems < items.length && (
            <div className="mt-8 text-center">
            <Button variant="link" className="text-neutral-400 hover:text-white" onClick={showMoreItems}>
                See more
            </Button>
            </div>
        )}
    </div>
  );
}
