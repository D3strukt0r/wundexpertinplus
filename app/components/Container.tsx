import type {ReactNode} from 'react';
import classNames from 'classnames';

interface ContainerProps {
  // Override the rendered tag when a non-`div` element would be more semantic.
  as?: 'div' | 'nav' | 'section' | 'header' | 'footer';
  className?: string;
  children: ReactNode;
}

// Centred content cap shared by the nav and every section inner.
// Wraps Tailwind's stepped `container` utility together with `mx-auto`
// and the project's gutter scale (20px mobile / 56px ≥md), so callsites
// only carry their BEM class.
export function Container({as: Tag = 'div', className, children}: ContainerProps) {
  return (
    <Tag className={classNames('container mx-auto px-5 md:px-14', className)}>
      {children}
    </Tag>
  );
}
