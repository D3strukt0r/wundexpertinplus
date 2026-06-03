import {cva} from 'class-variance-authority';

// Pill buttons for this marketing site. Every action is `rounded-full`.
// `cream` / `creamOutline` use the theme-fixed cream/green tokens so the CTAs
// inside the always-dark-green Kontakt section keep their identity in both
// light and dark mode — no inline hex (the prototype's `#fbf7ef` / `#243f34`
// map onto `--paper-fixed` / `--primary-fixed`).
//
// Kept in its own module (not `button.tsx`) so the component file only exports
// components — satisfies `react-refresh/only-export-components`.
export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium tracking-tight whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-secondary hover:text-secondary-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'text-foreground hover:bg-secondary hover:text-secondary-foreground',
        cream: 'bg-paper-fixed text-primary-fixed hover:bg-paper-fixed/90',
        creamOutline:
          'border border-paper-fixed/25 bg-paper-fixed/5 text-paper-fixed hover:bg-paper-fixed/10',
      },
      size: {
        default: 'h-10 px-5 text-sm',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
