import React, { useState, useEffect } from 'react';
import Preloader from './components/Preloader';
import Background from './components/Background';
import MainContent from './components/MainContent';
import UIChrome from './components/UIChrome';
import useGsapAnimations from './hooks/useGsapAnimations';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.lang = 'en';
    document.documentElement.classList.add('scroll-smooth');
  }, []);

  useGsapAnimations(!loading);

  return (
    <>
      <Background />
      {loading && <Preloader onLoaded={() => setLoading(false)} />}
      <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
        <UIChrome>
          <main id="top" className="relative z-10">
            <MainContent />
          </main>
        </UIChrome>
      </div>
    </>
  );
};

export default App;