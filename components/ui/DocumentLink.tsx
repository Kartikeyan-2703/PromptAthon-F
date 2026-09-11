'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';

type DocumentLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: ReactNode;
  prefetch?: boolean;
  replace?: boolean;
};

/**
 * Uses native document navigation instead of Vinext's RSC client router.
 * The deployed Worker currently throws while starting an RSC transition;
 * a full navigation is reliable and preserves normal links/accessibility.
 */
export default function DocumentLink({ href, children, prefetch: _prefetch, replace: _replace, ...props }: DocumentLinkProps) {
  void _prefetch;
  void _replace;
  return <a href={href} {...props}>{children}</a>;
}
