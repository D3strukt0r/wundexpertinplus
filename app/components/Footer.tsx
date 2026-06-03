import {useTranslation} from 'react-i18next';
import {cn} from '~/lib/utils';

// Sits inside the Kontakt section's dark-green panel — the closing line of the
// page rather than a separate slab. Cream-on-green via the theme-fixed tokens
// so it reads identically in light and dark. Two copyrights: editorial content
// (Sibylle) and design/code (Manuele via the copyright-from-license vite
// plugin, so years/holder track LICENSE.txt).
export function Footer() {
  const {t} = useTranslation();
  return (
    <footer
      className={cn(
        'flex flex-col gap-3 border-t border-paper-fixed/15 pt-8 text-xs uppercase tracking-label text-paper-fixed/55',
        'sm:flex-row sm:items-center sm:justify-between',
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
