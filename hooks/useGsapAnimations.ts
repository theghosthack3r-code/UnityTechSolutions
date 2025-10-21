import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const useGsapAnimations = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
        // Hero animations
        const tl = gsap.timeline();
        const heroLogo = document.getElementById('hero-logo');

        if (heroLogo) {
            const finalBounds = heroLogo.getBoundingClientRect();
            const viewportCenterX = window.innerWidth / 2;
            const viewportCenterY = window.innerHeight * 0.4;
            const startX = viewportCenterX - finalBounds.left - (finalBounds.width / 2);
            const startY = viewportCenterY - finalBounds.top - (finalBounds.height / 2);

            tl.fromTo(heroLogo,
                { x: startX, y: startY, scale: 2.5, opacity: 0 },
                { x: 0, y: 0, scale: 1, opacity: 1, duration: 1.125, ease: 'power2.inOut' }
            );

            tl.fromTo('[data-reveal="hero"]',
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.15 },
              "-=0.75"
            );
        } else {
            gsap.fromTo('[data-reveal="hero"]',
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.2, delay: 0.2 }
            );
        }

        document.querySelectorAll('[data-reveal="card"]').forEach(el => {
          gsap.fromTo(el,
            { opacity: 0, y: 50, rotationX: -10 },
            {
              opacity: 1, y: 0, rotationX: 0, duration: 0.75, ease: 'power3.out',
              scrollTrigger: { trigger: el as Element, start: 'top 85%', toggleActions: 'play none none none' }
            }
          );
        });

        document.querySelectorAll('[data-reveal="up"]').forEach(el => {
          gsap.from(el, {
            opacity: 0, y: 40, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: el as Element, start: 'top 85%', toggleActions: 'play none none none' }
          });
        });

        if (document.querySelector('[data-reveal-container]')) {
            gsap.from('[data-reveal="service"]', {
                opacity: 0, y: 30, duration: 0.6, ease: 'power3.out', stagger: 0.15,
                scrollTrigger: { trigger: '[data-reveal-container]', start: 'top 80%' }
            });
        }

        const tiltCards = document.querySelectorAll('.tilt');
        tiltCards.forEach(card => {
            const htmlCard = card as HTMLElement;
            htmlCard.addEventListener('mousemove', (e: MouseEvent) => {
                const rect = htmlCard.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
                gsap.to(htmlCard, {
                    rotationY: x * 8,
                    rotationX: -y * 6,
                    transformPerspective: 1000,
                    ease: 'power1.out',
                    duration: 0.375
                });
            });
            htmlCard.addEventListener('mouseleave', () => {
                gsap.to(htmlCard, {
                    rotationY: 0, rotationX: 0,
                    ease: 'power1.out', duration: 0.75
                });
            });
        });
    });

    return () => ctx.revert();
  }, [enabled]);
};

export default useGsapAnimations;