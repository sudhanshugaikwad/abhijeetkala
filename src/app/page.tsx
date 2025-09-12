'use client';

import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { Play, Pause, MoreVertical, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WorkPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'all';

  const items = PlaceHolderImages.filter(img => {
    if (category === 'all') return img.id.startsWith('work-');
    return img.category.toLowerCase() === category.toLowerCase() && img.id.startsWith('work-');
  });

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {items.map((item) => (
        <VideoPlayer key={item.id} item={item} />
      ))}
    </div>
  );
}

function VideoPlayer({ item }: { item: typeof PlaceHolderImages[0] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current?.paused) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  };

  const handleMouseEnter = () => {
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    videoRef.current?.pause();
  };

  return (
    <div 
      className="break-inside-avoid"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="group relative">
        <Link href={`/work/${item.id}`}>
          <video
            ref={videoRef}
            poster={item.imageUrl}
            loop
            muted
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-auto object-cover transition-opacity duration-300 cursor-pointer"
          >
            <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          </video>
        </Link>
        <div className="absolute top-0 left-0 right-0 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-end items-start gap-1 bg-gradient-to-b from-black/50 to-transparent">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white h-8 w-8" onClick={togglePlay}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white h-8 w-8">
              <MoreVertical size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white h-8 w-8">
              <Settings size={16} />
            </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-black/50 to-transparent">
          <figcaption className="text-sm cursor-pointer">{item.title}</figcaption>
          <figcaption className="text-xs text-muted-foreground">{item.client}</figcaption>
        </div>
      </div>
    </div>
  );
}
