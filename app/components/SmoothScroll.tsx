import {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigationType} from 'react-router';
import {ReactLenis, useLenis, type LenisRef} from 'lenis/react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useAside} from '~/components/Aside';

gsap.registerPlugin(ScrollTrigger);

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPrefersReducedMotion(query.matches);

    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return prefersReducedMotion;
}

function LenisBridge() {
  const lenis = useLenis(() => ScrollTrigger.update());
  const {type: asideType} = useAside();
  const {pathname} = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (!lenis) return;
    if (asideType === 'closed') {
      lenis.start();
    } else {
      lenis.stop();
    }
  }, [lenis, asideType]);

  useEffect(() => {
    if (!lenis) return;
    if (navigationType === 'PUSH') {
      lenis.scrollTo(0, {immediate: true});
    }
    ScrollTrigger.refresh();
  }, [lenis, pathname, navigationType]);

  return null;
}

export function SmoothScroll({children}: {children: React.ReactNode}) {
  const lenisRef = useRef<LenisRef>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{autoRaf: false, smoothWheel: !prefersReducedMotion}}
    >
      {children}
      <LenisBridge />
    </ReactLenis>
  );
}
