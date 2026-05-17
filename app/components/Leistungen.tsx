import classNames from 'classnames';
import {useTranslation} from 'react-i18next';
import PlusCircleIcon from '~/assets/icons/plus-circle.svg?react';
import {Container} from './Container';
import {Reveal} from './Reveal';
import {SectionEyebrow} from './SectionEyebrow';
import {SectionTitle} from './SectionTitle';

interface Item {
  title: string;
  detail: string;
}

interface LeistungenItemProps {
  index: number;
  title: string;
  detail: string;
}

// One cell of the 5-column desktop grid (1-column on mobile).
// Mobile: number | (title + detail) baseline grid.
// Desktop: vertical flex with detail pinned to the bottom for shared baseline
// across all five cells, even when only one title wraps to a second line.
function LeistungenItem({index, title, detail}: LeistungenItemProps) {
  return (
    <li
      className={classNames(
        'relative flex-1 border-b border-line',
        // Mobile layout: 2-col grid (number | text).
        'grid grid-cols-[2rem_1fr] items-baseline gap-3.5 py-5',
        // Desktop: vertical flex column with padding + right divider.
        // `divide-x` on the parent handles inter-cell vertical lines.
        'md:flex md:flex-col md:items-stretch md:gap-0 md:p-8 md:pb-9 md:pl-5 md:pr-5',
      )}
    >
      <div className="text-xs text-tan-deep tracking-eyebrow m-0 md:mb-6">
        {`0${index + 1}`}
      </div>
      <h3 className="font-serif font-normal text-xl md:text-2xl leading-tight text-green m-0 md:mb-3 md:min-h-[2lh] [overflow-wrap:break-word] [hyphens:auto]">
        {title}
      </h3>
      <p className="col-start-2 md:col-start-auto text-sm text-ink-soft leading-normal m-0 mt-1 md:mt-auto">
        {detail}
      </p>
    </li>
  );
}

export function Leistungen() {
  const {t} = useTranslation();
  const items = t('leistungen.items', {returnObjects: true}) as Item[];

  return (
    <section id="leistungen" className="bg-paper py-14 md:py-30 border-t border-line">
      <Container>
        <div className="grid grid-cols-1 gap-5 mb-8 md:grid-cols-[1fr_1.5fr] md:gap-20 md:mb-20">
          <Reveal>
            <SectionEyebrow>{t('leistungen.section_number')}</SectionEyebrow>
            <SectionTitle>
              {t('leistungen.title_part1')}<br />
              <em>{t('leistungen.title_emphasis')}</em> {t('leistungen.title_part2')}
            </SectionTitle>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-base md:text-lg leading-relaxed text-ink-soft m-0 mt-3 max-w-135">
              {t('leistungen.intro')}
            </p>
          </Reveal>
        </div>

        <ul
          className={classNames(
            'grid grid-cols-1 list-none p-0 m-0 border-t border-line',
            // 5-col desktop grid with minmax(0,…) so long German words wrap
            // instead of overflowing.
            'md:[grid-template-columns:repeat(5,minmax(0,1fr))] md:divide-x md:divide-line',
            // Reveal wrapper (<article>) must be a flex column so its child
            // <li> can flex: 1 and stretch to the row height — keeps the
            // bottom borders on a single baseline even when one title wraps.
            '[&>*]:flex [&>*]:flex-col',
          )}
        >
          {items.map((item, i) => (
            <Reveal as="article" key={item.title} delay={i * 80}>
              <LeistungenItem index={i} title={item.title} detail={item.detail} />
            </Reveal>
          ))}
        </ul>

        <Reveal delay={200}>
          <aside className="grid grid-cols-1 items-center gap-3 mt-7 py-5 px-stack-lg bg-bg rounded-md border border-line md:grid-cols-[auto_1fr] md:gap-8 md:mt-16 md:py-8 px-10">
            <PlusCircleIcon
              width={44}
              height={44}
              aria-hidden="true"
              className="text-green shrink-0"
            />
            <p className="m-0 text-sm md:text-base text-ink-soft leading-relaxed max-w-220 [&_strong]:text-ink [&_strong]:font-semibold">
              <strong>{t('leistungen.insurance_label')}</strong> {t('leistungen.insurance_note')}
            </p>
          </aside>
        </Reveal>
      </Container>
    </section>
  );
}
