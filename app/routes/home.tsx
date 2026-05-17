import type {Route} from './+types/home';
import {Hero} from '~/components/Hero';
import {Kontakt} from '~/components/Kontakt';
import {Leistungen} from '~/components/Leistungen';
import {Nav} from '~/components/Nav';
import {ScrollToTop} from '~/components/ScrollToTop';
import {UeberMich} from '~/components/UeberMich';
import {i18n} from '~/i18n';

export function meta(_: Route.MetaArgs) {
  return [
    {title: i18n.t('meta.page_title')},
    {name: 'description', content: i18n.t('meta.page_description')},
  ];
}

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Leistungen />
        <UeberMich />
        <Kontakt />
      </main>
      <ScrollToTop />
    </>
  );
}
