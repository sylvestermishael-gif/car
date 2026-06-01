import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Key, FastForward, Activity, Power, ShieldAlert } from 'lucide-react';

interface DrivingTransitionProps {
  onComplete: () => void;
}

export default function DrivingTransition({ onComplete }: DrivingTransitionProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [isEngineOn, setIsEngineOn] = useState(false);

  const startIgnition = () => {
    if (isStarting) return;
    setIsStarting(true);
    
    // Step 1: Turn engine "on" (rumble effect) after a split second
    setTimeout(() => {
      setIsEngineOn(true);
    }, 400);

    // Step 2: Drive off and transition to catalogue after driving animation finishes
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] flex flex-col justify-between overflow-hidden font-sans text-neutral-200 select-none">
      
      {/* Background Video - Loaded directly from Roverse link! */}
      <video
        src="https://roverse.keldra.dev/hero.webm"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-65 pointer-events-none z-0"
      />

      {/* Deep dark red ambient aura on top of video overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/70 pointer-events-none z-1" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_90%_at_50%_-20%,rgba(139,0,0,0.22),rgba(0,0,0,0))] pointer-events-none z-1" />
      
      {/* Structural Sci-Fi Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px] z-1" 
      />

      {/* Kinetic flight/speed lines shown during launching */}
      {isEngineOn && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-gradient-to-r from-transparent via-[#8B0000]/60 to-transparent h-[2px] rounded"
              initial={{ 
                x: '100vw', 
                y: `${10 + i * 6}%`, 
                width: Math.random() * 300 + 200 
              }}
              animate={{ 
                x: '-180vw' 
              }}
              transition={{ 
                duration: Math.random() * 0.3 + 0.2, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
          ))}
        </div>
      )}

      {/* Top Header / Branding */}
      <header className="w-full h-20 px-8 md:px-12 flex justify-between items-center z-20 border-b border-[#111] backdrop-blur-sm bg-black/20">
        <div className="text-xl font-bold tracking-[0.35em] flex items-center text-[#8B0000] font-mono">
          AUTOAVENTUS
        </div>
        
        <span className="text-[9px] font-mono tracking-[0.35em] text-zinc-400 font-bold uppercase">
          ORBITAL ANCHOR // VERSION 2.06
        </span>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-center relative z-20">
        
        {/* Title Elements with staggered layout */}
        <div className="text-center mb-10 md:mb-12 relative">
          <motion.p 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[#8B0000] font-mono tracking-[0.4em] uppercase text-xs font-black mb-4"
          >
            EXTRATERRESTRIAL SHOWROOM
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-7xl md:text-9xl font-serif italic font-black tracking-tighter text-[#8B0000] drop-shadow-[0_0_40px_rgba(139,0,0,0.45)] leading-none uppercase"
          >
            AUTOAVENTUS
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-zinc-300 text-[11px] sm:text-xs uppercase tracking-[0.25em] max-w-xl mx-auto mt-6 px-4 font-bold leading-relaxed font-mono"
          >
            "Discover the future of off-world motion. Enter the metaverse showroom of hyper-luxury explorer vehicles."
          </motion.p>
        </div>

        {/* Ambient background glow and interactive trigger button */}
        <div className="flex flex-col items-center max-w-xl my-6 relative min-h-[140px] justify-center">
          {/* Glowing Red Underglow under the launch zone */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <motion.div 
              className="w-80 h-32 bg-[#8B0000]/15 blur-[60px] rounded-full"
              animate={isEngineOn ? {
                scale: [1, 1.25, 0.95, 1.15, 1],
                opacity: [0.4, 0.8, 0.35, 0.85, 0.4],
              } : {
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.4, 0.3]
              }}
              transition={{
                duration: isEngineOn ? 0.15 : 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <motion.button
              id="start-ignition-btn"
              onClick={startIgnition}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`relative group px-12 py-4 rounded-sm font-mono font-bold tracking-[0.3em] uppercase text-[10px] transition-all duration-300 cursor-pointer overflow-hidden ${
                isStarting
                  ? 'bg-zinc-900 border border-[#8B0000]/50 text-[#8B0000] px-14 shadow-[0_0_15px_rgba(139,0,0,0.15)]'
                  : 'bg-[#8B0000] text-white shadow-[0_0_25px_rgba(139,0,0,0.5)] hover:shadow-[0_0_40px_rgba(139,0,0,0.75)]'
              }`}
            >
              {/* Mirror reflecting glare highlight on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <span className="flex items-center gap-3 justify-center">
                {isStarting ? (
                  <>
                    <FastForward className="w-3.5 h-3.5 animate-pulse text-red-400" />
                    <span>THRUST ENGAGED... READY FOR ORBIT</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-3.5 h-3.5 text-zinc-100 animate-pulse" />
                    <span>LAUNCH ORBITAL SHOWROOM</span>
                  </>
                )}
              </span>
            </motion.button>
            
            <p className="text-zinc-400 text-[9px] font-mono mt-5 tracking-[0.2em] px-4 font-bold uppercase text-center bg-black/45 py-1 px-3 border border-zinc-900/60 rounded max-w-sm">
              {isStarting ? "ENGAGING MOVEMENT GRID INITIATOR..." : "LAUNCH THE QUANTUM EXPLORER INTERFACE"}
            </p>
          </div>
        </div>
      </main>

      {/* Footer Features */}
      <footer className="w-full px-8 py-8 border-t border-[#111] z-20 bg-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-950/70 p-5 rounded-sm border border-[#111]">
            <h4 className="text-[#8B0000] text-[9.5px] font-mono uppercase tracking-widest font-black mb-2 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" /> Planetary Heritage
            </h4>
            <p className="text-zinc-500 text-[10.5px] leading-relaxed uppercase tracking-tighter">Exclusively detailing offworld machinery engineered specifically for extreme atmosphere travel and elite lunar operations.</p>
          </div>
          
          <div className="bg-zinc-950/70 p-5 rounded-sm border border-[#111]">
            <h4 className="text-[#8B0000] text-[9.5px] font-mono uppercase tracking-widest font-black mb-2 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> Quantum Telemetry
            </h4>
            <p className="text-zinc-500 text-[10.5px] leading-relaxed uppercase tracking-tighter">Real-time stats sheet, adjustable vector output trim packages, and active paintwork coatings configured for celestial flight.</p>
          </div>

          <div className="bg-zinc-950/70 p-5 rounded-sm border border-[#111]">
            <h4 className="text-[#8B0000] text-[9.5px] font-mono uppercase tracking-widest font-black mb-2 flex items-center gap-2">
              <Power className="w-3.5 h-3.5" /> Master Inventory Vault
            </h4>
            <p className="text-zinc-500 text-[10.5px] leading-relaxed uppercase tracking-tighter">Gated administrative console enabling instant orbital configuration, price metrics tuning, and drafted visibility controls.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
