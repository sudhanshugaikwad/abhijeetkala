import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';
import { WorkDetailPageClient } from './work-detail-page-client';

export async function generateStaticParams() {
  return PlaceHolderImages.map((image) => ({
    slug: image.id,
  }));
}

const WorkDetailPage = ({ params }: { params: { slug: string } }) => {
  const item = PlaceHolderImages.find((img) => img.id === params.slug);

  if (!item) {
    notFound();
  }

  const relatedItems = PlaceHolderImages.filter(
    (img) => img.id !== item.id
  );

  return <WorkDetailPageClient item={item} relatedItems={relatedItems} />;
};

export default WorkDetailPage;
