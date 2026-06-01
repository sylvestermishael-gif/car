import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, ShieldAlert, Zap, Cpu, Compass, Gauge, Heart, MessageSquare, Mail, Phone, MessageCircle } from 'lucide-react';
import { Car, TrimLevel, ColorOption } from '../types';
import { simplifyCategory, simplifyEngine } from '../utils';

interface SpecsModalProps {
  car: Car;
  onClose: () => void;
}

export default function SpecsModal({ car, onClose }: SpecsModalProps) {
  // Configured states
  const [selectedColor, setSelectedColor] = useState<ColorOption>(car.colors[0] || { name: 'Standard', hex: '#666', imageUrl: car.mainImage });
  const [selectedTrim, setSelectedTrim] = useState<TrimLevel>(car.trims[0] || {
    id: 'default',
    name: 'Standard Special',
    price: car.startingPrice,
    engine: car.performance.engine,
    horsepower: car.performance.horsepower,
    acceleration: car.performance.acceleration,
    topSpeed: car.performance.topSpeed
  });
  const [activeTab, setActiveTab] = useState<'specs' | 'description'>('specs');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [waNotice, setWaNotice] = useState(false);
  const [emailNotice, setEmailNotice] = useState(false);
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  
  // Like state persistent via localStorage
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    try {
      const likedCars = JSON.parse(localStorage.getItem('liked_cars') || '{}');
      return !!likedCars[car.id];
    } catch {
      return false;
    }
  });

  const toggleLike = () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    try {
      const likedCars = JSON.parse(localStorage.getItem('liked_cars') || '{}');
      if (nextState) {
        likedCars[car.id] = true;
      } else {
        delete likedCars[car.id];
      }
      localStorage.setItem('liked_cars', JSON.stringify(likedCars));
    } catch (e) {
      console.error(e);
    }
  };

  // Synchronize dynamic elements if car changes
  useEffect(() => {
    if (car.colors && car.colors.length > 0) {
      setSelectedColor(car.colors[0]);
    }
    if (car.trims && car.trims.length > 0) {
      setSelectedTrim(car.trims[0]);
    }
  }, [car]);

  // Handle color click
  const selectColor = (color: ColorOption) => {
    setSelectedColor(color);
  };

  // Handle trim level selection - dynamically updates statistics sheet
  const selectTrim = (trim: TrimLevel) => {
    setSelectedTrim(trim);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Format price helper
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/95 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <motion.div
        id={`specs-modal-${car.id}`}
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-5xl bg-[#0c0c0c] border border-zinc-900 rounded-sm overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col max-h-[90vh]"
      >
        {/* Banner with warning and action close */}
        <div className="absolute right-6 top-6 z-45">
          <button 
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 bg-black border border-zinc-900 hover:border-[#8B0000] text-zinc-400 hover:text-white transition-all duration-300 cursor-pointer"
            title="Close specifications"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Container */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Main Top Header: Visuals Accent */}
          <div className="relative h-64 sm:h-80 md:h-[380px] bg-[#070707] flex items-center justify-center overflow-hidden p-6 border-b border-zinc-900/60">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-black/40 pointer-events-none z-10" />
            
            {/* Glowing Aura in Deep Red */}
            <div className="absolute w-[400px] h-[150px] bg-[#8B0000]/10 blur-[80px] rounded-full bottom-0 left-1/2 -translate-x-1/2" />

            <motion.img
              key={selectedColor.imageUrl}
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.35 }}
              src={selectedColor.imageUrl}
              alt={`${car.make} ${car.model} in ${selectedColor.name}`}
              className="relative z-0 max-h-[85%] max-w-[90%] object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)]"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Grid Layout containing specs and choices */}
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#0c0c0c]">
            {/* Left Column (8 cols): Spec sheet, options */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <span className="text-[#8B0000] font-mono tracking-[0.25em] text-[10px] uppercase font-bold">
                      {simplifyCategory(car.category)} // YEAR {car.year}
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-serif italic font-black text-white mt-1">
                      {car.make} <span className="text-[#8B0000]">{car.model}</span>
                    </h2>
                  </div>
                  <button
                    onClick={toggleLike}
                    className={`p-3 border rounded-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 font-mono text-[9px] tracking-wider uppercase font-bold shrink-0 ${
                      isLiked 
                        ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                        : 'bg-black border-zinc-900 text-zinc-500 hover:text-red-500 hover:border-red-500/50'
                    }`}
                    title={isLiked ? "Unlike this car" : "Like this car"}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-red-500 animate-bounce' : ''}`} />
                    <span>{isLiked ? 'Starred Car' : 'Like Car'}</span>
                  </button>
                </div>
                
                {/* Dynamic Configured Price Label */}
                <div className="flex flex-col sm:flex-row sm:items-baseline mt-3 gap-0.5 sm:gap-3">
                  <span className="text-[#8B0000] text-2xl sm:text-3xl font-extrabold tracking-tight font-mono">
                    {formatPrice(selectedTrim.price)}
                  </span>
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest leading-none mt-1 sm:mt-0 font-bold">
                    Price of selected setup: <span className="text-zinc-300 font-bold">{selectedTrim.name}</span>
                  </span>
                </div>
              </div>

              {/* Color paint configurations */}
              <div className="bg-zinc-950 p-5 rounded-sm border border-zinc-900">
                <h4 className="text-[9px] font-mono tracking-widest text-[#8B0000] uppercase font-black mb-4">
                  Choose Exterior Color
                </h4>
                <div className="flex flex-wrap gap-3.5 items-center">
                  {car.colors.map((color) => {
                    const isActive = selectedColor.name === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => selectColor(color)}
                        className={`group relative flex items-center justify-center p-0.5 rounded-full border transition-all duration-300 cursor-pointer ${
                          isActive 
                            ? 'border-[#8B0000] scale-110 shadow-[0_0_15px_rgba(139,0,0,0.5)]' 
                            : 'border-zinc-800 hover:border-zinc-500'
                        }`}
                        title={color.name}
                      >
                        <span 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: color.hex }}
                        >
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-white shadow" />
                          )}
                        </span>
                      </button>
                    );
                  })}
                  <span className="text-[10.5px] uppercase tracking-wider font-bold text-zinc-300 ml-2">
                    Selected Color: <span className="text-[#8B0000] font-serif italic normal-case text-base font-bold pl-1">{selectedColor.name}</span>
                  </span>
                </div>
              </div>

              {/* Trim levels selection */}
              <div>
                <h4 className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-black mb-3.5">
                  Available Option Packages
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {car.trims.map((trim) => {
                    const isActive = selectedTrim.id === trim.id;
                    return (
                      <button
                        key={trim.id}
                        onClick={() => selectTrim(trim)}
                        className={`text-left p-4 rounded-sm border transition-all duration-300 cursor-pointer ${
                          isActive 
                            ? 'bg-[#8B0000]/10 border-[#8B0000] shadow-[0_0_15px_rgba(139,0,0,0.15)]' 
                            : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`text-[11px] font-mono uppercase tracking-wider font-bold ${isActive ? 'text-[#8B0000]' : 'text-zinc-200'}`}>
                            {trim.name}
                          </span>
                          {isActive && <div className="h-1.5 w-1.5 rounded-full bg-[#8B0000]" />}
                        </div>
                        <div className="flex justify-between items-baseline mt-2.5">
                          <span className="text-zinc-500 text-[10px] font-mono">
                            Horsepower: <span className="text-zinc-300 font-bold">{trim.horsepower} HP</span>
                          </span>
                          <span className="text-xs font-bold text-zinc-100 font-mono">
                            {formatPrice(trim.price)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Overview text */}
              <div className="bg-zinc-950/65 border border-zinc-900 rounded-sm p-5">
                <div className="flex border-b border-zinc-900 mb-4 pb-2.5 gap-6">
                  <button 
                    onClick={() => setActiveTab('specs')}
                    className={`pb-1 text-[10px] font-mono tracking-widest uppercase transition-all ${
                      activeTab === 'specs' ? 'text-[#8B0000] border-b border-[#8B0000] font-black' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Specs & Details
                  </button>
                  <button 
                    onClick={() => setActiveTab('description')}
                    className={`pb-1 text-[10px] font-mono tracking-widest uppercase transition-all ${
                      activeTab === 'description' ? 'text-[#8B0000] border-b border-[#8B0000] font-black' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Car Description
                  </button>
                </div>

                {activeTab === 'specs' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-[10px] font-mono uppercase text-zinc-300">
                    <div className="flex justify-between border-b border-[#111] py-1.5 col-span-1 sm:col-span-2">
                       <span className="text-zinc-500 font-bold">NAME:</span>
                      <span className="text-white text-right font-bold">{car.make} {car.model}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#111] py-1.5">
                      <span className="text-zinc-500 font-bold">PRODUCTION:</span>
                      <span className="text-white font-bold">{car.year}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#111] py-1.5">
                      <span className="text-zinc-500 font-bold">ENGINE AND PERFORMANCE:</span>
                      <span className="text-white font-bold">{simplifyEngine(selectedTrim.engine)}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#111] py-1.5">
                      <span className="text-zinc-500 font-bold">HORSEPOWER:</span>
                      <span className="text-white font-bold">{selectedTrim.horsepower} HP</span>
                    </div>
                    <div className="flex justify-between border-b border-[#111] py-1.5">
                      <span className="text-zinc-500 font-bold">FUEL CAPACITY:</span>
                      <span className="text-white font-bold">{car.performance.fuelCapacity || '85 Liters'}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11.5px] text-zinc-400 leading-relaxed font-bold uppercase tracking-tighter italic">
                    "{car.description} Meticulously modeled with exquisite carbon textures and tuned ratios inside this magnificent machine. Ready to dominate the pavement with elegant composure and infinite limits."
                  </p>
                )}
              </div>
            </div>

            {/* Right Column (5 cols): Dyno specs & core telemetry widgets */}
            <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
              <h3 className="text-[9px] font-mono tracking-widest text-[#8B0000] uppercase font-black">
                Car Performance Stats
              </h3>

              {/* Dynamic specs indicators */}
              <div className="grid grid-cols-1 gap-4">
                {/* Speed Widget */}
                <div className="bg-zinc-950 border border-zinc-900 p-4.5 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2 w-9 h-9 bg-black border border-zinc-900 rounded-sm flex items-center justify-center text-zinc-500">
                      <Gauge className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[8px] font-mono tracking-wider text-zinc-500 uppercase block font-bold">Top Speed</span>
                      <span className="font-mono text-[14px] font-black text-white">{selectedTrim.topSpeed}</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-28 bg-zinc-950 border border-[#111] rounded-sm overflow-hidden">
                    <div 
                      className="bg-[#8B0000] h-full" 
                      style={{ 
                        width: `${Math.min(100, (parseFloat(selectedTrim.topSpeed) || 180) / 3)}%` 
                      }} 
                    />
                  </div>
                </div>

                {/* HP Widget */}
                <div className="bg-zinc-950 border border-zinc-900 p-4.5 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2 w-9 h-9 bg-black border border-zinc-900 rounded-sm flex items-center justify-center text-zinc-500">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[8px] font-mono tracking-wider text-zinc-500 uppercase block font-bold">Horsepower</span>
                      <span className="font-mono text-[14px] font-black text-white">{selectedTrim.horsepower} HP</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-28 bg-zinc-950 border border-[#111] rounded-sm overflow-hidden">
                    <div 
                      className="bg-[#8B0000] h-full" 
                      style={{ 
                        width: `${Math.min(100, selectedTrim.horsepower / 16)}%` 
                      }} 
                    />
                  </div>
                </div>

                {/* Acceleration 0-60 mph */}
                <div className="bg-zinc-950 border border-zinc-900 p-4.5 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2 w-9 h-9 bg-black border border-zinc-900 rounded-sm flex items-center justify-center text-zinc-500">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[8px] font-mono tracking-wider text-zinc-500 uppercase block font-bold">0-60 mph Time</span>
                      <span className="font-mono text-[14px] font-black text-white">{selectedTrim.acceleration}</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-28 bg-zinc-950 border border-[#111] rounded-sm overflow-hidden">
                    {/* Reverse scale because lower acceleration time is better! */}
                    <div 
                      className="bg-[#8B0000] h-full float-right" 
                      style={{ 
                        width: `${Math.max(10, 100 - (parseFloat(selectedTrim.acceleration) || 3) * 20)}%` 
                      }} 
                    />
                  </div>
                </div>
              </div>

              {/* Action purchase sheet simulated */}
              <div className="mt-2 bg-gradient-to-br from-zinc-950 to-[#0e0202] border border-zinc-900 p-6 text-center">
                <span className="text-zinc-500 text-[10px] tracking-widest uppercase block font-mono mb-2 font-bold">
                  Purchase & Booking Info
                </span>
                
                <h4 className="text-white text-xs uppercase tracking-widest font-bold mb-4">
                  Special Ordering Setup Active
                </h4>

                <button 
                  onClick={() => {
                    setCopiedNotification(true);
                    setTimeout(() => setCopiedNotification(false), 2500);
                  }}
                  className="w-full bg-[#8B0000] hover:bg-[#8B0000]/80 text-[#ffffff] font-mono text-[10px] py-3.5 px-4 rounded-sm font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(139,0,0,0.35)] transition-all cursor-pointer"
                >
                  {copiedNotification ? "✓ Booking Sent Successfully" : "Book This Car Setup"}
                </button>

                <p className="text-zinc-650 text-[8px] font-mono uppercase mt-3 mb-4 tracking-wider">
                  MODEL-ID: {car.id}-{selectedTrim.id}-{selectedColor.name.split(' ')[0].toLowerCase()}
                </p>

                {/* Divider Line */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-zinc-900" />
                  </div>
                  <div className="relative flex justify-center text-[8.5px] uppercase tracking-widest font-bold">
                    <span className="bg-[#0b0303] px-3.5 text-[#8B0000] font-mono">Reach Showroom Directly</span>
                  </div>
                </div>

                {/* Highly Accessible Interactive Template Preview Section */}
                <div className="bg-[#0f0f0f] border border-zinc-900 rounded-sm p-4 mb-4 flex flex-col gap-3.5">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                    <span className="text-[8.5px] font-mono uppercase text-zinc-500 font-bold tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] animate-pulse" />
                      Inquiry Message Preview
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const msg = `Hello Autoaventus, I really like the ${car.make} ${car.model}! I am interested in ordering it with ${selectedColor.name} paint and the ${selectedTrim.name} package. Estimated Value: ${formatPrice(selectedTrim.price)}. Please share availability details!`;
                        try {
                          navigator.clipboard.writeText(msg);
                          setWaNotice(true);
                          setTimeout(() => setWaNotice(false), 6000);
                          
                          // select text
                          const range = document.createRange();
                          const selection = window.getSelection();
                          const pElement = document.getElementById("inquiry-preview-p");
                          if (pElement && selection) {
                            range.selectNodeContents(pElement);
                            selection.removeAllRanges();
                            selection.addRange(range);
                          }
                        } catch (err) {
                          console.warn('Clipboard write error', err);
                        }
                      }}
                      className="text-[8px] font-mono text-[#8B0000] hover:text-white hover:bg-[#8B0000]/20 uppercase font-black cursor-pointer border border-[#8B0000]/30 px-2.5 py-1 rounded-sm bg-black transition-all"
                    >
                      {waNotice ? "✓ Copied!" : "Copy Text"}
                    </button>
                  </div>
                  
                  {/* Tappable container that copies and auto-selects the text */}
                  <div 
                    onClick={() => {
                      const msg = `Hello Autoaventus, I really like the ${car.make} ${car.model}! I am interested in ordering it with ${selectedColor.name} paint and the ${selectedTrim.name} package. Estimated Value: ${formatPrice(selectedTrim.price)}. Please share availability details!`;
                      try {
                        navigator.clipboard.writeText(msg);
                        setWaNotice(true);
                        setTimeout(() => setWaNotice(false), 6000);

                        // select text
                        const range = document.createRange();
                        const selection = window.getSelection();
                        const pElement = document.getElementById("inquiry-preview-p");
                        if (pElement && selection) {
                          range.selectNodeContents(pElement);
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                      } catch (err) {
                        console.warn('Clipboard write error', err);
                      }
                    }}
                    className="relative bg-black hover:bg-neutral-950 p-4 rounded-sm border border-zinc-900/80 hover:border-[#8B0000]/40 active:bg-zinc-950 transition-all cursor-pointer group select-all"
                    title="Tap to Auto-Select & Copy Inquiry Message"
                  >
                    <p id="inquiry-preview-p" className="text-[10px] text-zinc-300 font-mono italic leading-relaxed normal-case select-all">
                      "Hello Autoaventus, I really like the {car.make} {car.model}! I am interested in ordering it with {selectedColor.name} paint and the {selectedTrim.name} package. Estimated Value: {formatPrice(selectedTrim.price)}. Please share availability details!"
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[7.5px] font-mono text-[#8B0000]/80 group-hover:text-[#8B0000] transition-colors border-t border-zinc-900/80 pt-2 font-bold tracking-wider uppercase">
                      <span>⚡ TAP ANYWHERE TO COPY & SELECT</span>
                      <span className="text-[6.5px] text-zinc-650 font-normal">ID: {car.id}-{selectedTrim.id}</span>
                    </div>
                  </div>

                  {/* Simplified mobile-optimized Copy & Share Guidance */}
                  <div className="bg-[#141414] border border-[#8B0000]/25 rounded-sm p-3 text-[9.5px] font-mono leading-relaxed text-zinc-400">
                    <div className="flex items-center gap-1.5 text-white font-bold tracking-wider uppercase mb-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0 animate-pulse" />
                      One-Tap Dynamic Sharing
                    </div>
                    <span>
                      Tapping either <span className="text-white font-bold">WhatsApp</span> or <span className="text-white font-bold">Email Us</span> below instantly fills the configured specs parameters directly in the application. You can also tap the preview card above to copy the raw text to your clipboard.
                    </span>
                  </div>
                </div>

                 {/* Custom feedback message for copy action */}
                <AnimatePresence>
                  {waNotice && (
                    <motion.div 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mb-4 p-3 bg-green-950/40 border border-green-900/50 text-green-400 text-[9.5px] font-mono tracking-wider uppercase rounded-sm flex items-start gap-2.5 leading-normal"
                    >
                      <span className="w-2 h-2 rounded-full bg-green-400 block animate-pulse shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block mb-0.5">Template Ready for Paste!</span>
                        The vehicle parameters were successfully copied to your clipboard. Once the chat opens, right-click/long-press and select <span className="text-white">Paste</span>!
                      </div>
                    </motion.div>
                  )}

                  {emailNotice && (
                    <motion.div 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mb-4 p-3 bg-blue-950/40 border border-blue-900/50 text-blue-400 text-[9.5px] font-mono tracking-wider uppercase rounded-sm flex items-start gap-2.5 leading-normal"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-400 block animate-pulse shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block mb-0.5">Email Details & Address Copied!</span>
                        We copied <span className="text-white">autoaventusaa@gmail.com</span> and the spec template to your clipboard. If your email application didn't launch automatically, simply paste into any mail app!
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Routing Companion Deck */}
                <AnimatePresence>
                  {showEmailOptions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mb-4"
                    >
                      <div className="bg-[#0b0b0b] border border-blue-900/40 rounded-sm p-4 space-y-3.5">
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                          <span className="text-[8.5px] font-mono uppercase text-blue-400 font-bold tracking-wider flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 block animate-pulse" />
                            Select Email Companion
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowEmailOptions(false)}
                            className="text-[8px] font-mono text-zinc-500 hover:text-white uppercase font-black px-1.5 py-0.5 rounded-sm bg-black border border-zinc-900 hover:border-zinc-700 transition-all cursor-pointer"
                          >
                            Close [X]
                          </button>
                        </div>

                        <p className="text-[9.5px] text-zinc-400 font-mono leading-relaxed normal-case">
                          Standard email redirects can occasionally be blocked by environment constraints inside the interactive preview iframe. Choose an option below to compose directly to <span className="text-white font-bold font-mono">autoaventusaa@gmail.com</span>:
                        </p>

                        <div className="grid grid-cols-1 gap-2">
                          <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=autoaventusaa@gmail.com&su=${encodeURIComponent(
                              `Inquiry: Interested in ${car.make} ${car.model}`
                            )}&body=${encodeURIComponent(
                              `Hello Autoaventus Team,\n\nI just viewed your premium showroom and I am extremely interested in this vehicle setup:\n\n- Model: ${car.make} ${car.model}\n- Color Trim: ${selectedColor.name}\n- Layout Package: ${selectedTrim.name}\n- Outfitted Horsepower: ${selectedTrim.horsepower} HP\n- Expected Price: ${formatPrice(selectedTrim.price)}\n\nLooking forward to booking a direct consultation to view or secure this vehicle.\n\nBest Regards!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-2.5 bg-black hover:bg-[#8B0000]/10 border border-zinc-900 hover:border-[#8B0000]/60 text-neutral-300 hover:text-white rounded-sm font-mono text-[8.5px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            <span className="w-2 h-2 rounded-full bg-red-600 block shrink-0 animate-pulse" />
                            Compose with Gmail Webmail
                          </a>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-zinc-900/40">
                          <button
                            type="button"
                            onClick={() => {
                              try {
                                navigator.clipboard.writeText("autoaventusaa@gmail.com");
                                setEmailNotice(true);
                                setTimeout(() => setEmailNotice(false), 7000);
                              } catch (err) {
                                console.warn(err);
                              }
                            }}
                            className="flex-1 py-1.5 bg-zinc-950 border border-zinc-900 hover:border-blue-500/50 text-blue-400 font-mono text-[8.5px] font-bold uppercase rounded-sm cursor-pointer transition-all"
                          >
                            Copy Email
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const emailBody = `Hello Autoaventus Team,\n\nI just viewed your premium showroom and I am extremely interested in this vehicle setup:\n\n- Model: ${car.make} ${car.model}\n- Color Trim: ${selectedColor.name}\n- Layout Package: ${selectedTrim.name}\n- Outfitted Horsepower: ${selectedTrim.horsepower} HP\n- Expected Price: ${formatPrice(selectedTrim.price)}\n\nLooking forward to booking a direct consultation to view or secure this vehicle.\n\nBest Regards!`;
                              try {
                                navigator.clipboard.writeText(emailBody);
                                setEmailNotice(true);
                                setTimeout(() => setEmailNotice(false), 7000);
                              } catch (err) {
                                console.warn(err);
                              }
                            }}
                            className="flex-1 py-1.5 bg-zinc-950 border border-zinc-900 hover:border-blue-500/50 text-blue-400 font-mono text-[8.5px] font-bold uppercase rounded-sm cursor-pointer transition-all"
                          >
                            Copy Spec Draft
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dynamic Contact Deck */}
                <div className="grid grid-cols-3 gap-2.5">
                  <a 
                    href={`https://wa.me/2347082361899?text=${encodeURIComponent(
                      `Hello Autoaventus, I really like the ${car.make} ${car.model}! I am interested in ordering it with ${selectedColor.name} paint and the ${selectedTrim.name} package. Estimated Value: ${formatPrice(selectedTrim.price)}. Please share availability details!`
                    )}`}
                    onClick={() => {
                      const textMessage = `Hello Autoaventus, I really like the ${car.make} ${car.model}! I am interested in ordering it with ${selectedColor.name} paint and the ${selectedTrim.name} package. Estimated Value: ${formatPrice(selectedTrim.price)}. Please share availability details!`;
                      try {
                        navigator.clipboard.writeText(textMessage);
                        setWaNotice(true);
                        setTimeout(() => setWaNotice(false), 6000);
                      } catch (err) {
                        console.warn('Clipboard write error', err);
                      }
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 bg-green-950/20 border border-green-900/40 hover:border-green-500/80 hover:bg-green-950/40 text-green-400 hover:text-green-300 transition-all rounded-sm group font-mono text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 mb-1 text-green-500 group-hover:scale-110 transition-transform" />
                    <span>WhatsApp</span>
                  </a>

                  <button 
                    type="button"
                    onClick={() => {
                      setShowEmailOptions(!showEmailOptions);
                      const emailBody = `Hello Autoaventus Team,\n\nI just viewed your premium showroom and I am extremely interested in this vehicle setup:\n\n- Model: ${car.make} ${car.model}\n- Color Trim: ${selectedColor.name}\n- Layout Package: ${selectedTrim.name}\n- Outfitted Horsepower: ${selectedTrim.horsepower} HP\n- Expected Price: ${formatPrice(selectedTrim.price)}\n\nLooking forward to booking a direct consultation to view or secure this vehicle.\n\nBest Regards!`;
                      try {
                        navigator.clipboard.writeText(emailBody);
                        setEmailNotice(true);
                        setTimeout(() => setEmailNotice(false), 8000);
                      } catch (err) {
                        console.warn('Clipboard write error', err);
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-3 transition-all rounded-sm group font-mono text-[9px] font-bold uppercase tracking-wider cursor-pointer ${
                      showEmailOptions 
                        ? 'bg-blue-900/30 border-blue-400/80 text-blue-300' 
                        : 'bg-blue-950/20 border-blue-900/40 hover:border-blue-500/80 hover:bg-blue-950/40 text-blue-400 hover:text-blue-300'
                    }`}
                  >
                    <Mail className="w-5 h-5 mb-1 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span>Email Us</span>
                  </button>

                  <a 
                    href="tel:+2347082361899"
                    className="flex flex-col items-center justify-center p-3 bg-red-950/20 border border-red-900/40 hover:border-red-500/80 hover:bg-red-950/40 text-red-400 hover:text-red-300 transition-all rounded-sm group font-mono text-[9px] font-bold uppercase tracking-wider"
                  >
                    <Phone className="w-5 h-5 mb-1 text-red-500 group-hover:scale-110 transition-transform" />
                    <span>Direct Call</span>
                  </a>
                </div>
              </div>

              {/* High-res alternate images strip */}
              {car.images && car.images.length > 0 && (
                <div className="mt-2">
                  <span className="text-[8px] font-mono tracking-widest text-zinc-500 uppercase block mb-3 font-bold">
                    More Photos
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    {car.images.slice(0, 3).map((img, i) => (
                      <div key={i} className="h-16 rounded-sm bg-black border border-zinc-900 overflow-hidden group">
                        <img 
                          src={img} 
                          alt="Alternate view" 
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-350"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
