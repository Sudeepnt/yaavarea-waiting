
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import { Earth } from './components/Earth';
import { getFuturisticTeaser } from './services/geminiService';
import { Twitter, Globe, ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  const [teaser, setTeaser] = useState("Initializing...");

  useEffect(() => {
    getFuturisticTeaser().then(setTeaser);
  }, []);

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden text-white font-inter">
      <Suspense fallback={<div className="flex items-center justify-center h-full text-white font-orbitron animate-pulse">LOADING_DATA_STREAM...</div>}>
        <Canvas camera={{ position: [0, 0, 8], fov: 30 }} gl={{ antialias: true, alpha: true }}>
          <color attach="background" args={['#000']} />
          <ScrollControls pages={3} damping={0.1}>
            <Earth />
            <Scroll html>
              <div className="w-screen bg-transparent">
                
                {/* HERO SECTION */}
                <section className="h-screen w-full flex flex-col justify-center items-center px-6 text-center">
                  <h1 className="text-7xl md:text-[10rem] font-orbitron font-bold text-white mb-6 tracking-tighter text-glow-white">
                    YAAV<span className="opacity-30">AREA</span>
                  </h1>
                  <p className="text-[10px] md:text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed uppercase tracking-[0.6em]">
                    The Future of <span className="text-white">Local Development</span>.
                  </p>
                </section>

                {/* ZOOM SECTION (The text appears here in 3D) */}
                <section className="h-screen w-full pointer-events-none"></section>

                {/* FINAL SECTION - FORM */}
                <section className="h-screen w-full flex flex-col justify-center items-center px-6">
                  <div className="max-w-md w-full bg-black/80 backdrop-blur-3xl p-12 border border-red-900/30 shadow-[0_0_100px_rgba(0,0,0,1)] relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-red-600"></div>
                    
                    <div className="flex flex-col items-center text-center mb-10">
                      <h2 className="text-5xl font-orbitron font-bold text-white tracking-tighter mb-2">SOFTWARE</h2>
                      <h2 className="text-5xl font-orbitron font-bold text-gray-700 tracking-tighter">INCOMING</h2>
                    </div>

                    <div className="space-y-6">
                      <input 
                        type="email" 
                        placeholder="UPLINK@SECTOR.COM" 
                        className="w-full bg-black border border-white/10 p-5 text-white font-orbitron text-[10px] text-center focus:border-red-600 outline-none transition-all"
                      />
                      <button className="w-full bg-white text-black font-orbitron py-5 text-[11px] uppercase font-black hover:bg-red-600 hover:text-white transition-all">
                        REGISTER FOR ALPHA
                      </button>
                    </div>

                    <div className="mt-10 text-center opacity-40">
                       <p className="text-[8px] font-orbitron text-gray-500 uppercase tracking-widest">{teaser}</p>
                    </div>
                  </div>
                </section>

              </div>
            </Scroll>
          </ScrollControls>
        </Canvas>
      </Suspense>

      {/* HUD OVERLAYS */}
      <nav className="fixed top-0 left-0 w-full p-8 md:p-14 flex justify-between items-start z-50 pointer-events-none">
        <div className="flex items-center space-x-6 pointer-events-auto">
          <div className="w-10 h-10 border border-white flex items-center justify-center bg-black/80">
             <Globe className="text-white" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron text-2xl text-white tracking-[0.2em] font-bold">YAAVAREA</span>
            <span className="font-orbitron text-[8px] text-gray-700 tracking-[0.4em] uppercase">Sector_080_GRID</span>
          </div>
        </div>
        <div className="pointer-events-auto">
          <Twitter className="text-gray-600 hover:text-white cursor-pointer" size={24} />
        </div>
      </nav>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-30 animate-bounce pointer-events-none">
        <ChevronDown className="text-white" size={30} />
      </div>
    </div>
  );
};

export default App;
