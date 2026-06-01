import {useEffect, useId, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router';
import PlasterPlus from '~/assets/brand/plaster-plus.svg?react';
import ArrowIcon from '~/assets/icons/arrow-up-right.svg?react';
import LinkedInIcon from '~/assets/icons/linkedin.svg?react';
import PhoneIcon from '~/assets/icons/phone.svg?react';
import {Button} from '~/components/ui/button';
import {Container} from './Container';
import {ThemeToggle} from './ThemeToggle';

interface NavLink {
  href: string;
  label: string;
}

export function Nav() {
  const {t} = useTranslation();
  const links = t('nav', {returnObjects: true}) as NavLink[];
  const tel = t('contact.tel');
  const telHref = t('contact.tel_href');
  const brand = t('brand.name');
  const subtitle = t('brand.subtitle');

  // The mobile drawer is driven by a hidden checkbox + label, not React
  // state — that makes the menu usable when JS is disabled (CSS opens via
  // `:has(input:checked)` in _nav.scss). React still tracks `open` so we can
  // sync the checkbox programmatically (e.g. clicking a hash link) and keep
  // aria-expanded / aria-label accurate.
  const drawerId = useId();
  const [open, setOpen] = useState(false);

  // Close the drawer on hash navigation (clicking a link inside it).
  useEffect(() => {
    if (!open) {
      return;
    }
    const close = () => {
      setOpen(false);
    };
    window.addEventListener('hashchange', close);
    return () => {
      window.removeEventListener('hashchange', close);
    };
  }, [open]);

  return (
    <header className="site-nav sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <input
        id={drawerId}
        className="site-nav__toggle absolute w-px h-px opacity-0 pointer-events-none"
        type="checkbox"
        aria-hidden="true"
        tabIndex={-1}
        checked={open}
        onChange={(e) => {
          setOpen(e.target.checked);
        }}
      />
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link
          to="/#home"
          onClick={() => {
            setOpen(false);
          }}
          className="flex items-center gap-3 min-w-0"
        >
          <PlasterPlus
            aria-hidden="true"
            className="h-8 w-8 shrink-0 lg:h-9 lg:w-9"
          />
          <span className="flex flex-col leading-none min-w-0">
            <span className="font-serif text-lg tracking-tight text-primary lg:text-xl whitespace-nowrap">
              {brand}
            </span>
            <span className="mt-1 hidden text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:block whitespace-nowrap">
              {subtitle}
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-[13px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-theme ease hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="hidden lg:inline-flex"
          >
            <a
              href={t('contact.linkedin_url')}
              target="_blank"
              rel="noreferrer"
              aria-label={t('contact.linkedin_label')}
              title={t('contact.linkedin_label')}
            >
              <LinkedInIcon width={18} height={18} aria-hidden="true" />
            </a>
          </Button>
          <Button asChild className="hidden md:inline-flex">
            <a href={telHref}>
              <PhoneIcon width={16} height={16} aria-hidden="true" />
              {tel}
            </a>
          </Button>
          <ThemeToggle />
          <label
            htmlFor={drawerId}
            aria-label={open ? t('menu.close') : t('menu.open')}
            aria-expanded={open}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              // role="button" semantics: activate on Enter/Space. Native
              // labels only respond to clicks, so forward keyboard activation
              // manually. The input's `onChange` syncs state.
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setOpen((o) => !o);
              }
            }}
            className="site-nav__burger inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-border text-foreground transition-colors duration-theme ease hover:bg-secondary lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid gap-[5px] justify-items-center">
              <span aria-hidden="true" className="block w-4 h-px bg-foreground origin-center" />
              <span aria-hidden="true" className="block w-4 h-px bg-foreground origin-center" />
              <span aria-hidden="true" className="block w-4 h-px bg-foreground origin-center" />
            </span>
          </label>
        </div>
      </Container>

      <div className="site-nav__drawer absolute top-full inset-x-0 max-h-0 overflow-hidden bg-card transition-drawer lg:hidden">
        <Container as="nav" className="flex flex-col py-3">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => {
                setOpen(false);
              }}
              className="flex justify-between items-center border-b border-border py-3.5 font-serif text-2xl text-foreground transition-colors duration-theme ease hover:text-primary"
            >
              <span>{link.label}</span>
              <ArrowIcon
                width={16}
                height={16}
                aria-hidden="true"
                className="text-accent shrink-0"
              />
            </Link>
          ))}
          <Button asChild size="lg" className="mt-4">
            <a
              href={telHref}
              onClick={() => {
                setOpen(false);
              }}
            >
              <PhoneIcon width={16} height={16} aria-hidden="true" />
              {tel}
            </a>
          </Button>
          <a
            href={t('contact.linkedin_url')}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              setOpen(false);
            }}
            className="mt-3.5 inline-flex items-center justify-center gap-2.5 py-1.5 px-3 text-sm tracking-wider text-muted-foreground transition-colors duration-theme ease hover:text-foreground"
          >
            <LinkedInIcon width={16} height={16} aria-hidden="true" />
            <span>{t('contact.linkedin_label')}</span>
            <ArrowIcon width={12} height={12} aria-hidden="true" />
          </a>
        </Container>
      </div>
    </header>
  );
}
