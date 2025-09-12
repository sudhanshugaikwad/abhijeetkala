import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  return PlaceHolderImages.filter(img => img.id.startsWith('work-')).map((image) => ({
    slug: image.id,
  }));
}

export default function WorkDetailPage({ params }: { params: { slug: string } }) {
  const image = PlaceHolderImages.find((img) => img.id === params.slug);

  if (!image) {
    notFound();
  }

  const url = new URL(image.imageUrl);
  const parts = url.pathname.split('/');
  const width = parseInt(parts[parts.length - 2]);
  const height = parseInt(parts[parts.length - 1]);

  return (
    <div className="relative min-h-[calc(100vh-10rem)] flex items-center justify-center">
       <Link href="/" className="absolute -top-4 left-0 z-10 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} />
        Back to Work
      </Link>
      <div className="w-full max-w-5xl p-4">
        <figure>
          <Image
            src={image.imageUrl}
            alt={image.description}
            width={width}
            height={height}
            data-ai-hint={image.imageHint}
            className="w-full h-auto object-contain"
          />
          <figcaption className="text-center text-muted-foreground mt-4 text-sm">{image.description}</figcaption>
        </figure>
      </div>
    </div>
  );
}
