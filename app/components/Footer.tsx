import classNames from 'classnames';
import {useTranslation} from 'react-i18next';

// Sits inside the Kontakt section's dark-green panel — closing line of the
// page rather than a separate slab. Two copyrights side by side: editorial
// content (Sibylle) and design/code (Manuele via the copyright-from-license
// vite plugin, so years/holder track the LICENSE.txt).
export function Footer() {
  const {t} = useTranslation();
  return (
    <footer
      className={classNames(
        'pt-8 border-t border-paper-fixed/[0.18]',
        'flex flex-col items-center text-center gap-1.5',
        'md:flex-row md:justify-between md:items-start md:text-left md:gap-4',
        'text-paper-fixed/[0.55] text-xs md:text-xs',
        'tracking-eyebrow-tight uppercase',
      )}
    >
      <div className="flex flex-col gap-1">
        <span>{t('footer.copyright_content', {years: __COPYRIGHT_YEARS__})}</span>
        <span>{t('footer.copyright_code', {years: __COPYRIGHT_YEARS__, holder: __COPYRIGHT_HOLDER__})}</span>
      </div>
      <span>{t('footer.region')}</span>
    </footer>
  );
}
