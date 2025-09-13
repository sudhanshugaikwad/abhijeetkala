'use client';

import { useState, useEffect } from 'react';

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full py-8 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-3xl mx-auto text-center text-sm text-muted-foreground border-t border-border/40 pt-8">
        <p>&copy; {year} Abhijeet Kala. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
