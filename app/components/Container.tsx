import type {ReactNode} from 'react';
import {cn} from '~/lib/utils';

interface ContainerProps {
  // Override the rendered tag when a non-`div` element would be more semantic.
  as?: 'div' | 'nav' | 'section' | 'header' | 'footer';
  className?: string;
  children: ReactNode;
}

// Centred content cap shared by the nav and every section inner. Wraps
// Tailwind's stepped `container` utility (scrollbar-aware snapping, capped at
// xl/1264 — see tailwind.css) together with `mx-auto` and the gutter scale, so
// call sites only carry their own layout classes.
export function Container({as: Tag = 'div', className, children}: ContainerProps) {
  return (
    <Tag className={cn('container mx-auto px-5 sm:px-8 lg:px-10', className)}>
      {children}
    </Tag>
  );
}
