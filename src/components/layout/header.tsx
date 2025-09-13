'use client';
import { ActiveLink } from './active-link';
import type { ComponentType } from 'react';

const navLinks: { href: string; label: string; category?: string }[] = [
  { href: '/', label: 'All'},
  { href: '/', label: 'AI', category: 'ai' },
  { href: '/', label: 'Advertising', category: 'advertising' },
  { href: '/', label: 'Creative', category: 'creative' },
  { href: '/', label: 'Food', category: 'food' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <nav className="border border-border/40 rounded-full p-1">
          <ul className="flex items-center justify-center space-x-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <ActiveLink
                  href={link.href}
                  category={link.category}
                  className="px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-full"
                  activeClassName="!text-foreground bg-white/10"
                >
                  <span>{link.label}</span>
                </ActiveLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
