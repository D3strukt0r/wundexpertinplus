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
          <h1 className="font-serif font-normal text-6xl mb-2 text-green">{t('not_found.title')}</h1>
          <p className="text-ink-soft m-0 mb-stack-lg">{t('not_found.message')}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 text-green text-sm no-underline border-b border-green pb-0.5"
          >
            {t('not_found.back_home')}
            <ArrowIcon width={14} height={14} aria-hidden="true" />
          </Link>
        </div>
      </main>
      <section className="bg-green-fixed text-paper-fixed py-10">
        <Container>
          <Footer />
        </Container>
      </section>
    </div>
  );
}
