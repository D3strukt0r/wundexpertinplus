import classNames from 'classnames';
import {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import markerUrl from '~/assets/brand/map-marker.svg?url';
import SchematicMap from '~/assets/decor/schematic-map.svg?react';
import {useTheme} from '~/hooks/useTheme';
import {loadGoogleMaps, MAP_STYLES_DARK, MAP_STYLES_LIGHT, PRAXIS_COORDS, PRAXIS_PLACE_FTID} from '~/lib/google-maps';

// Google Maps invokes this global when the API key is invalid or the
// HTTP-Referer restriction rejects the current origin (e.g. on localhost,
// since the key is whitelisted to wundexpertinplus.com). We surface it via
// an event so MapBox can hide the broken canvas and keep the stylised
// fallback visible. Set on first MapBox mount; never torn down.
declare global {
  interface Window {
    gm_authFailure?: () => void;
  }
}

const MAP_AUTH_FAIL_EVENT = 'wundexpertinplus:map-auth-failure';

export function MapBox() {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // Initialise once. Re-apply styles on theme flip — never re-create the map.
  useEffect(() => {
    let cancelled = false;

    const onAuthFail = () => {
      if (cancelled) {
        return;
      }
      setFailed(true);
      setReady(false);
    };
    window.gm_authFailure = onAuthFail;
    window.addEventListener(MAP_AUTH_FAIL_EVENT, onAuthFail);

    void loadGoogleMaps()
      .then((maps) => {
        if (cancelled || !ref.current) {
          return;
        }
        const map = new maps.Map(ref.current, {
          center: PRAXIS_COORDS,
          zoom: 15,
          styles: theme === 'dark' ? MAP_STYLES_DARK : MAP_STYLES_LIGHT,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'cooperative',
          clickableIcons: false,
          keyboardShortcuts: false,
        });
        // eslint-disable-next-line no-new -- Marker registers itself with the map via constructor side-effect; no handle to retain.
        new google.maps.Marker({
          position: PRAXIS_COORDS,
          map,
          title: t('kontakt.praxis.map_pin_label'),
          icon: {
            url: markerUrl,
            scaledSize: new google.maps.Size(40, 52),
            anchor: new google.maps.Point(20, 50),
          },
        });

        // Brand place-card overlay, top-left of the live map. Click opens
        // the location in Google Maps via the official Maps URL schema
        // (coords-only so it works without a Place ID). Children built
        // with `textContent` rather than innerHTML so translation strings
        // are never interpreted as HTML.
        const card = document.createElement('a');
        card.className = 'map-place-card';
        // `ftid=` opens Google Maps on the actual business listing (not just
        // a coordinate pin). No Places API enablement needed — the FID is
        // recognised directly by Google Maps URLs.
        card.href = `https://www.google.com/maps/place/?ftid=${PRAXIS_PLACE_FTID}`;
        card.target = '_blank';
        card.rel = 'noreferrer';
        card.setAttribute('aria-label', `${t('brand.name')} — ${t('kontakt.praxis.map_card_link')}`);

        const cardName = document.createElement('span');
        cardName.className = 'map-place-card__name';
        cardName.textContent = t('brand.name');

        const cardAddr = document.createElement('span');
        cardAddr.className = 'map-place-card__addr';
        cardAddr.textContent = t('kontakt.praxis.map_label');

        const cardLink = document.createElement('span');
        cardLink.className = 'map-place-card__link';
        cardLink.textContent = `${t('kontakt.praxis.map_card_link')} ↗`;

        card.append(cardName, cardAddr, cardLink);
        // `map.controls` is typed as a sparse array; the position slot always
        // exists at runtime, but TypeScript can't prove it.
        map.controls[google.maps.ControlPosition.TOP_LEFT]!.push(card);

        mapRef.current = map;
        setReady(true);
      })
      .catch(() => {
        // Loader couldn't fetch the JS at all (network, CSP, …) — leave the
        // fallback placeholder visible.
        if (!cancelled) {
          setFailed(true);
        }
      });
    return () => {
      cancelled = true;
      window.removeEventListener(MAP_AUTH_FAIL_EVENT, onAuthFail);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- theme handled by separate effect below
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    mapRef.current.setOptions({styles: theme === 'dark' ? MAP_STYLES_DARK : MAP_STYLES_LIGHT});
  }, [theme]);

  // Show the stylised placeholder both before the map resolves AND when the
  // API auth fails (localhost / restricted-key origins). The placeholder is
  // visually on-brand and keeps the address card from collapsing.
  const showFallback = !ready || failed;

  return (
    <div className="relative h-50 md:h-60 border-b border-line overflow-hidden bg-map">
      {showFallback
        ? (
            <div className="absolute inset-0 bg-bg text-ink pointer-events-none" aria-hidden="true">
              <SchematicMap className="block w-full h-full" preserveAspectRatio="none" />
              <span className="absolute left-5 bottom-3.5 text-xs text-ink-soft tracking-eyebrow uppercase">
                {t('kontakt.praxis.map_label')}
              </span>
            </div>
          )
        : null}
      <div
        ref={ref}
        className={classNames('absolute inset-0 transition-opacity duration-500 ease', {
          'opacity-100': ready && !failed,
          'opacity-0': !ready || failed,
          'invisible pointer-events-none': failed,
        })}
        role="application"
        aria-label={t('kontakt.praxis.map_aria_label')}
        aria-hidden={failed}
      />
    </div>
  );
}
