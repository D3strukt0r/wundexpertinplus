import type {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import ConcentricRings from '~/assets/decor/concentric-rings.svg?react';
import ArrowIcon from '~/assets/icons/arrow-up-right.svg?react';
import LinkedInIcon from '~/assets/icons/linkedin.svg?react';
import MailIcon from '~/assets/icons/mail.svg?react';
import PhoneIcon from '~/assets/icons/phone.svg?react';
import {cn} from '~/lib/utils';
import {Container} from './Container';
import {Footer} from './Footer';
import {MapBox} from './MapBox';
import {Reveal} from './Reveal';

interface TileProps {
  href: string;
  external?: boolean;
  icon: ReactNode;
  label: string;
  value: string;
  emailLike?: boolean;
}

// One contact method (phone / email / LinkedIn). Frosted-cream pill against
// the always-dark-green Kontakt panel; the icon sits in a tan-fixed circle so
// the pairs read at a glance. All tokens are theme-fixed (cream / tan / green
// stay identical in both modes).
function Tile({href, external, icon, label, value, emailLike}: TileProps) {
  return (
    <a
      href={href}
      {...(external === true ? {target: '_blank', rel: 'noreferrer'} : {})}
      className={cn(
        'flex items-center gap-4 rounded-lg border border-paper-fixed/15 bg-paper-fixed/[0.06] px-6 py-5',
        'transition-colors duration-theme ease hover:bg-paper-fixed/[0.12]',
      )}
    >
      <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent-fixed text-primary-fixed">
        {icon}
      </span>
      <span className={emailLike === true ? 'min-w-0' : undefined}>
        <span className="block text-[11px] tracking-[0.22em] text-accent-fixed">{label}</span>
        <span
          className={cn(
            'mt-0.5 block font-serif text-lg sm:text-xl',
            // All three tiles share one size. Email addresses contain no spaces,
            // so allow mid-word breaking to wrap inside the tile instead of
            // overflowing.
            emailLike === true ? 'break-all' : undefined,
          )}
        >
          {value}
        </span>
      </span>
    </a>
  );
}

export function Kontakt() {
  const {t} = useTranslation();
  const tel = t('contact.tel');
  const telHref = t('contact.tel_href');
  const email = t('contact.email');
  const perks = t('kontakt.perks', {returnObjects: true}) as string[];
  const address = t('kontakt.praxis.address', {returnObjects: true}) as string[];

  return (
    <section
      id="kontakt"
      className="relative overflow-hidden bg-primary-fixed text-paper-fixed"
    >
      <ConcentricRings
        aria-hidden="true"
        className="pointer-events-none absolute -left-56 -bottom-60 h-[44rem] w-[44rem] text-accent-fixed/15"
      />

      <Container className="relative py-16 lg:py-24">
        <Reveal>
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent-fixed">
            {t('kontakt.section_number')}
          </div>
          <h2 className="mt-5 max-w-3xl font-serif text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl [&_em]:italic [&_em]:text-accent-fixed">
            {t('kontakt.title_part1')}{' '}
            <em>{t('kontakt.title_emphasis')}</em> {t('kontakt.title_part2')}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-16">
          {/* Contact methods + perks */}
          <Reveal delay={100}>
            <p className="max-w-md text-lg leading-relaxed text-paper-fixed/75">
              {t('kontakt.intro')}
            </p>

            <div className="mt-9 flex flex-col gap-3.5">
              <Tile
                href={telHref}
                icon={<PhoneIcon width={18} height={18} aria-hidden="true" />}
                label={t('kontakt.tel_label')}
                value={tel}
              />
              <Tile
                href={`mailto:${email}`}
                icon={<MailIcon width={18} height={18} aria-hidden="true" />}
                label={t('kontakt.email_label')}
                value={email}
                emailLike
              />
              <Tile
                href={t('contact.linkedin_url')}
                external
                icon={<LinkedInIcon width={18} height={18} aria-hidden="true" />}
                label={t('kontakt.linkedin_tile_label')}
                value={t('kontakt.linkedin_tile_value')}
              />
            </div>

            <ul className="mt-7 flex list-none flex-wrap gap-2 p-0">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="inline-flex items-center gap-2 rounded-full border border-paper-fixed/20 bg-paper-fixed/[0.08] px-3.5 py-2 text-xs tracking-wide text-paper-fixed"
                >
                  {perk}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Praxis card with map */}
          <Reveal delay={200}>
            <article className="overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
              <MapBox />
              <div className="p-8">
                <div className="text-[11px] uppercase tracking-[0.22em] text-primary">
                  {t('kontakt.praxis.eyebrow')}
                </div>
                <h3 className="mt-2.5 font-serif text-2xl leading-snug text-foreground">
                  {t('kontakt.praxis.partner')}
                </h3>
                <p className="mt-1 text-sm italic text-muted-foreground">
                  {t('kontakt.praxis.sub')}
                </p>
                <address className="mt-6 text-base not-italic leading-relaxed text-foreground [&_div]:block">
                  {address.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </address>
                <a
                  href={t('kontakt.praxis.url')}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 border-b border-primary pb-0.5 text-sm text-primary transition-colors duration-theme ease hover:border-transparent"
                >
                  {t('kontakt.praxis.url_label')}
                  <ArrowIcon width={16} height={16} aria-hidden="true" />
                </a>
              </div>
            </article>
          </Reveal>
        </div>

        <div className="mt-16 lg:mt-24">
          <Footer />
        </div>
      </Container>
    </section>
  );
}
