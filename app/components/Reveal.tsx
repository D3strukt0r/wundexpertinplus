import type {CSSProperties, ReactNode, Ref} from 'react';
import classNames from 'classnames';
import {useReveal} from '~/hooks/useReveal';

interface RevealProps {
  // Delay before this element's transition begins (ms). Stack offsets across
  // siblings to create the staggered fade-and-rise sweep from the prototype.
  delay?: number;
  // Override the rendered tag if a non-`div` element would be more semantic.
  as?: 'div' | 'section' | 'article' | 'header' | 'p' | 'li';
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

// Element-level entrance: fades from 0→1, rises 14px→0, eased over 900ms.
// Each Reveal owns its own IntersectionObserver via useReveal so triggering
// is independent across siblings — needed for the staggered effect.
export function Reveal({delay = 0, as: Tag = 'div', className, style, children}: RevealProps) {
  const [ref, shown] = useReveal<HTMLElement>();
  return (
    <Tag
      // TS computes the union of element types in the `as` prop as an
      // intersection of refs (ref must be all element types at once),
      // which no single ref can satisfy. The ref is consumed by
      // IntersectionObserver, which doesn't care about the element type.
      ref={ref as Ref<HTMLElement & HTMLLIElement & HTMLParagraphElement>}
      className={classNames('reveal transition duration-reveal ease-soft', {'is-shown': shown}, className)}
      style={{transitionDelay: `${delay}ms`, ...style}}
    >
      {children}
    </Tag>
  );
}
