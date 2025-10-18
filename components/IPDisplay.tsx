import React, { useState, useEffect } from 'react';

const IPDisplay: React.FC = () => {
    const [ip, setIp] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                setIp(data.ip);
            })
            .catch(error => {
                console.error("Failed to fetch IP address:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // To use the <dotlottie-wc> custom element without modifying global JSX types,
    // we cast it to `any` and render it as a capitalized constant.
    const DotLottie = 'dotlottie-wc' as any;

    if (loading) {
        return (
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 min-w-[200px]">
                <span>Connecting...</span>
            </div>
        );
    }
    
    if (!ip) return null;

    return (
        <div className="hidden lg:flex items-center gap-1 text-slate-400">
            <DotLottie 
                src="https://lottie.host/7ebb173c-9607-4a8f-9bc6-0585d32eb2f3/Poc88kUrvi.json" 
                style={{ width: '40px', height: '40px' }} 
                autoplay 
                loop
            ></DotLottie>
            <div className="text-right">
                <span className="text-xs">Securely connected from:</span>
                <p className="font-mono text-sm text-slate-200">{ip}</p>
            </div>
        </div>
    );
};

export default IPDisplay;
