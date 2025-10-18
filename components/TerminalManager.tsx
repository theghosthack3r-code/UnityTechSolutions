import React, { useState, useEffect, useRef } from 'react';

const codeSnippets = [
    '// Initializing neural network...',
    'Compiling quantum algorithms...',
    'Deploying serverless functions...',
    'Establishing secure handshake...',
    'Caching assets on edge network...',
    'Running diagnostics... all systems nominal.',
    'Parsing WebAssembly modules...'
];

interface TerminalMessage {
    id: number;
    text: string;
}

const TerminalWindow: React.FC<{ message: TerminalMessage; onComplete: () => void; }> = ({ message, onComplete }) => {
    const elRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!elRef.current || !window.gsap || !window.TextPlugin) return;
        
        const tl = window.gsap.timeline({ onComplete });
        tl.fromTo(elRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out' })
          .to(elRef.current.querySelector('p'), { duration: message.text.length * 0.05, text: { value: message.text, newClass: 'terminal-cursor' }, ease: 'none' })
          .to(elRef.current, { opacity: 0, duration: 0.5, ease: 'power1.in', delay: 2.5 });
          
        return () => {
            tl.kill();
        }
    }, [message, onComplete]);

    return (
        <div ref={elRef} className="terminal-window">
            <div className="terminal-header">unitytech_process</div>
            <div className="terminal-body"><p></p></div>
        </div>
    );
};

const TerminalManager: React.FC = () => {
    const [activeMessage, setActiveMessage] = useState<TerminalMessage | null>(null);
    const counterRef = useRef(0);
    const timeoutRef = useRef<number | null>(null);

    // Manages the message lifecycle
    useEffect(() => {
        // Ensure TextPlugin is registered
        if (window.gsap && window.TextPlugin) {
            window.gsap.registerPlugin(window.TextPlugin);
        }

        const showNextMessage = () => {
            const newText = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
            setActiveMessage({ id: counterRef.current++, text: newText });
        };
        
        // Start the first message after a delay
        timeoutRef.current = window.setTimeout(showNextMessage, 4000);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleAnimationComplete = () => {
        setActiveMessage(null);
        // Schedule the next message to appear after a random delay
        timeoutRef.current = window.setTimeout(() => {
            const newText = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
            setActiveMessage({ id: counterRef.current++, text: newText });
        }, Math.random() * 6000 + 4000);
    };

    return (
        <div 
            className="fixed left-6 top-[72px] z-40 flex flex-col items-start gap-3"
            style={{pointerEvents: 'none'}}
            aria-hidden="true"
        >
            {activeMessage && (
                <TerminalWindow message={activeMessage} onComplete={handleAnimationComplete} />
            )}
        </div>
    );
};

export default TerminalManager;