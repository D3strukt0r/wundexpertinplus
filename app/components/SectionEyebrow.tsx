import type {ReactNode} from 'react';
import {cn} from '~/lib/utils';

interface Props {
  className?: string;
  children: ReactNode;
}

// Small uppercase tag that introduces each section ("02 — Leistungen").
export function SectionEyebrow({className, children}: Props) {
  return (
    <div className={cn('text-[11px] uppercase tracking-[0.3em] text-primary', className)}>
      {children}
    </div>
  );
}
