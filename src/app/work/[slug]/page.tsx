import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';
import { WorkDetailPageClient } from './work-detail-page-client';

export async function generateStaticParams() {
  return PlaceHolderImages.filter(img => img.id.startsWith('work-')).map((image) => ({
    slug: image.id,
  }));
}

const WorkDetailPage = ({ params }: { params: { slug: string } }) => {
  const item = PlaceHolderImages.find((img) => img.id === params.slug);

  if (!item) {
    notFound();
  }

  // Find other items for "More to explore" section
  const relatedItems = PlaceHolderImages.filter(
    (img) => img.id.startsWith('work-') && img.id !== item.id
  ).slice(0, 4);

  return <WorkDetailPageClient item={item} relatedItems={relatedItems} />;
};

export default WorkDetailPage;
