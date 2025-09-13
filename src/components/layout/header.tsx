'use client';
import { ActiveLink } from './active-link';
import { Sparkles, BrainCircuit, Megaphone, Paintbrush, Utensils } from 'lucide-react';
import type { ComponentType } from 'react';

const navLinks: { href: string; label: string; category?: string; icon: ComponentType<{ className?: string }> }[] = [
  { href: '/', label: 'All', icon: Sparkles },
  { href: '/', label: 'AI', category: 'ai', icon: BrainCircuit },
  { href: '/', label: 'Advertising', category: 'advertising', icon: Megaphone },
  { href: '/', label: 'Creative', category: 'creative', icon: Paintbrush },
  { href: '/', label: 'Food', category: 'food', icon: Utensils },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-center h-16 px-4 sm:px-6 lg:px-8">
        <nav>
          <ul className="flex flex-wrap items-center justify-center space-x-4 sm:space-x-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <ActiveLink
                  href={link.href}
                  category={link.category}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground pb-2"
                  activeClassName="!text-foreground font-semibold border-b-2 border-foreground"
                >
                  <link.icon className="size-4" />
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
