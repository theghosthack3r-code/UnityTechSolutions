import React, { useState, useEffect, useRef } from 'react';
import TerminalManager from './TerminalManager';
import IPDisplay from './IPDisplay';
import { useClickOutside } from '../hooks/useClickOutside';
import UnityTechIcon from './UnityTechIcon';

// --- Clock Component ---
const Clock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="hidden sm:flex flex-col items-center font-mono text-xs">
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span>{time.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
        </div>
    );
};


// --- Start Menu Components ---
const StartButton: React.FC<{ onClick: () => void; isActive: boolean; }> = ({ onClick, isActive }) => (
    <button onClick={onClick} className={`start-button flex items-center gap-3 ${isActive ? 'active' : ''}`}>
        <UnityTechIcon className="h-6 w-auto" />
        <span className="font-ox font-bold text-lg">Start</span>
    </button>
);

const StartMenu: React.FC<{ isOpen: boolean; closeMenu: () => void; }> = ({ isOpen, closeMenu }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    useClickOutside(menuRef, closeMenu, isOpen);
    
    const navLinks = [
      { href: "#about", label: "About" },
      { href: "#services", label: "Capabilities" },
      { href: "#contact", label: "Contact" }
    ];

    const handleLinkClick = () => {
        setTimeout(closeMenu, 150); // Delay to allow scroll to start
    };

    return (
        <div ref={menuRef} className={`start-menu glass neon-card rounded-xl overflow-hidden ${isOpen ? 'open' : ''}`}>
            <div className="flex flex-col">
                {navLinks.map(link => (
                    <a key={link.href} href={link.href} onClick={handleLinkClick} className="start-menu-item text-slate-200">
                        {link.label}
                    </a>
                ))}
                <div className="border-t border-white/10 my-1"></div>
                 <a href="mailto:admin@unitytech.solutions" className="start-menu-item text-slate-200">
                    admin@unitytech.solutions
                </a>
            </div>
        </div>
    );
};

// --- Header ---
const Header: React.FC = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    
    return (
        <header className="taskbar glass-dark neon-border">
            <div className="relative">
                <StartButton onClick={() => setMenuOpen(!isMenuOpen)} isActive={isMenuOpen} />
                <StartMenu isOpen={isMenuOpen} closeMenu={() => setMenuOpen(false)} />
            </div>
            
            <div className="flex items-center gap-4">
                <IPDisplay />
                <div className="hidden sm:block h-8 w-px bg-white/10"></div>
                <Clock />
            </div>
        </header>
    );
};


// --- Footer ---
const Footer: React.FC = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);
    return (
        <footer className="relative z-10 border-t border-white/10/50">
            <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
                <p>© {year} UnityTech Solutions. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <a href="#top" className="hover:text-slate-200">Back to top ↑</a>
                </div>
            </div>
        </footer>
    );
};


// --- Modals ---
interface ModalProps {
    id: string;
    activeModal: string | null;
    setActiveModal: (id: string | null) => void;
    children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ id, activeModal, setActiveModal, children }) => (
    <div 
      className={`modal ${activeModal === id ? 'active' : ''}`}
      onClick={() => setActiveModal(null)}
    >
        <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
);

const AllModals: React.FC<{ activeModal: string | null; setActiveModal: (id: string | null) => void; }> = ({ activeModal, setActiveModal }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActiveModal(null);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [setActiveModal]);
    
    return (
        <>
            <Modal id="calModal" activeModal={activeModal} setActiveModal={setActiveModal}>
                <div className="glass neon-card rounded-2xl p-0 w-[95%] max-w-3xl panel">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <h4 className="font-ox text-lg">Schedule a Discovery Call</h4>
                        <button onClick={() => setActiveModal(null)} className="px-3 py-1 rounded hover:bg-white/10">✕</button>
                    </div>
                    <div className="p-2">
                        <div className="calendly-inline-widget" data-url="https://calendly.com/REPLACE_WITH_YOUR_LINK/30min" style={{ minWidth: '320px', height: '680px' }}></div>
                    </div>
                </div>
            </Modal>
            
            <Modal id="successModal" activeModal={activeModal} setActiveModal={setActiveModal}>
                <div className="panel glass neon-card rounded-2xl p-8 text-center max-w-md w-[92%]">
                    <div className="mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center border border-white/10 shadow-neonglow text-3xl">✅</div>
                    <h4 className="font-ox text-xl">Request received</h4>
                    <p className="text-slate-300 mt-2">Thanks! We’ll reach out shortly.</p>
                </div>
            </Modal>
        </>
    );
};


