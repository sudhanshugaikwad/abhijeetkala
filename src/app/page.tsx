'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useSearchParams } from 'next/navigation';
import { WorkPageClient } from './work-page-client';

export default function WorkPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'all';

  const items = PlaceHolderImages.filter(img => {
    if (category === 'all') return true;
    return img.category.toLowerCase() === category.toLowerCase();
  });

  return <WorkPageClient items={items} />;
}
