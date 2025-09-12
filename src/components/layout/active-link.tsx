"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { ComponentProps, ReactNode } from 'react';

type ActiveLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
  children: ReactNode;
  activeClassName?: string;
  className?: string;
  category?: string;
};

export function ActiveLink({ href, children, activeClassName, className, category, ...props }: ActiveLinkProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  const isActive = pathname === href && (category ? currentCategory === category : !currentCategory && children === 'AI');
  const isAllActive = pathname === href && !currentCategory && children === 'All';

  const linkHref = category ? `${href}?category=${category}` : href;

  return (
    <Link
      href={linkHref}
      className={cn(className, (isActive || isAllActive) && activeClassName)}
      {...props}
    >
      {children}
    </Link>
  );
}
