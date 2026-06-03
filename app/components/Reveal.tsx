import type {ReactNode, Ref} from 'react';
import {useGsapReveal} from '~/hooks/useGsapReveal';

interface RevealProps {
  // Stagger offset (ms) before this element begins its entrance. Offsetting
  // siblings produces the cascading fade-and-rise sweep from the prototype.
  delay?: number;
  // Override the rendered tag when a non-`div` element is more semantic.
  as?: 'div' | 'section' | 'article' | 'header' | 'p' | 'li';
  className?: string;
  children: ReactNode;
}

// Element-level scroll reveal. The hidden start state is applied imperatively
// by `useGsapReveal` (never via CSS / inline style), so without JS — or before
// hydration on the prerendered page — the element renders fully visible. See
// `useGsapReveal` for the bidirectional + reduced-motion contract.
export function Reveal({delay = 0, as: Tag = 'div', className, children}: RevealProps) {
  const ref = useGsapReveal<HTMLElement>({delay});
  return (
    <Tag
      // The `as` union widens the ref to an intersection of element types that
      // no single ref can satisfy; the ref is only read by GSAP, which doesn't
      // care about the concrete element type.
      ref={ref as Ref<HTMLElement & HTMLLIElement & HTMLParagraphElement>}
      className={className}
    >
      {children}
    </Tag>
  );
}
