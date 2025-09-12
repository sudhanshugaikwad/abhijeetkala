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
  const item = PlaceHolderImages.find((img) => img.id === params.slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold text-white">{item.title}</h1>
          <Link href="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>
        <div className="aspect-video">
          <video
            controls
            autoPlay
            loop
            className="w-full h-full object-contain"
          >
            <source src={item.videoUrl} type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
