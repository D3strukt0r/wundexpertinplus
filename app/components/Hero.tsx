import {useTranslation} from 'react-i18next';
import ConcentricRings from '~/assets/decor/concentric-rings.svg?react';
import portraitSrc from '~/assets/Sibylle-Buergi.Luetscher.klein_.jpg';
import {Button} from '~/components/ui/button';
import {Container} from './Container';
import {Reveal} from './Reveal';

export function Hero() {
  const {t} = useTranslation();

  return (
    <section id="home" className="relative overflow-hidden">
      {/* Decorative concentric arcs, top-right. */}
      <ConcentricRings
        aria-hidden="true"
        className="pointer-events-none absolute -right-25 -top-15 h-60 w-60 text-accent/45 md:-right-40 md:-top-28 md:h-136 md:w-136"
      />

      <Container className="relative py-16 lg:py-24">
        <div className="grid items-end gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-xs font-medium tracking-wide text-muted-foreground">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t('hero.eyebrow')}
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-7 font-serif text-display tracking-tight text-foreground sm:text-6xl lg:text-7xl [&_em]:italic [&_em]:text-primary">
                {t('hero.title_part1')}{' '}
                {t('hero.title_part2')} <em>{t('hero.title_emphasis')}</em>{' '}
                {t('hero.title_part3')}
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t('hero.body')}
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a href="#kontakt">{t('hero.cta_appointment')}</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <a href="#leistungen">{t('hero.cta_services')}</a>
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Portrait — arch frame + tan blob behind it. */}
          <Reveal delay={150}>
            <div className="relative mx-auto w-full max-w-75 lg:mx-0 lg:ml-auto">
              <span
                aria-hidden="true"
                className="absolute -inset-4 -z-10 -rotate-4 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] bg-accent/50"
              />
              <figure className="relative m-0 overflow-hidden rounded-[17.5rem/1.125rem] border border-border bg-card shadow-card">
                <img
                  src={portraitSrc}
                  alt={t('hero.portrait_alt')}
                  className="aspect-[5/6] w-full object-cover object-[center_22%]"
                />
                <figcaption className="flex items-baseline justify-between border-t border-border px-7 py-5">
                  <span>
                    <span className="block font-serif text-xl text-primary">
                      {t('brand.person')}
                    </span>
                    <span className="mt-0.5 block text-xs tracking-wide text-muted-foreground">
                      {t('brand.role')}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-xs tracking-eyebrow text-accent">
                    Nº 01
                  </span>
                </figcaption>
              </figure>
            </div>
          </Reveal>
        </div>

        {/* Pull quote */}
        <Reveal delay={120}>
          <div className="mt-16 grid grid-cols-[auto_1fr] items-center gap-6 border-y border-border py-10 lg:mt-24 lg:grid-cols-[auto_1fr_auto] lg:gap-10">
            <span aria-hidden="true" className="-mt-6 font-serif text-6xl leading-none text-accent">
              “
            </span>
            <p className="font-serif text-2xl italic leading-snug text-foreground sm:text-3xl">
              {t('hero.pull')}
            </p>
            <span className="hidden text-xs uppercase tracking-quote text-muted-foreground lg:block lg:[writing-mode:vertical-rl] lg:rotate-180">
              {t('hero.caption_label')}
            </span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
