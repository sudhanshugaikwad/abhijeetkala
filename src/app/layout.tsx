import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased bg-background text-foreground')}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="w-full py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center text-sm text-muted-foreground border-t border-border/40 pt-6">
              <p>&copy; {new Date().getFullYear()} Abhijeet Kala. All Rights Reserved.</p>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
