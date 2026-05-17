// `@googlemaps/js-api-loader` is a CommonJS module. Statically importing its
// named `Loader` export trips Vite's SSR module runner (the named-export
// detection on CJS only sees `module.exports`, not the bound name). Loading
// Google Maps is client-only anyway, so resolve the package lazily inside
// `loadGoogleMaps()` and pull `Loader` off the default export.

// Origin-restricted public key — Google enforces HTTP-Referer whitelisting on
// it, so shipping in the client bundle is safe. Still sourced from env to
// keep rotation/staging-vs-prod swaps out of source diffs.
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

interface LoaderLike {
  importLibrary: (name: 'maps') => Promise<google.maps.MapsLibrary>;
}

let loader: LoaderLike | null = null;

export async function loadGoogleMaps(): Promise<google.maps.MapsLibrary> {
  if (typeof window === 'undefined') {
    throw new TypeError('loadGoogleMaps must be called in a browser environment');
  }
  if (API_KEY === undefined || API_KEY === '') {
    // No key wired up — let MapBox catch this and keep the stylised fallback.
    throw new Error('VITE_GOOGLE_MAPS_API_KEY is not set');
  }
  if (!loader) {
    const mod = await import('@googlemaps/js-api-loader');
    // Different bundling realities surface `Loader` as either a named export
    // or a property on the default export; cover both.
    const LoaderCtor = (mod.Loader ?? (mod as unknown as {default: {Loader: typeof mod.Loader}}).default.Loader);
    loader = new LoaderCtor({apiKey: API_KEY, version: 'weekly', libraries: ['maps', 'marker']});
  }
  return loader.importLibrary('maps');
}

// Editorial-warm style: cream / tan / forest-green, simplified labels, no
// POI clutter, soft hierarchy on roads. Hand-tuned to match the page palette
// (bg #f4efe6, green #2d4a3e, tan #c7b8a1).
export const MAP_STYLES_LIGHT: google.maps.MapTypeStyle[] = [
  {elementType: 'geometry', stylers: [{color: '#f4efe6'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#3d4a42'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#fbf7ef'}, {weight: 2}]},
  {featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{color: '#2d4a3e'}]},
  {featureType: 'administrative.neighborhood', elementType: 'labels.text.fill', stylers: [{color: '#3d4a42'}]},
  {featureType: 'landscape', elementType: 'geometry', stylers: [{color: '#ebe2d2'}]},
  {featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{color: '#e3d8c2'}]},
  {featureType: 'poi', stylers: [{visibility: 'off'}]},
  {featureType: 'poi.park', elementType: 'geometry', stylers: [{visibility: 'on'}, {color: '#d8d8b5'}]},
  {featureType: 'road', elementType: 'geometry', stylers: [{color: '#fbf7ef'}]},
  {featureType: 'road.highway', elementType: 'geometry', stylers: [{color: '#c7b8a1'}]},
  {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{color: '#a89378'}]},
  {featureType: 'road', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
  {featureType: 'transit', stylers: [{visibility: 'simplified'}, {color: '#a89378'}]},
  {featureType: 'water', elementType: 'geometry', stylers: [{color: '#cfd9c8'}]},
];

// Dark sibling — muted forest tones from the dark-mode token set (bg #14201b,
// paper #1e2c25, ink #ece5d6, green #a8c4b4).
export const MAP_STYLES_DARK: google.maps.MapTypeStyle[] = [
  {elementType: 'geometry', stylers: [{color: '#1a2520'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#b3ad9e'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#14201b'}, {weight: 2}]},
  {featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{color: '#a8c4b4'}]},
  {featureType: 'administrative.neighborhood', elementType: 'labels.text.fill', stylers: [{color: '#b3ad9e'}]},
  {featureType: 'landscape', elementType: 'geometry', stylers: [{color: '#1e2c25'}]},
  {featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{color: '#243329'}]},
  {featureType: 'poi', stylers: [{visibility: 'off'}]},
  {featureType: 'poi.park', elementType: 'geometry', stylers: [{visibility: 'on'}, {color: '#1d2b22'}]},
  {featureType: 'road', elementType: 'geometry', stylers: [{color: '#2a3a31'}]},
  {featureType: 'road.highway', elementType: 'geometry', stylers: [{color: '#3a4f43'}]},
  {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{color: '#536b5c'}]},
  {featureType: 'road', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
  {featureType: 'transit', stylers: [{visibility: 'simplified'}, {color: '#536b5c'}]},
  {featureType: 'water', elementType: 'geometry', stylers: [{color: '#0f1814'}]},
];

// Bahnhofplatz 12, 4410 Liestal — coordinates supplied by the user (the
// building next to the Liestal train station).
export const PRAXIS_COORDS = {lat: 47.484891, lng: 7.7313594};

// Feature ID (FID) of the Sibylle Wyttenbach Google Maps listing, extracted
// from the canonical place URL. Used to build a deep link that lands on the
// business page (opening hours, photos, reviews) rather than just a
// coordinate pin. Does NOT require the Places API to be enabled — Google
// Maps' URL schema accepts the FID directly via `ftid=`.
export const PRAXIS_PLACE_FTID = '0x4791ca6af6155555:0x272263e872a0c162';
