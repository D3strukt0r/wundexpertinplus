import classNames from 'classnames';
import {useEffect, useId, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router';
import PlasterPlus from '~/assets/brand/plaster-plus.svg?react';
import ArrowIcon from '~/assets/icons/arrow-up-right.svg?react';
import LinkedInIcon from '~/assets/icons/linkedin.svg?react';
import PhoneIcon from '~/assets/icons/phone.svg?react';
import {Container} from './Container';
import {ThemeToggle} from './ThemeToggle';

interface NavLink {
  href: string;
  label: string;
}

const ICON_BUTTON = classNames(
  'inline-flex items-center justify-center shrink-0 no-underline',
  'w-9 h-9 rounded-full border border-line bg-transparent text-ink',
  'transition-[background,border-color,color] duration-motion ease',
  'hover:bg-bg-deep hover:border-ink-soft',
  'focus-visible:outline-2 focus-visible:outline-green focus-visible:outline-offset-2',
);

export function Nav() {
  const {t} = useTranslation();
  const links = t('nav', {returnObjects: true}) as NavLink[];
  const tel = t('contact.tel');
  const telHref = t('contact.tel_href');
  const brand = t('brand.name');
  const subtitle = t('brand.subtitle');

  // The mobile drawer is driven by a hidden checkbox + label, not React
  // state — that makes the menu usable when JS is disabled (CSS opens via
  // `:has(input:checked)`). React still tracks `open` so we can sync the
  // checkbox programmatically (e.g. clicking a hash link), and so the
  // aria-expanded / aria-label values stay accurate.
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
    <header className="site-nav sticky top-0 z-40 bg-header backdrop-blur-md border-b border-line">
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
      <Container className="flex items-center justify-between gap-4 py-3.5 lg:py-5">
        <Link
          to="/#home"
          onClick={() => {
            setOpen(false);
          }}
          className="flex items-center gap-3 no-underline text-ink min-w-0"
        >
          <PlasterPlus
            aria-hidden="true"
            className="w-stack-lg h-stack-lg shrink-0 lg:w-7 lg:h-7"
          />
          <span className="flex flex-col leading-none min-w-0">
            <span className="font-serif text-lg lg:text-xl text-green tracking-wide whitespace-nowrap">
              {brand}
            </span>
            <span className="hidden lg:block text-micro tracking-eyebrow-wide text-ink-soft uppercase mt-1 whitespace-nowrap">
              {subtitle}
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-4 xl:gap-7">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-ink-soft no-underline text-sm tracking-eyebrow-tight uppercase font-medium whitespace-nowrap transition-colors duration-motion ease hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={t('contact.linkedin_url')}
            target="_blank"
            rel="noreferrer"
            aria-label={t('contact.linkedin_label')}
            title={t('contact.linkedin_label')}
            className={classNames(ICON_BUTTON, 'max-xl:hidden')}
          >
            <LinkedInIcon width={18} height={18} aria-hidden="true" />
          </a>
          <a
            href={telHref}
            className="bg-green text-on-primary py-2.5 px-stack rounded-full no-underline text-sm tracking-widest whitespace-nowrap inline-flex items-center gap-2 hover:bg-green-soft"
          >
            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-cta-dot" />
            {tel}
          </a>
          <ThemeToggle />
        </nav>

        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle size="sm" />
          <label
            htmlFor={drawerId}
            aria-label={open ? t('menu.close') : t('menu.open')}
            aria-expanded={open}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              // role="button" semantics: activate on Enter/Space. Native
              // labels only respond to clicks, so we forward keyboard
              // activation manually. The input's `onChange` syncs state.
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setOpen((o) => !o);
              }
            }}
            className="site-nav__burger bg-transparent border-0 p-1.5 cursor-pointer grid gap-1 justify-items-end focus-visible:outline-2 focus-visible:outline-green focus-visible:outline-offset-2 focus-visible:rounded"
          >
            <span aria-hidden="true" className="block w-stack-lg h-hairline bg-ink origin-center" />
            <span aria-hidden="true" className="block w-stack-lg h-hairline bg-ink origin-center" />
            <span aria-hidden="true" className="block w-stack-lg h-hairline bg-ink origin-center" />
          </label>
        </div>
      </Container>

      <div className="site-nav__drawer absolute top-full inset-x-0 max-h-0 overflow-hidden bg-paper transition-drawer lg:hidden">
        <Container as="nav" className="flex flex-col py-2 pb-stack">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => {
                setOpen(false);
              }}
              className="flex justify-between items-baseline py-3.5 no-underline text-ink border-b border-line font-serif text-2xl"
            >
              <span>{link.label}</span>
              <ArrowIcon
                width={14}
                height={14}
                aria-hidden="true"
                className="text-tan-deep shrink-0"
              />
            </Link>
          ))}
          <a
            href={telHref}
            onClick={() => {
              setOpen(false);
            }}
            className="mt-stack bg-green text-on-primary py-3.5 px-stack rounded-full no-underline text-sm tracking-wider font-semibold text-center inline-flex items-center justify-center gap-2.5"
          >
            <PhoneIcon width={16} height={16} aria-hidden="true" />
            {tel}
          </a>
          <a
            href={t('contact.linkedin_url')}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              setOpen(false);
            }}
            className="mt-3.5 inline-flex items-center justify-center gap-2.5 text-ink-soft text-sm tracking-wider no-underline py-1.5 px-3 transition-colors duration-motion ease hover:text-ink"
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
