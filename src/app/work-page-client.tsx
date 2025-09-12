'use client';

import type { ImagePlaceholder } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';

export function WorkPageClient({ items }: { items: ImagePlaceholder[] }) {
  const [visibleItems, setVisibleItems] = useState(10);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const showMoreItems = () => {
    setVisibleItems((prev) => prev + 5);
  };

  const handleMouseEnter = (index: number) => {
    videoRefs.current[index]?.play();
  };

  const handleMouseLeave = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <div className="container mx-auto">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 p-4">
            {items.slice(0, visibleItems).map((item, index) => (
            <Link key={item.id} href={`/work/${item.id}`} className="break-inside-avoid block group">
                <div 
                  className="relative aspect-auto overflow-hidden rounded-lg border border-neutral-700/60 hover:border-neutral-500 transition-colors duration-300"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  <video
                      ref={el => videoRefs.current[index] = el}
                      src={item.videoUrl}
                      muted
                      loop
                      playsInline
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
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
