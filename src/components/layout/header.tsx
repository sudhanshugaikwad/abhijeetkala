import { ActiveLink } from './active-link';

const navLinks = [
  { href: '/', label: 'All', category: 'all' },
  { href: '/', label: 'AI', category: 'ai' },
  { href: '/', label: 'Advertising', category: 'advertising' },
  { href: '/', label: 'Creative', category: 'creative' },
  { href: '/', label: 'Food', category: 'food' },
];

export function Header() {
  return (
    <header className="w-full">
      <div className="flex items-center justify-center h-16 px-4 sm:px-6 lg:px-8">
        <nav>
          <ul className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <ActiveLink
                  href={link.href}
                  category={link.category}
                  className="text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground pb-1"
                  activeClassName="!text-foreground"
                >
                  {link.label}
                </ActiveLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
       <hr className="border-border/40" />
    </header>
  );
}
