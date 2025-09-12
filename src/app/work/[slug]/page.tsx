import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';

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
    <div className="space-y-4">
        <h1 className="text-center text-lg">{image.client} - {image.title}</h1>
        <figure>
          <Image
            src={image.imageUrl}
            alt={image.description}
            width={width}
            height={height}
            data-ai-hint={image.imageHint}
            className="w-full h-auto object-contain"
          />
        </figure>
    </div>
  );
}
