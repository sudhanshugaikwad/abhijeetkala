'use client';

import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useSearchParams } from 'next/navigation';

export default function WorkPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const items = PlaceHolderImages.filter(img => {
    if (!category) return img.id.startsWith('work-');
    return img.category.toLowerCase() === category.toLowerCase() && img.id.startsWith('work-');
  });

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {items.map((item) => (
        <div key={item.id} className="break-inside-avoid">
          <Link href={`/work/${item.id}`}>
            <figure className="group relative">
              <video
                poster={item.imageUrl}
                loop
                muted
                playsInline
                className="w-full h-auto object-cover transition-opacity duration-300 group-hover:opacity-80"
                onMouseOver={event => (event.target as HTMLVideoElement).play()}
                onMouseOut={event => (event.target as HTMLVideoElement).pause()}
              >
                <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              </video>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <figcaption className="text-sm">{item.title}</figcaption>
                <figcaption className="text-xs text-muted-foreground">{item.client}</figcaption>
              </div>
            </figure>
          </Link>
        </div>
      ))}
    </div>
  );
}