// --- Consent Bar ---
const ConsentBar: React.FC = () => {
    const [visible, setVisible] = useState(false);
    
    useEffect(() => {
        const consent = localStorage.getItem('uts_consent');
        if (!consent) setVisible(true);
    }, []);
    
    const handleConsent = (consent: 'yes' | 'no') => {
        localStorage.setItem('uts_consent', consent);
        setVisible(false);
        if (consent === 'yes') {
            // Logic to load GA or other tracking scripts can go here
            console.log("Analytics enabled.");
        }
    };

    if (!visible) return null;

    return (
        <div id="consentBar" className="consent">
            <div className="mx-auto max-w-7xl px-4 py-3">
                <div className="glass neon-card rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                    <p className="text-sm text-slate-300">We use minimal analytics to improve the site. OK to enable?</p>
                    <div className="flex gap-2">
                        <button onClick={() => handleConsent('yes')} className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600">Allow</button>
                        <button onClick={() => handleConsent('no')} className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5">No, thanks</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Floating Buttons ---
const FloatingButtons: React.FC<{ setActiveModal: (id: string | null) => void; }> = ({ setActiveModal }) => {
    const [muted, setMuted] = useState(true);

    useEffect(() => {
        const pref = localStorage.getItem('uts_video_muted');
        setMuted(pref !== 'no');
    }, []);

    const toggleMute = () => {
        const player = (window as any).utsYTPlayer?.current;
        if (!player) return;
        
        const isMuted = player.isMuted();
        if (isMuted) {
            player.unMute();
            localStorage.setItem('uts_video_muted', 'no');
            setMuted(false);
        } else {
            player.mute();
            localStorage.setItem('uts_video_muted', 'yes');
            setMuted(true);
        }
    };
    
    return (
        <>
            <button onClick={() => setActiveModal('calModal')} className="float-call rounded-full px-5 py-3 bg-brand-500 hover:bg-brand-600 shadow-neonglow btn-neon font-ox">Book a Call</button>
            <button onClick={toggleMute} className="yt-toggle rounded-full px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 shadow-neonglow font-ox">
                {muted ? '🔇 Mute' : '🔊 Sound On'}
            </button>
        </>
    );
};


// --- Scroll Progress Bar ---
const ScrollProgressBar: React.FC = () => {
    const barRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const update = () => {
            if (!barRef.current) return;
            const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            const pct = Math.min(1, window.scrollY / max);
            barRef.current.style.width = (pct * 100).toFixed(2) + '%';
        };
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();
        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, []);

    return <div ref={barRef} id="scrollProg" />;
};


// --- Main UI Chrome Component ---
const UIChrome: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeModal, setActiveModal] = useState<string | null>(null);

    useEffect(() => {
        (window as any).showSuccessModal = () => {
            setActiveModal('successModal');
            setTimeout(() => setActiveModal(null), 4000);
        };
    }, []);

    return (
        <>
            <Header />
            {children}
            <Footer />
            <ScrollProgressBar />
            <ConsentBar />
            <FloatingButtons setActiveModal={setActiveModal} />
            <AllModals activeModal={activeModal} setActiveModal={setActiveModal} />
            <TerminalManager />
        </>
    );
};

export default UIChrome;