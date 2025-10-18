import React, { useEffect, useRef } from 'react';

// Fix: Add type definitions for the YouTube Iframe API to resolve TypeScript errors.
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// WebGL Starfield Renderer
const initStarfield = (canvas: HTMLCanvasElement) => {
  let gl: WebGLRenderingContext | null;
  try {
    gl = canvas.getContext('webgl', { antialias: false, depth: false, stencil: false, premultipliedAlpha: false });
  } catch (e) {
    gl = null;
  }
  if (!gl) return null;

  const vsSrc = `attribute vec2 p; varying vec2 v; void main(){ v = p*0.5+0.5; gl_Position = vec4(p,0.0,1.0); }`;
  const fsSrc = `precision highp float; varying vec2 v; uniform vec2 r; uniform float t;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
  float stars(vec2 uv){
    float s=0.0; 
    for(float i=0.0;i<3.0;i+=1.0){
      vec2 grid = uv*(2.0+i*1.7); 
      vec2 id=floor(grid);
      vec2 f=fract(grid)-0.5; 
      float n=hash(id+ i*11.0);
      float d=length(f + vec2(n-0.5, fract(n*3.7)-0.5)*0.6);
      s += smoothstep(0.06,0.0,d) * (0.6+(n*0.4));
      uv += vec2(0.01*i, 0.02*i);
    }
    return s;
  }
  void main(){
    vec2 uv = (v*r)/r.y;
    uv += vec2(t*0.02, 0.0);
    float s = stars(uv);
    float beam = exp(-25.0*abs(sin((v.y + t*0.12)*6.28318)));
    vec3 col = vec3(0.0);
    col += s * vec3(0.35,0.62,1.0);
    col += beam * vec3(0.0,0.92,1.0);
    gl_FragColor = vec4(col, 1.0);
  }`;
  
  const shader = (type: number, src: string) => { const sh = gl!.createShader(type)!; gl!.shaderSource(sh, src); gl!.compileShader(sh); return sh; };
  const pr = gl.createProgram()!;
  gl.attachShader(pr, shader(gl.VERTEX_SHADER, vsSrc));
  gl.attachShader(pr, shader(gl.FRAGMENT_SHADER, fsSrc));
  gl.linkProgram(pr);
  gl.useProgram(pr);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  
  const loc = gl.getAttribLocation(pr, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uR = gl.getUniformLocation(pr, 'r');
  const uT = gl.getUniformLocation(pr, 't');

  let animationFrameId: number;

  const fitCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
  };

  const draw = (ts: number) => {
    gl!.uniform2f(uR, canvas.width, canvas.height);
    gl!.uniform1f(uT, ts * 0.001);
    gl!.drawArrays(gl.TRIANGLES, 0, 6);
    animationFrameId = requestAnimationFrame(draw);
  };

  fitCanvas();
  animationFrameId = requestAnimationFrame(draw);
  
  window.addEventListener('resize', fitCanvas);

  return () => {
    window.removeEventListener('resize', fitCanvas);
    cancelAnimationFrame(animationFrameId);
  };
};


const SVGGrid: React.FC = () => (
  <svg className="grid-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="gridGlow" x1="0" x2="1">
        <stop offset="0%" stopColor="#00eaff" stopOpacity="0.0"/>
        <stop offset="50%" stopColor="#27a0ff" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="#1976ff" stopOpacity="0.0"/>
      </linearGradient>
    </defs>
    <g stroke="url(#gridGlow)" strokeWidth="0.2">
      {Array.from({ length: 21 }).map((_, i) => (
          <React.Fragment key={i}>
            <line x1={i * 5} y1={0} x2={i * 5} y2={100} />
            <line x1={0} y1={i * 5} x2={100} y2={i * 5} />
          </React.Fragment>
      ))}
    </g>
  </svg>
);

const SVGCircuit: React.FC = () => (
  <svg className="circuit-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <g>
      <path className="circuit-line dash" d="M5 15 H35 V35 H65 V15 H95"/>
      <path className="circuit-line dash slow" d="M10 60 H30 V80 H70 V60 H90"/>
      <path className="circuit-line dash" d="M5 90 H25 V70 H45 V90 H75 V70 H95"/>
      <circle className="circuit-node glow" cx="35" cy="35" r="1.2"/>
      <circle className="circuit-node" cx="65" cy="35" r="1"/>
      <circle className="circuit-node glow" cx="30" cy="80" r="1.1"/>
      <circle className="circuit-node" cx="70" cy="80" r="1"/>
      <circle className="circuit-node glow" cx="45" cy="70" r="1"/>
    </g>
  </svg>
);


const Background: React.FC = () => {
  const starfieldRef = useRef<HTMLCanvasElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);

  // Init WebGL Starfield
  useEffect(() => {
    if (starfieldRef.current) {
      const cleanup = initStarfield(starfieldRef.current);
      return cleanup;
    }
  }, []);

  // Init Scrim Effect
  useEffect(() => {
    const scrim = scrimRef.current;
    if (!scrim) return;

    const updateScrim = () => {
      const t = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.8)));
      const opacity = 0.0 + t * 0.35;
      const blur = (t * 6).toFixed(1) + 'px';
      scrim.style.setProperty('--scrim-opacity', String(opacity));
      scrim.style.setProperty('--scrim-blur', blur);
    };

    window.addEventListener('scroll', updateScrim, { passive: true });
    window.addEventListener('resize', updateScrim);
    updateScrim();

    return () => {
      window.removeEventListener('scroll', updateScrim);
      window.removeEventListener('resize', updateScrim);
    };
  }, []);

  // Init YouTube Background
  useEffect(() => {
    const VID = 'G2WfEItBhY8';
    
    const onPlayerReady = (event: any) => {
      const pref = localStorage.getItem('uts_video_muted');
      if (pref === 'no') {
        event.target.unMute();
      } else {
        event.target.mute();
      }
      event.target.playVideo();
    };

    const onPlayerStateChange = (event: any) => {
      if (event.data === window.YT.PlayerState.ENDED) {
        event.target.seekTo(0);
      }
    };
    
    const createPlayer = () => {
       if (document.getElementById('yt-player') && !ytPlayerRef.current) {
         ytPlayerRef.current = new window.YT.Player('yt-player', {
            videoId: VID,
            playerVars: { autoplay: 1, controls: 0, mute: 1, loop: 1, playlist: VID, modestbranding: 1, rel: 0, showinfo: 0, fs: 0, cc_load_policy: 0, iv_load_policy: 3, playsinline: 1 },
            events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange }
        });
       }
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    // Expose player instance for mute toggle
    (window as any).utsYTPlayer = ytPlayerRef;

    return () => {
        if(ytPlayerRef.current && ytPlayerRef.current.destroy) {
            ytPlayerRef.current.destroy();
        }
        (window as any).utsYTPlayer = null;
    }

  }, []);

  return (
    <>
      <div id="yt-bg"><div id="yt-player"></div></div>
      <div ref={scrimRef} id="scrim"></div>
      <div className="mesh-bg" aria-hidden="true"></div>
      <canvas ref={starfieldRef} id="starfield"></canvas>
      <SVGGrid />
      <SVGCircuit />
    </>
  );
};

export default Background;