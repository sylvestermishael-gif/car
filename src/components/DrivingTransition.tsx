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
      
      {/* Background Video - Loaded directly with smooth zoom scaling tracking ignition status */}
      <motion.div 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
        animate={{
          scale: isEngineOn ? 1.12 : 1,
          filter: 'none'
        }}
        transition={{
          duration: 2.2,
          ease: [0.16, 1, 0.3, 1] // ultra premium custom cubic-bezier ease-out
        }}
      >
        <video
          src="https://roverse.keldra.dev/hero.webm"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-100"
        />
      </motion.div>

      {/* Deep dark red ambient aura and light edge vignette for optimal video clarity and contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40 pointer-events-none z-1" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25 pointer-events-none z-1" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_90%_at_50%_50%,transparent,rgba(0,0,0,0.4))] pointer-events-none z-1" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_90%_at_50%_-20%,rgba(139,0,0,0.18),rgba(0,0,0,0))] pointer-events-none z-1" />
      
      {/* Structural Sci-Fi Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px] z-1" 
      />

      {/* Kinetic flight/speed lines shown during launching */}
      {isEngineOn && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-gradient-to-r from-transparent via-[#8B0000]/70 to-transparent h-[1.5px] rounded"
              initial={{ 
                x: '100vw', 
                y: `${8 + i * 5}%`, 
                width: Math.random() * 400 + 150 
              }}
              animate={{ 
                x: '-200vw' 
              }}
              transition={{ 
                duration: Math.random() * 0.25 + 0.15, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
          ))}
        </div>
      )}
      
      {/* Top Header / Branding */}
      <header className="w-full h-16 sm:h-20 px-6 sm:px-8 md:px-12 flex justify-between items-center z-20 border-b border-[#111] backdrop-blur-sm bg-black/20">
        <div className="text-lg sm:text-xl font-bold tracking-[0.35em] flex items-center text-[#8B0000] font-mono">
          AUTOAVENTUS
        </div>
        
        <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.2em] sm:tracking-[0.35em] text-zinc-400 font-bold uppercase">
          METROPOLITAN CATALOGUE // EST. 2024
        </span>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-4 flex flex-col justify-center items-center relative z-20">
        
        {/* Title Elements with staggered layout */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8 relative max-w-3xl">
          <motion.p 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[#8B0000] font-mono tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[10px] sm:text-xs font-black mb-2.5 select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
          >
            HIGH-PERFORMANCE EXOTIC AUTOMOTIVE
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl xs:text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-serif italic font-black tracking-tighter text-[#8B0000] drop-shadow-[0_15px_45px_rgba(0,0,0,0.98)] [text-shadow:0_8px_30px_rgba(0,0,0,0.95)] leading-none uppercase"
          >
            AUTOAVENTUS
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-zinc-300 text-[10px] sm:text-xs uppercase tracking-[0.2em] max-w-xl mx-auto mt-3 px-4 font-bold leading-relaxed font-mono drop-shadow-[0_4px_12px_rgba(0,0,0,0.98)] bg-black/35 backdrop-blur-[1px] py-1.5 rounded-sm"
          >
            "Discover the definition of mastercrafted motion. Enter our private metropolitan showroom of grand tourers and super sports cars."
          </motion.p>
        </div>

        {/* Ambient background glow and interactive trigger button */}
        <div className="flex flex-col items-center max-w-xl my-3 sm:my-5 relative min-h-[120px] justify-center w-full px-4">
          {/* Glowing Red Underglow under the launch zone */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <motion.div 
              className="w-64 sm:w-80 h-24 sm:h-32 bg-[#8B0000]/15 blur-[50px] sm:blur-[60px] rounded-full"
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

          <div className="relative z-10 flex flex-col items-center w-full">
            <motion.button
              id="start-ignition-btn"
              onClick={startIgnition}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative group w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-4 rounded-sm font-mono font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[9px] sm:text-[10px] transition-all duration-300 cursor-pointer overflow-hidden ${
                isStarting
                  ? 'bg-zinc-900 border border-[#8B0000]/50 text-[#8B0000] px-10 sm:px-14 shadow-[0_0_15px_rgba(139,0,0,0.15)]'
                  : 'bg-[#8B0000] text-white shadow-[0_0_25px_rgba(139,0,0,0.5)] hover:shadow-[0_0_40px_rgba(139,0,0,0.75)]'
              }`}
            >
              {/* Mirror reflecting glare highlight on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <span className="flex items-center gap-2.5 justify-center">
                {isStarting ? (
                  <>
                    <FastForward className="w-3.5 h-3.5 animate-pulse text-red-400" />
                    <span>ENGINE INITIATED... WELCOME ABOARD</span>
                  </>
                ) : (
                  <>
                    <Key className="w-3.5 h-3.5 text-zinc-100 animate-pulse" />
                    <span>ENTER EXECUTIVE SHOWROOM</span>
                  </>
                )}
              </span>
            </motion.button>
            
            <p className="text-zinc-400 text-[8px] sm:text-[9px] font-mono mt-4 sm:mt-5 tracking-[0.15em] sm:tracking-[0.2em] px-3 py-1 border border-zinc-900/60 rounded max-w-sm text-center bg-black/45 select-none font-bold uppercase">
              {isStarting ? "POWERING TWIN-TURBOCHARGED ENGINE UNIT..." : "CLICK TO IGNITE SHOWROOM DISCOVERY CYCLE"}
            </p>
          </div>
        </div>
      </main>

      {/* Footer Features */}
      <footer className="w-full px-6 py-6 border-t border-neutral-900 z-20 bg-black/85 backdrop-blur-md text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold">
          <div>© {new Date().getFullYear()} AUTOAVENTUS. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-4">
            <span>OFFLINE PERSISTENCE ACTIVE</span>
            <span className="text-zinc-800">//</span>
            <span>METROPOLITAN LAGOS SHOWROOM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
