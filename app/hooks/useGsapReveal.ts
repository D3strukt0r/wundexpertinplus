import type {RefObject} from 'react';
import {useGSAP} from '@gsap/react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useRef} from 'react';

// GSAP-driven scroll reveal, bidirectional and visible-by-default.
//
// Design contract (redesign plan, Part A6):
//   - The hidden start state (opacity:0 / y-offset) is set IMPERATIVELY via
//     `gsap.fromTo` inside the effect — NEVER baked into CSS or an inline
//     `style`. The effect only runs with JS available, so a JS-disabled
//     visitor (or the prerendered SSR / SPA page before hydration) sees every
//     `<Reveal>` element at its natural, fully-visible resting state.
//   - Each element animates IN when it scrolls into view (from EITHER scroll
//     direction) and back OUT when it leaves — `toggleActions` maps the four
//     ScrollTrigger callbacks [onEnter, onLeave, onEnterBack, onLeaveBack] to
//     play / reverse / play / reverse.
//   - Under `prefers-reduced-motion: reduce` no tween is created at all (the
//     `matchMedia` branch never fires), so the element keeps its visible
//     resting state — motion-sensitive visitors still get the content.
//   - `ScrollTrigger.refresh()` is called after `document.fonts.ready` and a
//     post-mount rAF so triggers measure against the final, web-font-laid-out
//     layout instead of the fallback-font one.
//
// GSAP / ScrollTrigger are imported statically (both are SSR-safe — neither
// touches `window`/`document` at module evaluation), but no GSAP call ever
// runs at module scope: every call lives inside `useGSAP`'s effect, which
// `@gsap/react` makes a client-only no-op on the server / during prerender.

// Registered once at module scope; `registerPlugin` is idempotent and does not
// touch the DOM, so it is safe outside the effect.
gsap.registerPlugin(ScrollTrigger);

interface UseGsapRevealOptions {
  // Stagger offset (ms) before this element begins its entrance, matching the
  // prototype's cascading reveal across sibling blocks.
  delay?: number;
}

export function useGsapReveal<E extends HTMLElement = HTMLElement>(
  {delay = 0}: UseGsapRevealOptions = {},
): RefObject<E | null> {
  const ref = useRef<E | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (el === null) {
        return;
      }

      // Gate motion with `gsap.matchMedia` so toggling `prefers-reduced-motion`
      // mid-session enables/disables the reveal LIVE (turning motion off reverts
      // the no-preference branch → element stays visible; turning it back on
      // re-adds it). Accepted tradeoff: the matchMedia revert/re-add refreshes
      // ScrollTrigger, which scrolls the page to the top at the toggle moment —
      // a known GSAP behaviour we tolerate for live reduced-motion handling.
      // (Do NOT "fix" this by reading the preference once — that needs a reload.)
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tween = gsap.fromTo(
          el,
          {autoAlpha: 0, y: 18},
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            delay: delay / 1000,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              end: 'bottom 8%',
              toggleActions: 'play reverse play reverse',
            },
          },
        );

        // `toggleActions` only fire on a state transition. An element already
        // past its start point at load (above the fold) never "enters", so snap
        // any already-active trigger to its end state on each refresh so it
        // shows immediately.
        const st = tween.scrollTrigger;
        const seed = () => {
          if (st !== undefined && st.isActive) {
            tween.progress(1);
          }
        };
        ScrollTrigger.addEventListener('refresh', seed);
        seed();

        return () => {
          ScrollTrigger.removeEventListener('refresh', seed);
        };
      });

      // Re-measure trigger positions once web fonts have swapped in and after a
      // post-mount frame.
      const refresh = () => {
        ScrollTrigger.refresh();
      };
      const raf = requestAnimationFrame(refresh);
      if (typeof document !== 'undefined' && 'fonts' in document) {
        void document.fonts.ready.then(refresh);
      }

      return () => {
        cancelAnimationFrame(raf);
        mm.revert();
      };
    },
    {scope: ref, dependencies: [delay]},
  );

  return ref;
}
