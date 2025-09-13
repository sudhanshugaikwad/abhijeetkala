'use client';
import { ActiveLink } from './active-link';
import type { ComponentType, ReactNode } from 'react';
import { Home, Bot, Megaphone, Brush, Utensils } from 'lucide-react';

const navLinks: { href: string; label: string; category?: string, icon: ReactNode }[] = [
  { href: '/', label: 'All', icon: <Home /> },
  { href: '/', label: 'AI', category: 'ai', icon: <Bot /> },
  { href: '/', label: 'Advertising', category: 'advertising', icon: <Megaphone /> },
  { href: '/', label: 'Creative', category: 'creative', icon: <Brush /> },
  { href: '/', label: 'Food', category: 'food', icon: <Utensils /> },
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
                  className="px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-full flex items-center gap-2"
                  activeClassName="!text-foreground bg-white/10"
                >
                  {link.icon}
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
