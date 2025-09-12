'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useSearchParams } from 'next/navigation';

export default function WorkPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const images = PlaceHolderImages.filter(img => {
    if (!category) return img.id.startsWith('work-') && img.category.toLowerCase() === 'ai';
    return img.category.toLowerCase() === category.toLowerCase() && img.id.startsWith('work-');
  });

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {images.map((image) => {
        const url = new URL(image.imageUrl);
        const parts = url.pathname.split('/');
        const width = parseInt(parts[parts.length - 2]);
        const height = parseInt(parts[parts.length - 1]);

        return (
          <div key={image.id} className="break-inside-avoid">
            <Link href={`/work/${image.id}`}>
              <figure className="group">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  width={width}
                  height={height}
                  data-ai-hint={image.imageHint}
                  className="w-full h-auto object-cover transition-opacity duration-300 group-hover:opacity-80"
                />
                 <figcaption className="text-sm mt-2">{image.title}</figcaption>
                 <figcaption className="text-xs text-muted-foreground">{image.client}</figcaption>
              </figure>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
