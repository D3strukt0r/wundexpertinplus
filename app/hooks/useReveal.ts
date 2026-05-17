import {useEffect, useRef, useState} from 'react';

// Fade-and-rise on intersection. Returns a ref + boolean — bind the ref to
// the element you want to observe and read `shown` to drive the transition.
// Falls back to `true` after 1.2s in case the IntersectionObserver never fires
// (e.g. element is in an offscreen container or animations are disabled).
export function useReveal<E extends HTMLElement = HTMLElement>() {
  const ref = useRef<E | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.unobserve(entry.target);
          }
        }
      },
      {threshold: 0.08, rootMargin: '0px 0px -40px 0px'},
    );
    io.observe(node);
    const fallback = window.setTimeout(() => {
      setShown(true);
    }, 1200);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return [ref, shown] as const;
}
