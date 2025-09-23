'use client';

import { PlaceHolderVideos } from '@/lib/placeholder-videos';
import { WorkPageClient } from './work-page-client';
import { useSearchParams } from 'next/navigation';
import { useState, useMemo, Suspense } from 'react';

function WorkPageContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const allItems = useMemo(() => {
    if (category && category !== 'all') {
      return PlaceHolderVideos.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    }
    return PlaceHolderVideos;
  }, [category]);
  
  const [visibleItems, setVisibleItems] = useState(4);

  const showMoreItems = () => {
    setVisibleItems((prev) => prev + 4);
  };
  
  const items = allItems.slice(0, visibleItems);

  return (
    <>
      <WorkPageClient items={items} />
      {visibleItems < allItems.length && (
        <div className="text-center mt-12">
          <p onClick={showMoreItems} className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
            See more
          </p>
        </div>
      )}
    </>
  );
}

export default function WorkPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkPageContent />
    </Suspense>
  );
}
