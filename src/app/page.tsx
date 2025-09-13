'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { WorkPageClient } from './work-page-client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function WorkPage() {
  const allItems = PlaceHolderImages;
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
          <Button onClick={showMoreItems} variant="outline" size="lg">
            See more
          </Button>
        </div>
      )}
    </>
  );
}
