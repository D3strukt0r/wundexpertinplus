import {useTranslation} from 'react-i18next';
import ConcentricRings from '~/assets/decor/concentric-rings.svg?react';
import portraitSrc from '~/assets/Sibylle-Buergi.Luetscher.klein_.jpg';
import {useReveal} from '~/hooks/useReveal';
import {Button} from './Button';
import {Container} from './Container';
import {Reveal} from './Reveal';

export function Hero() {
  const {t} = useTranslation();
  const [portraitRef, portraitShown] = useReveal<HTMLDivElement>();

  return (
    <section
      id="home"
      className="relative overflow-hidden py-8 pb-12 md:pt-22 md:pb-30"
    >
      <ConcentricRings
        aria-hidden="true"
        className="absolute -right-25 -top-15 w-60 h-60 md:-right-40 md:-top-30 md:w-140 md:h-140 opacity-50 text-tan pointer-events-none"
      />

      <Container className="grid grid-cols-1 gap-8 items-end relative md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)] md:gap-6 lg:gap-16">
        <div>
          <Reveal className="flex items-center gap-3.5 mb-7">
            <span className="block w-9 h-px bg-green" aria-hidden="true" />
            <span className="text-xs tracking-eyebrow-widest uppercase text-green font-semibold">
              {t('hero.eyebrow')}
            </span>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="font-serif font-normal text-4xl md:text-6xl lg:text-7xl leading-none tracking-tight text-ink m-0 mb-stack-lg md:mb-9 [&_em]:italic [&_em]:text-green">
              {t('hero.title_part1')}<br />
              {t('hero.title_part2')} <em>{t('hero.title_emphasis')}</em><br />
              {t('hero.title_part3')}
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="text-base md:text-lg leading-relaxed text-ink-soft m-0 max-w-135">
              {t('hero.body')}
            </p>
          </Reveal>

          <Reveal
            delay={320}
            className="flex flex-col gap-2.5 mt-7 flex-wrap md:flex-row md:gap-4 md:mt-11"
          >
            <Button
              href="#kontakt"
              variant="primary"
              className="w-full justify-center text-center py-3.5 px-stack-lg md:w-auto md:py-4 md:px-7"
            >
              {t('hero.cta_appointment')}
            </Button>
            <Button
              href="#leistungen"
              variant="ghost"
              className="w-full justify-center text-center py-3.5 px-stack-lg md:w-auto md:py-4 md:px-7"
            >
              {t('hero.cta_services')}
            </Button>
          </Reveal>
        </div>

        <div
          ref={portraitRef}
          className={`hero__portrait relative pt-2${portraitShown ? ' is-shown' : ''}`}
        >
          <span
            aria-hidden="true"
            className="hero__portrait-blob absolute -top-stack -right-stack bottom-7 left-7 bg-tan [border-radius:60%_40%_55%_45%_/_50%_60%_40%_50%]"
          />
          <figure className="relative overflow-hidden m-0 border border-line bg-paper rounded-[13.75rem_/_0.875rem] md:rounded-[17.5rem_/_1.125rem] shadow-card">
            <img
              src={portraitSrc}
              alt={t('hero.portrait_alt')}
              className="hero__portrait-img w-full h-auto aspect-square object-cover [object-position:center_22%] [filter:var(--portrait-filter)]"
            />
            <figcaption className="flex justify-between items-baseline border-t border-line py-3.5 px-stack md:py-5 md:px-6">
              <span>
                <span className="block font-serif text-lg md:text-xl text-green">
                  {t('brand.person')}
                </span>
                <span className="block text-xs text-ink-soft tracking-wider mt-0.5">
                  {t('brand.role')}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="text-xs text-tan-deep tracking-eyebrow-wide"
              >
                Nº 01
              </span>
            </figcaption>
          </figure>
        </div>
      </Container>

      <Reveal delay={400}>
        <Container className="grid grid-cols-1 items-center gap-3 mt-9 py-stack-lg border-y border-line md:grid-cols-[auto_1fr_auto] md:gap-10 md:mt-30 md:py-11">
          <span
            aria-hidden="true"
            className="hidden font-serif text-6xl text-tan leading-none -mt-4 md:block"
          >
            “
          </span>
          <p className="font-serif text-xl md:text-3xl leading-snug m-0 text-ink italic">
            {t('hero.pull')}
          </p>
          <span className="text-xs md:text-xs tracking-eyebrow-wide text-ink-soft uppercase md:[writing-mode:vertical-rl] md:rotate-180">
            {t('hero.caption_label')}
          </span>
        </Container>
      </Reveal>
    </section>
  );
}
