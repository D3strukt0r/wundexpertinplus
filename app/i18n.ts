import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';
import de from './locales/de.yml';

if (!i18n.isInitialized) {
  void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {de: {translation: de}},
      fallbackLng: 'de',
      supportedLngs: ['de'],
      interpolation: {escapeValue: false},
      detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: 'wundexpertinplus:lang',
        caches: ['localStorage'],
      },
      returnObjects: true,
    });
}

// Hot-reload translations on YAML edit. Vite re-imports de.yml when it
// changes but the init guard above skips re-init, so resource bundles
// would stay stale otherwise. addResourceBundle merges + overwrites,
// changeLanguage forces react-i18next subscribers to re-render.
if (import.meta.hot) {
  import.meta.hot.accept('./locales/de.yml', (newModule) => {
    if (newModule) {
      i18n.addResourceBundle('de', 'translation', newModule.default, true, true);
      void i18n.changeLanguage(i18n.language);
    }
  });
}

export {i18n};
