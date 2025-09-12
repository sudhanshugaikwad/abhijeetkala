'use client';
import { ActiveLink } from './active-link';

const navLinks = [
  { href: '/', label: 'All' },
  { href: '/', label: 'AI', category: 'ai' },
  { href: '/', label: 'Advertising', category: 'advertising' },
  { href: '/', label: 'Creative', category: 'creative' },
  { href: '/', label: 'Food', category: 'food' },
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
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground pb-2"
                  activeClassName="!text-foreground font-semibold border-b-2 border-current"
                >
                  {link.label}
                </ActiveLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
