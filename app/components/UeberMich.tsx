import {useTranslation} from 'react-i18next';
import portraitSrc from '~/assets/Sibylle-Buergi.Luetscher.klein_.jpg';
import {Card} from '~/components/ui/card';
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
    <section id="ueber-mich" className="relative overflow-hidden">
      <Container className="py-16 lg:py-24">
        <div className="grid items-start gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          {/* Portrait */}
          <Reveal>
            <SectionEyebrow>{t('about.section_number')}</SectionEyebrow>
            <Card className="mt-5 max-w-75 gap-0 overflow-hidden rounded-lg p-0 shadow-none">
              <img
                src={portraitSrc}
                alt={t('hero.portrait_alt')}
                className="aspect-[5/6] w-full object-cover object-[center_25%]"
              />
            </Card>
            <p className="mt-4 text-xs italic tracking-wide text-muted-foreground">
              {t('about.portrait_caption')}
            </p>
          </Reveal>

          {/* Bio + credentials */}
          <div className="lg:pt-9">
            <Reveal>
              <h2 className="font-serif text-5xl leading-none tracking-tight text-foreground sm:text-6xl [&_em]:italic [&_em]:text-primary">
                {t('about.name_part1')}
                <br />
                <em>{t('about.name_part2')}</em>
              </h2>
              <div className="mt-4 text-sm uppercase tracking-caps text-muted-foreground">
                {t('about.role_subtitle')}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {t('about.body')}
              </p>
            </Reveal>

            <ul className="mt-12 list-none border-t border-border p-0">
              {creds.map((cred, i) => (
                <Reveal as="li" key={cred.title} delay={i * 90}>
                  <div className="grid grid-cols-1 gap-1 border-b border-border py-6 sm:grid-cols-[12.5rem_1fr] sm:items-baseline sm:gap-8">
                    <div className="text-xs uppercase tracking-caps text-accent">
                      {cred.year ?? t('about.qualification_fallback')}
                    </div>
                    <div>
                      <div className="font-serif text-2xl leading-tight text-foreground">
                        {cred.title}
                      </div>
                      {cred.note !== undefined && cred.note !== ''
                        ? <div className="mt-1 text-sm text-muted-foreground">{cred.note}</div>
                        : null}
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
