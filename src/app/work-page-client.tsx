'use client';

import type { ImagePlaceholder } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';

export function WorkPageClient({ items }: { items: ImagePlaceholder[] }) {
  const [visibleItems, setVisibleItems] = useState(3);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const showMoreItems = () => {
    setVisibleItems((prev) => prev + 3);
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
    <div className="max-w-3xl mx-auto">
        <div className="space-y-12">
            {items.slice(0, visibleItems).map((item, index) => (
              <div key={item.id} className="group">
                  <h2 className="text-lg font-medium mb-4">{item.title}</h2>
                  <Link href={`/work/${item.id}`} className="break-inside-avoid block">
                      <div 
                        className="relative aspect-video overflow-hidden rounded-lg border border-neutral-700/60 hover:border-neutral-500 transition-colors duration-300"
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
              </div>
            ))}
        </div>
        {visibleItems < items.length && (
            <div className="mt-12 text-center">
            <Button variant="link" className="text-neutral-400 hover:text-white" onClick={showMoreItems}>
                See more
            </Button>
            </div>
        )}
    </div>
  );
}
