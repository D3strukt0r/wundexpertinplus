import type {ReactNode} from 'react';
import {cn} from '~/lib/utils';

interface Props {
  className?: string;
  children: ReactNode;
}

// Display heading shared by the desktop-style sections (Leistungen, Über mich).
// `<em>` inside renders italic + primary for the emphasised phrase. The
// `[&_em]:text-primary` token is animated via the `-webkit-text-fill-color`
// rule in _base.scss so it crossfades on theme flip without stalling.
export function SectionTitle({className, children}: Props) {
  return (
    <h2
      className={cn(
        'mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl',
        '[&_em]:italic [&_em]:text-primary',
        className,
      )}
    >
      {children}
    </h2>
  );
}
