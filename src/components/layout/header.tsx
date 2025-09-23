'use client';
import { ActiveLink } from './active-link';
import type { ReactNode } from 'react';
import { Home, Bot, Megaphone, Brush, Utensils } from 'lucide-react';

const navLinks: { href: string; label: string; category?: string, icon: ReactNode }[] = [
  { href: '/', label: 'All', icon: <Home size={16} /> },
  { href: '/', label: 'AI', category: 'ai', icon: <Bot size={16} /> },
  { href: '/', label: 'Advertising', category: 'advertising', icon: <Megaphone size={16} /> },
  { href: '/', label: 'Creative', category: 'creative', icon: <Brush size={16} /> },
  { href: '/', label: 'Food', category: 'food', icon: <Utensils size={16} /> },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full py-4">
      <div className="container flex items-center justify-center px-4 max-w-full overflow-x-auto">
        <nav className="border border-[#e5e5e5]/30 rounded-full p-1 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <ul className="flex items-center space-x-1">
            {navLinks.map((link) => (
              <li key={link.label} className="flex-shrink-0">
                <ActiveLink
                  href={link.href}
                  category={link.category}
                  className="px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground rounded-full flex items-center gap-1.5"
                  activeClassName="!text-foreground bg-white/10"
                >
                  {link.icon}
                  <span className="hidden sm:inline">{link.label}</span>
                </ActiveLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
