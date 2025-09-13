'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { WorkPageClient } from './work-page-client';

export default function WorkPage() {
  const items = PlaceHolderImages;

  return <WorkPageClient items={items} />;
}
