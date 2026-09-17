import {useEffect, useState} from 'react';
import {useLocation, useNavigationType} from 'react-router';
import {ReactLenis, useLenis} from 'lenis/react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useAside} from '~/components/Aside';

gsap.registerPlugin(ScrollTrigger);

function LenisBridge() {
  const lenis = useLenis(() => ScrollTrigger.update());
  const {type: asideType} = useAside();
  const {pathname} = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (!lenis) return;

    const update = (time: number) => lenis.raf(time * 1000);

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [lenis]);

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
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(query.matches);

    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return (
    <ReactLenis root options={{autoRaf: false, smoothWheel: !reduceMotion}}>
      {children}
      <LenisBridge />
    </ReactLenis>
  );
}
