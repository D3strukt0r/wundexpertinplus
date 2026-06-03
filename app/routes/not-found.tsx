import {useTranslation} from 'react-i18next';
import {Link} from 'react-router';
import ArrowIcon from '~/assets/icons/arrow-up-right.svg?react';
import {Container} from '~/components/Container';
import {Footer} from '~/components/Footer';
import {Nav} from '~/components/Nav';

export default function NotFound() {
  const {t} = useTranslation();
  return (
    <div className="flex flex-col min-h-dvh">
      <Nav />
      <main className="flex-1 grid place-items-center p-8 text-center">
        <div>
          <h1 className="font-serif text-6xl mb-2 text-primary">{t('not_found.title')}</h1>
          <p className="text-muted-foreground m-0 mb-6">{t('not_found.message')}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 border-b border-primary pb-0.5 text-sm text-primary transition-colors duration-theme ease hover:border-transparent"
          >
            {t('not_found.back_home')}
            <ArrowIcon width={16} height={16} aria-hidden="true" />
          </Link>
        </div>
      </main>
      <section className="bg-primary-fixed text-paper-fixed py-10">
        <Container>
          <Footer />
        </Container>
      </section>
    </div>
  );
}
