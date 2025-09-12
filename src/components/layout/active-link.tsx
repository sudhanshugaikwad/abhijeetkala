"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

type ActiveLinkProps = ComponentProps<typeof Link> & {
  activeClassName?: string;
};

export function ActiveLink({ href, className, activeClassName, children, ...props }: ActiveLinkProps) {
  const pathname = usePathname();
  // Handle root path matching
  const isActive = href === '/' ? pathname === href : pathname.startsWith(href.toString());

  return (
    <Link
      href={href}
      className={cn(className, isActive && activeClassName)}
      {...props}
    >
      {children}
    </Link>
  );
}
