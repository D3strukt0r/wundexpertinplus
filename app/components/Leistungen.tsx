import {useTranslation} from 'react-i18next';
import PlusCircleIcon from '~/assets/icons/plus-circle.svg?react';
import {Card} from '~/components/ui/card';
import {cn} from '~/lib/utils';
import {Container} from './Container';
import {Reveal} from './Reveal';
import {SectionEyebrow} from './SectionEyebrow';
import {SectionTitle} from './SectionTitle';

interface Item {
  title: string;
  detail: string;
}

export function Leistungen() {
  const {t} = useTranslation();
  const items = t('leistungen.items', {returnObjects: true}) as Item[];

  return (
    <section id="leistungen" className="border-t border-border bg-card">
      <Container className="py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <Reveal>
            <SectionEyebrow>{t('leistungen.section_number')}</SectionEyebrow>
            <SectionTitle>
              {t('leistungen.title_part1')}{' '}
              <em>{t('leistungen.title_emphasis')}</em> {t('leistungen.title_part2')}
            </SectionTitle>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-lg leading-relaxed text-muted-foreground lg:mt-3">
              {t('leistungen.intro')}
            </p>
          </Reveal>
        </div>

        {/* Service list — line-separated numbered columns; snaps 1 → 2 → 5. */}
        <ul className="mt-12 grid list-none grid-cols-1 border-t border-border p-0 sm:grid-cols-2 lg:mt-16 lg:grid-cols-5">
          {items.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 70}
              className={cn(
                'border-b border-border px-1 py-8 sm:px-6 lg:px-5',
                'sm:[&:nth-child(odd)]:border-r lg:border-r',
                i === items.length - 1 && 'lg:border-r-0',
              )}
            >
              <div className="text-[11px] tracking-[0.2em] text-accent">{`0${i + 1}`}</div>
              <h3 className="mt-6 font-serif text-2xl leading-tight text-primary">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120}>
          <Card className="mt-12 flex flex-row items-start gap-5 rounded-lg border-border bg-secondary/40 p-7 shadow-none sm:items-center sm:gap-7">
            <PlusCircleIcon
              width={44}
              height={44}
              aria-hidden="true"
              className="h-11 w-11 flex-shrink-0 text-primary"
            />
            <p className="text-[15px] leading-relaxed text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground">
              <strong>{t('leistungen.insurance_label')}</strong> {t('leistungen.insurance_note')}
            </p>
          </Card>
        </Reveal>
      </Container>
    </section>
  );
}
