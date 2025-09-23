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

  const isAllActive = !category && (currentCategory === 'all' || !currentCategory);
  const isCategoryActive = category && currentCategory?.toLowerCase() === category.toLowerCase();
  const isActive = pathname === href && (isAllActive || isCategoryActive);

  const linkHref = category ? `${href}?category=${category.toLowerCase()}` : `${href}?category=all`;

  return (
    <Link
      href={linkHref}
      className={cn(className, isActive && activeClassName)}
      {...props}
    >
      {children}
    </Link>
  );
}
