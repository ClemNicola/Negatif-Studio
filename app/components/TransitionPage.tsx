import {useRef, createContext, useContext} from 'react';
import {useNavigate} from 'react-router';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';

type TransitionPageContextValue = {
  navigateWithCurtain: (to: string) => void;
};

const TransitionPageContext = createContext<
  TransitionPageContextValue | undefined
>(undefined);

export default function TransitionPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const curtain = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  const {contextSafe} = useGSAP(
    () => {
      gsap.set(curtain.current, {yPercent: -100, y: 0});
    },
    {scope: curtain},
  );

  const navigateWithCurtain = contextSafe((to: string) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      void navigate(to);
      return;
    }
    if (isAnimating.current) return;
    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => (isAnimating.current = false),
    });

    tl.to(curtain.current, {yPercent: 0, duration: 0.45, ease: 'power2.out'})
      .call(() => {
        tl.pause();
        const resume = () =>
          requestAnimationFrame(() =>
            requestAnimationFrame(() => tl.resume() as unknown as void),
          );
        Promise.resolve(navigate(to)).then(resume, resume);
      })
      .to(
        curtain.current,
        {yPercent: 100, duration: 1.1, ease: 'power2.inOut'},
        '+=0.15',
      )
      .set(curtain.current, {yPercent: -100});
  });

  return (
    <TransitionPageContext.Provider value={{navigateWithCurtain}}>
      {children}
      <div
        ref={curtain}
        aria-hidden="true"
        className="fixed inset-0 z-100 flex flex-col justify-end bg-text pointer-events-none will-change-transform"
        style={{transform: 'translateY(-100%)'}}
      >
        <p className="px-16 py-8 font-clash-display text-6xl md:text-7xl font-bold text-bg uppercase">
          Negatif Studio
        </p>
      </div>
    </TransitionPageContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(TransitionPageContext);
  if (!context) {
    throw new Error('usePageTransition must be used within a TransitionPage');
  }
  return context;
}
