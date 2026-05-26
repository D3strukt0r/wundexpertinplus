import type {ReactNode} from 'react';
import classNames from 'classnames';

interface ButtonProps {
  href: string;
  variant: 'primary' | 'ghost';
  className?: string;
  children: ReactNode;
}

const BASE = classNames(
  'inline-flex items-center gap-2 py-4 px-7',
  'rounded-full no-underline border border-transparent',
  'text-sm tracking-widest font-semibold cursor-pointer',
  'transition-[background,color,border-color,transform] duration-theme ease',
);

const VARIANTS = {
  primary: 'bg-green border-green text-on-primary hover:bg-green-soft hover:border-green-soft',
  ghost: 'bg-transparent border-line text-ink hover:bg-bg-deep hover:border-ink-soft',
} as const;

// Anchor styled as a CTA button. Two visual variants, both pill-shaped.
// Primary uses the dark-mode-aware `--on-primary` token so type contrast
// holds when `--green` flips to sage on dark backgrounds.
export function Button({href, variant, className, children}: ButtonProps) {
  return (
    <a href={href} className={classNames(BASE, VARIANTS[variant], className)}>
      {children}
    </a>
  );
}
