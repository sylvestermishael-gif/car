import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Gauge, Flame, Zap } from 'lucide-react';
import { Car } from '../types';
import { simplifyCategory } from '../utils';

interface CarCardProps {
  car: Car;
  onSelect: (car: Car) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Custom states for 3D Tilt calculations
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glintX, setGlintX] = useState(50);
  const [glintY, setGlintY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  // Math tracking relative pointer offsets
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Coordinates relative to card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Convert offsets to rotation degrees (range -10 to +10)
    const degX = -(mouseY / (height / 2)) * 10;
    const degY = (mouseX / (width / 2)) * 10;

    setRotateX(degX);
    setRotateY(degY);

    // Dynamic specular highlight reflection tracking coordinates
    const specularX = ((e.clientX - rect.left) / width) * 100;
    const specularY = ((e.clientY - rect.top) / height) * 100;
    setGlintX(specularX);
    setGlintY(specularY);
  };

  // Reset orientation on departure
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  // Price layout formatting
  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(car.startingPrice);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(car)}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: isHovered ? 'none' : 'transform 0.5s ease-out',
      }}
      className="relative bg-[#0d0d0d] border border-zinc-900 overflow-hidden cursor-pointer group shadow-[0_12px_40px_rgba(0,0,0,0.85)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(139,0,0,0.35)] hover:border-[#8B0000] focus-within:border-[#8B0000] transition-all duration-300 transform-style-3d select-none"
    >
      {/* Immersive Specular Highlight Glint Overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-25 pointer-events-none z-15 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glintX}% ${glintY}%, rgba(255,255,255,0.5), transparent 45%)`
        }}
      />

      {/* Red Ambient Gloom Backdrop inside Card */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-10" />
      
      {/* Category Tag Flag */}
      <div className="absolute left-4 top-4 z-20 flex gap-1.5 items-center">
        <span className="bg-[#8B0000] text-white font-mono text-[8px] font-bold px-2 py-1 tracking-widest uppercase">
          {simplifyCategory(car.category)}
        </span>
        {car.engineType === 'Hybrid' && (
          <span className="bg-black/75 border border-zinc-800 text-zinc-400 font-mono text-[8.5px] px-2 py-0.5 tracking-wider">
            HYBRID
          </span>
        )}
      </div>

      {/* Top Main Render Area */}
      <div className="relative h-48 sm:h-54 overflow-hidden bg-[#070707] flex items-center justify-center p-6 border-b border-zinc-900/60">
        {/* Soft backlighting */}
        <div className="absolute w-44 h-16 bg-[#8B0000]/10 blur-[40px] rounded-full bottom-2" />

        <img
          src={car.mainImage}
          alt={`${car.make} ${car.model}`}
          className="relative max-h-[85%] max-w-[90%] object-contain scale-100 group-hover:scale-105 transition-all duration-300 drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] z-0"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Frame Bottom description, stats */}
      <div className="p-6 relative z-20 bg-zinc-950">
        <span className="text-zinc-500 font-mono text-[9px] tracking-[0.2em] uppercase font-bold block mb-1">
          {car.make}
        </span>
        
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-2xl font-serif italic text-white group-hover:text-[#8B0000] transition-colors duration-300">
            {car.model}
          </h2>
          <span className="text-sm font-bold text-[#8B0000] font-mono">
            {formattedPrice}
          </span>
        </div>

        {/* Quick Specs telemetry grid in Mono labels */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-zinc-900 text-center font-mono my-4">
          <div className="flex flex-col items-center">
            <Gauge className="w-3.5 h-3.5 text-zinc-650 mb-1" />
            <span className="text-[8px] text-zinc-500 uppercase block leading-none font-bold">Top Speed</span>
            <span className="text-white text-[10.5px] font-bold mt-1 tracking-tight">{car.performance.topSpeed}</span>
          </div>
          <div className="flex flex-col items-center border-l border-r border-zinc-900">
            <Flame className="w-3.5 h-3.5 text-zinc-650 mb-1" />
            <span className="text-[8px] text-zinc-500 uppercase block leading-none font-bold">Horsepower</span>
            <span className="text-white text-[10.5px] font-bold mt-1 tracking-tight">{car.performance.horsepower} hp</span>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="w-3.5 h-3.5 text-zinc-650 mb-1" />
            <span className="text-[8px] text-zinc-500 uppercase block leading-none font-bold">0-60 mph</span>
            <span className="text-white text-[10.5px] font-bold mt-1 tracking-tight">{car.performance.acceleration}</span>
          </div>
        </div>

        {/* Action interactive button line */}
        <div className="w-full flex items-center justify-between mt-2">
          <span className="text-[9px] font-mono text-zinc-500">YEAR: {car.year}</span>
          
          <button className="text-[9px] border border-zinc-800 group-hover:border-[#8B0000] group-hover:bg-[#8B0000] group-hover:text-white px-3.5 py-1.5 uppercase font-bold text-zinc-400 hover:text-white transition-all duration-300 tracking-wider">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
