import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import { Footer } from '@/components/layout/footer';
import { BackToTopButton } from '@/components/layout/back-to-top-button';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Portfolio of a creative professional',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn('font-body antialiased bg-background text-foreground')}>
        <Header />
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Suspense>
            <Footer />
          </Suspense>
        </div>
        <Toaster />
        <BackToTopButton />
      </body>
    </html>
  );
}
