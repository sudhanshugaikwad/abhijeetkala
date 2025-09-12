import Link from 'next/link';
import { ActiveLink } from './active-link';

const navLinks = [
  { href: '/', label: 'Work' },
  { href: '/journal', label: 'Journal' },
  { href: '/info', label: 'Info' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-bold text-lg tracking-tight">
          Nikita Pugachev
        </Link>
        <nav>
          <ul className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <ActiveLink
                  href={link.href}
                  className="text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground pb-1"
                  activeClassName="!text-foreground border-b border-foreground"
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
