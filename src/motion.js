import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function mountMotion() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return () => {};

  const desktop = matchMedia('(min-width: 900px) and (pointer: fine)').matches;
  const saveData = navigator.connection?.saveData === true;
  const cinematic = desktop && !saveData;
  const lenis = cinematic ? new Lenis({ lerp: 0.075, smoothWheel: true, syncTouch: false, autoRaf: true }) : null;
  lenis?.on('scroll', ScrollTrigger.update);

  const onAnchor = (event) => {
    if (!lenis || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`);
    lenis.scrollTo(target, {
      offset: target.id === 'inicio' ? 0 : -84,
      duration: 1.25,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
  };
  document.addEventListener('click', onAnchor);
  const onVisibility = () => document.hidden ? lenis?.stop() : lenis?.start();
  document.addEventListener('visibilitychange', onVisibility);

  const updateHeader = () => {
    document.documentElement.style.setProperty('--page-progress', String(Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight))));
    document.querySelector('.site-header')?.classList.toggle('scrolled', scrollY > 24);
  };
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  const context = gsap.context(() => {
    const heroArt = document.querySelector('.hero-art');
    const hero = document.querySelector('.hero');
    if (cinematic && hero && heroArt) {
      gsap.set(heroArt, { transformPerspective: 1300, transformOrigin: '50% 48%', force3D: true });
      gsap.set('.core-assembly', { rotationX: -9, rotationY: 0 });
      const opening = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: () => `+=${Math.round(innerHeight * 0.78)}`,
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      opening
        .to(heroArt, { scale: 1.22, z: 150, rotationY: 12, rotationX: -4, xPercent: -5, yPercent: 1, duration: 0.42 }, 0)
        .to('.core-assembly', { rotationY: 0, rotationX: -9, duration: 0.01 }, 0)
        .to('.core-assembly', { rotationY: 180, rotationX: -4, duration: 0.3, ease: 'power2.inOut' }, 0.16)
        .to('.cube-team-names>b', { y: 0, opacity: 1, stagger: 0.055, duration: 0.12 }, 0.43)
        .to('.orbit-one', { rotation: 72, scale: 1.12, duration: 0.42 }, 0)
        .to('.orbit-two', { rotation: -82, scale: 1.08, duration: 0.42 }, 0)
        .to('.hero-bottom-copy', { y: -18, opacity: 0.62, duration: 0.28 }, 0.12)
        .to(heroArt, { scale: 0.84, z: -80, rotationY: -5, rotationX: 1, xPercent: 12, yPercent: -1, opacity: 0.9, duration: 0.46 }, 0.54)
        .to('.core-assembly', { rotationY: 180, rotationX: -9, duration: 0.46 }, 0.54)
        .to('.orbit-one', { rotation: 170, scale: 0.94, duration: 0.46 }, 0.44)
        .to('.orbit-two', { rotation: -190, scale: 0.92, duration: 0.46 }, 0.44)
        .to('.hero-copy', { scale: 0.985, y: -14, opacity: 0.92, duration: 0.33 }, 0.64)
        .to('.hero-grid', { scale: 1.18, rotation: 5, opacity: 0.045, duration: 0.9 }, 0);
    } else if (heroArt) {
      gsap.fromTo(heroArt, { scale: 1, yPercent: 0 }, {
        scale: 0.78, yPercent: 12, rotation: -4, opacity: 0.58, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 },
      });
    }

    const servicePanel = document.querySelector('.service-panel');
    if (servicePanel) gsap.fromTo(servicePanel,
      { y: 24, opacity: 0.76 },
      { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.services', start: 'top 90%', end: 'center 48%', scrub: 0.8 } },
    );

    document.querySelectorAll('.team-portrait').forEach((portrait) => {
      gsap.fromTo(portrait, { y: 20, opacity: 0.76 },
        { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: portrait, start: 'top 94%', end: 'center 55%', scrub: 0.7 } });
    });

    if (cinematic) {
      const grid = document.querySelector('.hero-grid');
      if (grid) {
        const xTo = gsap.quickTo(grid, 'x', { duration: 0.8, ease: 'power2.out' });
        const yTo = gsap.quickTo(grid, 'y', { duration: 0.8, ease: 'power2.out' });
        const onPointer = (event) => {
          xTo((event.clientX / innerWidth - 0.5) * -22);
          yTo((event.clientY / innerHeight - 0.5) * -16);
        };
        window.addEventListener('pointermove', onPointer, { passive: true });
        window.addEventListener('pagehide', () => window.removeEventListener('pointermove', onPointer), { once: true });
      }
    }

    ScrollTrigger.refresh();
  });

  return () => {
    context.revert();
    lenis?.destroy();
    document.removeEventListener('click', onAnchor);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('scroll', updateHeader);
    document.documentElement.style.removeProperty('--page-progress');
  };
}
