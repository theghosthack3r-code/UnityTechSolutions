import { useEffect } from 'react';

// Fix: Add type definitions for window.gsap and window.ScrollTrigger to resolve TypeScript errors.
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    TextPlugin: any;
  }
}

const useGsapAnimations = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled || !window.gsap) return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    // Hero animations
    const tl = window.gsap.timeline();
    const heroLogo = document.getElementById('hero-logo');

    if (heroLogo) {
        // Position the logo in the center of the viewport to start
        const finalBounds = heroLogo.getBoundingClientRect();
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight * 0.4;
        const startX = viewportCenterX - finalBounds.left - (finalBounds.width / 2);
        const startY = viewportCenterY - finalBounds.top - (finalBounds.height / 2);
        
        // 1. Animate logo from center -> final position
        tl.fromTo(heroLogo,
            { x: startX, y: startY, scale: 2.5, opacity: 0 },
            { 
              x: 0, y: 0, scale: 1, opacity: 1, 
              duration: 1.125, 
              ease: 'power2.inOut' 
            }
        );

        // 2. Animate the rest of the hero content after logo is in place
        tl.fromTo('[data-reveal="hero"]',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.15 },
          "-=0.75" // Overlap with the end of the logo animation
        );
    } else {
        // Fallback for hero content if logo isn't found
        window.gsap.fromTo('[data-reveal="hero"]',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.2, delay: 0.2 }
        );
    }


    // General purpose card reveal
    document.querySelectorAll('[data-reveal="card"]').forEach(el => {
      window.gsap.fromTo(el,
        { opacity: 0, y: 50, rotationX: -10 },
        {
          opacity: 1, y: 0, rotationX: 0, duration: 0.75, ease: 'power3.out',
          scrollTrigger: { trigger: el as Element, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });
    
    // General purpose "up" reveal
    document.querySelectorAll('[data-reveal="up"]').forEach(el => {
      window.gsap.from(el, {
        opacity: 0, y: 40, duration: 0.75, ease: 'power3.out',
        scrollTrigger: { trigger: el as Element, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });

    // Staggered service cards
    if (document.querySelector('[data-reveal-container]')) {
        window.gsap.from('[data-reveal="service"]', {
            opacity: 0, y: 30, duration: 0.6, ease: 'power3.out', stagger: 0.15,
            scrollTrigger: { trigger: '[data-reveal-container]', start: 'top 80%' }
        });
    }

    // 3D Card tilt effect
    const tiltCards = document.querySelectorAll('.tilt');
    const controllers: AbortController[] = [];

    tiltCards.forEach(card => {
        const controller = new AbortController();
        controllers.push(controller);
        const htmlCard = card as HTMLElement;

        htmlCard.addEventListener('mousemove', (e: MouseEvent) => {
            const rect = htmlCard.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
            window.gsap.to(htmlCard, {
                rotationY: x * 8,
                rotationX: -y * 6,
                transformPerspective: 1000,
                ease: 'power1.out',
                duration: 0.375
            });
        }, { signal: controller.signal });

        htmlCard.addEventListener('mouseleave', () => {
            window.gsap.to(htmlCard, {
                rotationY: 0, rotationX: 0,
                ease: 'power1.out', duration: 0.75
            });
        }, { signal: controller.signal });
    });

    return () => {
        // Kill all tweens and scrollTriggers to prevent memory leaks
        window.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        window.gsap.globalTimeline.clear();
        controllers.forEach(c => c.abort());
    };
  }, [enabled]);
};

export default useGsapAnimations;