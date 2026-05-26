import type {ReactNode} from 'react';
import classNames from 'classnames';
import {useTranslation} from 'react-i18next';
import ConcentricRings from '~/assets/decor/concentric-rings.svg?react';
import ArrowIcon from '~/assets/icons/arrow-up-right.svg?react';
import LinkedInIcon from '~/assets/icons/linkedin.svg?react';
import MailIcon from '~/assets/icons/mail.svg?react';
import PhoneIcon from '~/assets/icons/phone.svg?react';
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

// One contact card (phone / email / LinkedIn). Frosted-white pill against
// the always-green Kontakt panel. Icon sits in a tan-fixed circle so the
// pairs read at a glance.
function Tile({href, external, icon, label, value, emailLike}: TileProps) {
  return (
    <a
      href={href}
      {...(external === true ? {target: '_blank', rel: 'noreferrer'} : {})}
      className={classNames(
        'flex items-center gap-3.5 py-stack px-5 md:gap-stack md:py-stack-lg md:px-7',
        'bg-paper-fixed/[0.06] border border-paper-fixed/[0.18] rounded-md text-paper-fixed no-underline',
        'transition-[background,border-color] duration-theme ease',
        'hover:bg-paper-fixed/[0.1] hover:border-paper-fixed/[0.3]',
      )}
    >
      <span className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-tan-fixed text-green-fixed grid place-items-center shrink-0">
        {icon}
      </span>
      <span className={emailLike === true ? 'min-w-0 overflow-hidden' : undefined}>
        <span className="block text-xs tracking-eyebrow-wide text-tan-fixed">
          {label}
        </span>
        <span
          className={classNames(
            'block font-serif mt-0.5 text-xl md:text-2xl',
            // Email addresses contain no spaces; allow mid-word breaking
            // so the line wraps inside the tile instead of overflowing.
            {'break-all': emailLike === true},
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
      className="relative overflow-hidden bg-green-fixed text-paper-fixed py-15 pb-10 md:py-30 md:pb-15"
    >
      <ConcentricRings
        aria-hidden="true"
        className="absolute -left-60 -bottom-65 w-175 h-175 opacity-10 text-tan-fixed pointer-events-none"
      />

      <Container className="relative">
        <Reveal>
          <div className="text-xs tracking-eyebrow-widest uppercase text-tan-fixed font-semibold mb-stack-lg">
            {t('kontakt.section_number')}
          </div>
          <h2 className="font-serif font-normal text-4xl md:text-7xl m-0 leading-none tracking-tight max-w-225 text-paper-fixed [&_em]:italic [&_em]:text-tan-fixed">
            {t('kontakt.title_part1')}<br />
            <em>{t('kontakt.title_emphasis')}</em> {t('kontakt.title_part2')}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-7 mt-8 lg:grid-cols-2 lg:gap-16 md:mt-20">
          <Reveal delay={100}>
            <p className="text-lg leading-relaxed text-paper-fixed/[0.78] m-0 mb-10 max-w-115">
              {t('kontakt.intro')}
            </p>

            <div className="flex flex-col gap-stack">
              <Tile
                href={telHref}
                icon={<PhoneIcon width={18} height={18} aria-hidden="true" />}
                label={t('kontakt.tel_label')}
                value={tel}
              />
              <Tile
                href={`mailto:${email}`}
                icon={<MailIcon width={16} height={16} aria-hidden="true" />}
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

            <ul className="list-none p-0 mt-7 pt-6 border-t border-paper-fixed/[0.18] flex flex-wrap gap-2">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="text-xs tracking-wider py-2 px-3.5 bg-paper-fixed/[0.08] text-paper-fixed rounded-full border border-paper-fixed/[0.22]"
                >
                  {perk}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={200}>
            <article className="bg-paper text-ink rounded-md overflow-hidden">
              <MapBox />
              <div className="p-stack-lg pb-6 md:pt-8 px-9 pb-10">
                <div className="text-xs tracking-eyebrow-wide uppercase text-green font-semibold mb-2.5">
                  {t('kontakt.praxis.eyebrow')}
                </div>
                <h3 className="font-serif font-normal text-xl md:text-2xl leading-tight m-0">
                  {t('kontakt.praxis.partner')}
                </h3>
                <p className="text-sm text-ink-soft m-0 mt-1 italic">
                  {t('kontakt.praxis.sub')}
                </p>
                <address className="mt-7 text-sm md:text-base leading-relaxed not-italic [&_div]:block">
                  {address.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </address>
                <a
                  href={t('kontakt.praxis.url')}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 mt-stack text-green text-sm no-underline border-b border-green pb-0.5"
                >
                  {t('kontakt.praxis.url_label')}
                  <ArrowIcon width={14} height={14} aria-hidden="true" />
                </a>
              </div>
            </article>
          </Reveal>
        </div>

        <div className="mt-20">
          <Footer />
        </div>
      </Container>
    </section>
  );
}
