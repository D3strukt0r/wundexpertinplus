import {useTranslation} from 'react-i18next';
import portraitSrc from '~/assets/Sibylle-Buergi.Luetscher.klein_.jpg';
import {Container} from './Container';
import {Reveal} from './Reveal';
import {SectionEyebrow} from './SectionEyebrow';

interface Cred {
  year?: string;
  title: string;
  note?: string;
}

export function UeberMich() {
  const {t} = useTranslation();
  const creds = t('about.creds', {returnObjects: true}) as Cred[];

  return (
    <section id="ueber-mich" className="bg-bg py-14 md:py-30 relative">
      <Container className="grid grid-cols-1 gap-8 items-start md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] md:gap-6 lg:gap-22">
        <Reveal>
          <SectionEyebrow>{t('about.section_number')}</SectionEyebrow>
          <figure className="relative overflow-hidden rounded border border-line bg-paper max-w-105 m-0">
            <img
              src={portraitSrc}
              alt={t('hero.portrait_alt')}
              className="w-full h-auto aspect-[7/8] object-cover [object-position:center_25%] [filter:var(--ueber-portrait-filter)]"
            />
          </figure>
          <p className="mt-stack text-xs text-ink-soft tracking-wider italic">
            {t('about.portrait_caption')}
          </p>
        </Reveal>

        <div className="md:pt-9">
          <Reveal>
            <h2 className="font-serif font-normal text-4xl md:text-6xl m-0 mb-2 leading-none tracking-tight text-ink [&_em]:italic [&_em]:text-green">
              {t('about.name_part1')}
              <br />
              <em>{t('about.name_part2')}</em>
            </h2>
            <p className="text-sm text-ink-soft tracking-eyebrow uppercase mt-2 m-0">
              {t('about.role_subtitle')}
            </p>
          </Reveal>

          <Reveal delay={150}>
            <p className="text-base md:text-lg leading-relaxed text-ink-soft m-0 mt-stack-lg md:mt-9 max-w-140">
              {t('about.body')}
            </p>
          </Reveal>

          {/* lg+: `grid-cols-[max-content_1fr]` on the UL with subgrid on
              each LI gives a year | title row, year column auto-shrunk to
              the widest label. Below lg the column doesn't have room to
              breathe, so cred rows fall back to the mobile stacked layout
              (year label above title) for legibility. */}
          <ul className="list-none p-0 mt-7 md:mt-14 border-t border-line lg:grid lg:grid-cols-[max-content_1fr] lg:gap-x-16">
            {creds.map((cred, i) => (
              <Reveal
                as="li"
                key={cred.title}
                delay={i * 100}
                className="grid grid-cols-1 gap-y-1.5 py-stack border-b border-line lg:col-span-2 lg:grid-cols-subgrid lg:items-baseline lg:py-6"
              >
                <div className="text-xs text-tan-deep tracking-eyebrow uppercase">
                  {cred.year ?? t('about.qualification_fallback')}
                </div>
                <div>
                  <h3 className="font-serif font-normal text-xl md:text-2xl text-ink leading-tight m-0">
                    {cred.title}
                  </h3>
                  {cred.note !== undefined && cred.note !== ''
                    ? <p className="text-sm text-ink-soft mt-1 m-0">{cred.note}</p>
                    : null}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
