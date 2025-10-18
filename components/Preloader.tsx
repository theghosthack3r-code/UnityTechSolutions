import React, { useEffect, useRef, useState } from 'react';

// Fix: Removed a faulty `declare global` block that was overriding React's default
// JSX typings for the entire application. This resolves numerous errors related to
// standard HTML/SVG elements not being found in `JSX.IntrinsicElements`.
// The type for `window.gsap` is provided by `hooks/useGsapAnimations.ts`.

interface PreloaderProps {
  onLoaded: () => void;
}

const bootLines = [
  '[ 0.000000] Booting UnityTech OS Kernel v2.0.1...',
  '[ 0.000001] ACPI: LAPIC_NMI (acpi_id[0x01] high edge lint[0x1])',
  '[ 0.048479] DMI: UnityTech Virtual Machine/UTS-440, BIOS 1.0.0 04/01/2024',
  '[ 0.152331] Memory: 65536k/65536k available (1428k kernel code, 412k data)',
  '[ 0.158992] PnP: PnP BIOS detected, dev 00:01 (vers 1.0) is unavailable',
  '[ 0.248109] kernel: Command line: BOOT_IMAGE=/boot/vmlinuz root=/dev/uts ro quiet splash --init-services',
  '[ 0.351234] uts-vfs: VFS: Mounted root (ext4 filesystem) readonly.',
  '[ 0.499123] Freeing unused kernel memory: 1024k freed',
  '[ 0.512345] high_res_timers: Initialized',
  '[ 0.623456] net_namespace: Initializing network namespace',
  '[ 0.734567] systemd[1]: Systemd v255 starting up',
  '[ 0.845678] udevd[2]: starting version 3.2.9',
  '[ 0.891234] usb 1-1: new high-speed USB device number 2 using ehci_hcd',
  '[ 0.982345] SCSI subsystem initialized',
  '[ 1.123456] Block layer SCSI generic (bsg) driver version 0.4 loaded',
  '[ 1.224567] NET: Registered protocol family 2',
  '[ 1.285678] TCP: advanced congestion control registered',
  '[ 1.345678] IP route cache hash table entries: 4096 (order: 2, 16384 bytes)',
  '[ 1.458901] TCP: cubic registered',
  '[ 1.551234] NET: Registered protocol family 1',
  '[ 1.623456] uts-drm: Direct Rendering Manager initialized',
  '[ 1.734567] uts-gpu: Loading firmware for gfx_v9_0',
  '[ 1.834571] Loading initial ramdisk ...',
  '[ 1.912345] [drm] Found UVD firmware Version: 1.130 Family: 16',
  '[ 2.012345] [drm] Found VCE firmware Version: 53.28 Family: 16',
  '[ 2.112345] uts-storage: Found 1 disk(s).',
  '[ 2.223456] ata1: SATA link up 6.0 Gbps (SStatus 133 SControl 300)',
  '[ 2.334567] ata1.00: ATA-9: VBOX HARDDISK, 1.0, max UDMA/133',
  '[ 2.445678] scsi 0:0:0:0: Direct-Access ATA VBOX HARDDISK 1.0 PQ: 0 ANSI: 5',
  '[ 2.556789] uts-net-driver: uth0: link up, 1000Mbps, full-duplex, lpa 0xCDE1',
  '[ 2.667890] IPv6: ADDRCONF(NETDEV_CHANGE): uth0: link becomes ready',
  '[ 2.778901] uts-hid: Generic HID driver 1.0.1',
  '[ 2.889012] input: UTS Virtual Keyboard as /devices/platform/i8042/serio0/input/input0',
  '[ 2.998765] uts-vfs: VFS: Remounting root filesystem in read-write mode.',
  '[ 3.123456] Mounting core filesystems... done.',
  '[ 3.234567] ALSA device list:',
  '[ 3.234568]   #0: UTS Audio Controller rev 3',
  '[ 3.345678] systemd[1]: Starting Journal Service...',
  '[ 3.456789] systemd-journald[3]: Received client request to flush runtime journal.',
  '[ 3.567890] Starting UnityTech Core Services...',
  '[ 3.612345] [OK] Started Journal Service.',
  '[ 3.712345] [OK] Started Virtual Console Setup.',
  '[ 3.812345] [OK] Started System Logger.',
  '[ 3.987654] [OK] Started Network Manager.',
  '[ 4.012345] [OK] Started CRON Daemon.',
  '[ 4.056789] [OK] Started Dispatcher daemon for systemd-networkd.',
  '[ 4.089012] [OK] Started D-Bus System Message Bus.',
  '[ 4.123123] [OK] Started Security Daemon.',
  '[ 4.156789] [OK] Started Load/Save Random Seed.',
  '[ 4.189012] [OK] Reached target System Initialization.',
  '[ 4.221098] [OK] Started User Session Manager.',
  '[ 4.256789] [OK] Reached target Timers.',
  '[ 4.289012] [OK] Reached target Sockets.',
  '[ 4.312345] [OK] Listening on D-Bus System Message Bus Socket.',
  '[ 4.332109] [OK] Initialized Rendering Engine.',
  '[ 4.412345] [OK] Started Login Service.',
  '[ 4.487654] [OK] Reached target User and Group Name Lookups.',
  '[ 4.543210] [OK] Reached target Graphical Interface.',
  '[ 4.612345] systemd[1]: Starting Update UTCS...',
  '[ 4.754321] [OK] Finished Update UTCS.',
  '[ 4.888888] Authenticating client session...',
  '[ 5.101010] Establishing secure connection to server...',
  '[ 5.333333] Connection established.',
  '[ 5.551234] Client authenticated. Granting access.',
  '[ 5.612345] Loading user profile...',
  '[ 5.754321] Applying UI settings...',
  '[ 5.812345] Launching UI environment...',
  '[ 5.999999] Welcome to UnityTech OS!',
];

const BootScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bootLines.forEach((line, index) => {
            setTimeout(() => {
                setLines(prev => [...prev, line]);
                if (containerRef.current) {
                    containerRef.current.scrollTop = containerRef.current.scrollHeight;
                }
            }, index * 45);
        });

        setTimeout(onComplete, bootLines.length * 45 + 750);
    }, [onComplete]);

    return (
        <div ref={containerRef} className="w-full h-full p-4 font-mono text-xs text-brand-400/80 overflow-hidden">
            {lines.map((line, i) => <p key={i}>{line}</p>)}
        </div>
    );
};


const Preloader: React.FC<PreloaderProps> = ({ onLoaded }) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState('intro');

  // States for intro animation
  const [welcomeLine, setWelcomeLine] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [animationStep, setAnimationStep] = useState(0); // Sequence driver
  const [showCard, setShowCard] = useState(false);
  const [cardContentPhase, setCardContentPhase] = useState<'loading' | 'granted'>('loading');


  useEffect(() => {
    if (!preloaderRef.current || !window.gsap) return;
    document.body.style.overflow = 'hidden';
    
    // This effect handles the entire intro animation sequence
    if (phase === 'intro') {
      const typeText = (text: string, setter: React.Dispatch<React.SetStateAction<string>>, onComplete: () => void) => {
        let i = 0;
        setter('');
        const interval = setInterval(() => {
          if (i <= text.length) {
            setter(text.substring(0, i));
            i++;
          } else {
            clearInterval(interval);
            onComplete();
          }
        }, 45);
        return () => clearInterval(interval);
      };

      let timeoutId: number;
      let cleanupTyping: (() => void) | undefined;
      
      switch (animationStep) {
        case 0: // Start: wait then type welcome line
          timeoutId = window.setTimeout(() => {
            cleanupTyping = typeText('Welcome to UnityTech Solutions', setWelcomeLine, () => setAnimationStep(1));
          }, 375);
          break;
        case 1: // Welcome done, type line 1
          timeoutId = window.setTimeout(() => {
            cleanupTyping = typeText('SYSTEMS ONLINE', setLine1, () => setAnimationStep(2));
          }, 450);
          break;
        case 2: // Line 1 done: show checkmark, wait
          timeoutId = window.setTimeout(() => setAnimationStep(3), 450);
          break;
        case 3: // Type line 2
          timeoutId = window.setTimeout(() => {
            cleanupTyping = typeText('CONNECTING TO SERVER', setLine2, () => setAnimationStep(4));
          }, 225);
          break;
        case 4: // Line 2 done: show dots, wait for "connection"
          timeoutId = window.setTimeout(() => setAnimationStep(5), 1650);
          break;
        case 5: // Fade out text & lottie
          window.gsap.to([preloaderRef.current?.querySelector('.intro-text-container'), preloaderRef.current?.querySelector('.lottie-container')], {
            opacity: 0,
            duration: 0.375,
            onComplete: () => {
              setShowCard(true);
              setAnimationStep(6);
            },
          });
          break;
        case 6: // Card is visible, show loading animation
          timeoutId = window.setTimeout(() => {
            setCardContentPhase('granted');
            setAnimationStep(7);
          }, 2625); // Loader runs for ~2.6s
          break;
        case 7: // Access Granted is visible, wait a bit
          timeoutId = window.setTimeout(() => {
            setAnimationStep(8);
          }, 1500); // Show granted message for 1.5s
          break;
        case 8: // Fade out card and switch to booting phase
          window.gsap.to(preloaderRef.current?.querySelector('.access-card'), {
            opacity: 0,
            duration: 0.375,
            onComplete: () => setPhase('booting'),
          });
          break;
        default:
          break;
      }
      return () => {
        clearTimeout(timeoutId);
        if (cleanupTyping) cleanupTyping();
      };
    }
  }, [phase, animationStep]);

  useEffect(() => {
    // This effect handles the final fade-out
    if (phase === 'complete') {
      const tl = window.gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          if (preloaderRef.current) {
            preloaderRef.current.style.display = 'none';
          }
          onLoaded();
        },
      });
      tl.to(preloaderRef.current, {
        opacity: 0,
        backgroundColor: 'transparent',
        duration: 0.5,
        ease: 'power1.inOut',
      });
    }
  }, [phase, onLoaded]);

  const renderIntro = () => {
    // Fix: To support the `<dotlottie-wc>` custom element without modifying global JSX types,
    // it is cast to `any` and rendered as a capitalized constant. This avoids the
    // global type pollution that was breaking standard JSX elements.
    const DotLottie = 'dotlottie-wc' as any;

    return (
      <>
        {!showCard && (
          <>
            <div className="w-full max-w-4xl lottie-container">
              <DotLottie
                src="https://lottie.host/d573fe18-fac5-411b-8722-bda1a4939c52/EHK3Zt00Qm.json"
                speed="0.5" mode="forward" loop autoplay
              ></DotLottie>
            </div>
            
            <div className="mt-4 text-center intro-text-container">
              <div className="font-mono tracking-wider h-24 text-slate-300">
                <p className="text-base mb-2">
                  {welcomeLine}
                  {animationStep === 0 && <span className="animate-pulse">_</span>}
                </p>
                <p>
                  {line1}
                  <span className={`checkmark ${animationStep >= 2 ? 'visible' : ''}`}>&nbsp;✔</span>
                  {animationStep === 1 && <span className="animate-pulse">_</span>}
                </p>
                <p className="mt-1">
                  {line2}
                  {animationStep === 4 && (
                    <span className="connecting-dots"><span>.</span><span>.</span><span>.</span></span>
                  )}
                  {animationStep === 3 && <span className="animate-pulse">_</span>}
                </p>
              </div>
            </div>
          </>
        )}
        
        {showCard && (
          <div className={`access-card glass neon-card neon-border visible`}>
             {cardContentPhase === 'loading' ? (
               <div className="relative text-center">
                  <h3 className="text-lg font-ox text-cyan-300">Connecting to Remote System</h3>
                  <p className="mt-4 text-sm text-slate-300">Loading secure environment...</p>
                  <div className="mt-4 w-full h-2 rounded-full bg-slate-700/50 overflow-hidden border border-cyan-500/20">
                      <div className="h-full high-tech-loader"></div>
                  </div>
              </div>
            ) : (
              <div className="relative text-center" style={{ transform: 'scale(1.1)' }}>
                 <h3 className="text-2xl font-ox text-cyan-300">ACCESS GRANTED</h3>
                 <p className="mt-4 text-sm text-slate-300">SSL Encrypted Channel Established</p>
                 <p className="mt-1 text-sm font-semibold secure-text-anim">Secure Connection</p>
             </div>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div 
      ref={preloaderRef} 
      className={`fixed inset-0 bg-slate-950 z-[100] flex flex-col transition-colors duration-500 ${phase === 'booting' ? 'items-start justify-start' : 'items-center justify-center'}`}
      style={{ backgroundColor: phase === 'booting' ? '#000' : ''}}
    >
      {phase === 'intro' && renderIntro()}
      {phase === 'booting' && (
        <BootScreen onComplete={() => setPhase('complete')} />
      )}
    </div>
  );
};

export default Preloader;