import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return PlaceHolderImages.filter(img => img.id.startsWith('work-')).map((image) => ({
    slug: image.id,
  }));
}

export default function WorkDetailPage({ params }: { params: { slug: string } }) {
  const item = PlaceHolderImages.find((img) => img.id === params.slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-center text-lg">{item.client} - {item.title}</h1>
      <figure>
        <video
          controls
          autoPlay
          loop
          className="w-full h-auto object-contain"
        >
          <source src={item.videoUrl} type="video/mp4" />
        </video>
      </figure>
    </div>
  );
}
