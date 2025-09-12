'use client';

import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { WorkPageClient } from './work-page-client';

export default function WorkPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'all';

  const items = PlaceHolderImages.filter(img => {
    if (category === 'all') return img.id.startsWith('work-');
    return img.category.toLowerCase() === category.toLowerCase() && img.id.startsWith('work-');
  });

  return <WorkPageClient items={items} />;
}
