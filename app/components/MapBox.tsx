import {APIProvider, ControlPosition, Map, MapControl, Marker, useMapsLibrary} from '@vis.gl/react-google-maps';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import markerUrl from '~/assets/brand/map-marker.svg?url';
import SchematicMap from '~/assets/decor/schematic-map.svg?react';
import {useTheme} from '~/hooks/useTheme';
import {GOOGLE_MAPS_API_KEY, MAP_STYLES_DARK, MAP_STYLES_LIGHT, PRAXIS_COORDS, PRAXIS_PLACE_FTID} from '~/lib/google-maps';
import {cn} from '~/lib/utils';

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
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const onAuthFail = () => {
      setFailed(true);
      setReady(false);
    };
    window.gm_authFailure = onAuthFail;
    window.addEventListener(MAP_AUTH_FAIL_EVENT, onAuthFail);
    return () => {
      window.removeEventListener(MAP_AUTH_FAIL_EVENT, onAuthFail);
    };
  }, []);

  // Show the stylised placeholder both before the map resolves AND when the
  // API auth fails (localhost / restricted-key origins). The placeholder is
  // visually on-brand and keeps the address card from collapsing.
  const showFallback = !ready || failed;
  const hasKey = GOOGLE_MAPS_API_KEY !== undefined && GOOGLE_MAPS_API_KEY !== '';

  return (
    <div className="relative h-56 w-full overflow-hidden border-b border-border bg-map-bg-fixed">
      {showFallback
        ? (
            <div className="absolute inset-0 pointer-events-none text-paper-fixed" aria-hidden="true">
              <SchematicMap className="block w-full h-full" preserveAspectRatio="none" />
              <span className="absolute left-5 bottom-3.5 text-[10px] uppercase tracking-[0.18em] text-paper-fixed/55">
                {t('kontakt.praxis.map_label')}
              </span>
            </div>
          )
        : null}
      {hasKey
        ? (
            <div
              className={cn('absolute inset-0 transition-opacity duration-theme ease', {
                'opacity-100': ready && !failed,
                'opacity-0': !ready || failed,
                'invisible pointer-events-none': failed,
              })}
              role="application"
              aria-label={t('kontakt.praxis.map_aria_label')}
              aria-hidden={failed}
            >
              <APIProvider apiKey={GOOGLE_MAPS_API_KEY!} libraries={['marker']} onError={() => setFailed(true)}>
                <Map
                  defaultCenter={PRAXIS_COORDS}
                  defaultZoom={15}
                  styles={theme === 'dark' ? MAP_STYLES_DARK : MAP_STYLES_LIGHT}
                  disableDefaultUI
                  zoomControl
                  gestureHandling="cooperative"
                  clickableIcons={false}
                  keyboardShortcuts={false}
                  onTilesLoaded={() => setReady(true)}
                  className="w-full h-full"
                >
                  <PraxisMarker title={t('kontakt.praxis.map_pin_label')} />
                  <MapControl position={ControlPosition.TOP_LEFT}>
                    <a
                      className="map-place-card"
                      href={`https://www.google.com/maps/place/?ftid=${PRAXIS_PLACE_FTID}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${t('brand.name')} — ${t('kontakt.praxis.map_card_link')}`}
                    >
                      <span className="map-place-card__name">{t('brand.name')}</span>
                      <span className="map-place-card__addr">{t('kontakt.praxis.map_label')}</span>
                      <span className="map-place-card__link">
                        {t('kontakt.praxis.map_card_link')}
                        {' '}
                        ↗
                      </span>
                    </a>
                  </MapControl>
                </Map>
              </APIProvider>
            </div>
          )
        : null}
    </div>
  );
}

// Marker icon needs `google.maps.Size` / `Point` constructors, which live in
// the core library and only exist after the Maps JS loads.
// `useMapsLibrary('core')` returns the namespace once available; render the
// marker on the next tick.
function PraxisMarker({title}: {title: string}) {
  const core = useMapsLibrary('core');
  if (!core) {
    return null;
  }
  return (
    <Marker
      position={PRAXIS_COORDS}
      title={title}
      icon={{
        url: markerUrl,
        scaledSize: new core.Size(40, 52),
        anchor: new core.Point(20, 50),
      }}
    />
  );
}
