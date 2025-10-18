
// Tailwind Play CDN config (must load BEFORE the CDN script)
window.tailwind = {
  theme: {
    extend: {
      fontFamily: { 
        display: ['Inter', 'ui-sans-serif', 'system-ui'], 
        ox: ['Oxanium','Inter','ui-sans-serif'],
        mono: ['Space Mono', 'monospace']
      },
      colors: {
        brand: {
          50:'#eef7ff',100:'#d7ebff',200:'#b3d6ff',300:'#80bbff',400:'#4a9cff',500:'#1976ff',600:'#0f5fe6',700:'#0b4bc0',800:'#0b3c99',900:'#0b2e73',
          DEFAULT:'#1976ff'
        },
        neon: { blue:'#27a0ff', cyan:'#00eaff', indigo:'#5b7cfa' }
      },
      boxShadow: {
        glow: '0 0 48px rgba(25,118,255,.35)',
        neonglow: '0 0 0 2px rgba(39,160,255,.35), 0 0 32px rgba(39,160,255,.45)'
      },
      keyframes: {
        shimmer: { to: { backgroundPosition: '200% center' } },
        scan: { '0%': { transform:'translateX(-100%)' }, '100%': { transform:'translateX(100%)' } },
        pulsebar: { '0%,100%': { opacity:.2 }, '50%': { opacity:.9 } }
      },
      animation: { 
        shimmer: 'shimmer 4s linear infinite', 
        scan:'scan 6s linear infinite',
        pulsebar:'pulsebar 2.5s ease-in-out infinite' 
      }
    }
  }
};
