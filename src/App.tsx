import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SlidersHorizontal, Search, Settings, ShieldAlert, Sparkles, Compass, 
  Trash2, Plus, RefreshCw, Layers, DollarSign, X, HelpCircle, KeyRound, Wrench 
} from 'lucide-react';
import { Car, FilterState, EngineTypeFilter } from './types';
import { INITIAL_CARS } from './data';
import DrivingTransition from './components/DrivingTransition';
import SpecsModal from './components/SpecsModal';
import AdminPanel from './components/AdminPanel';
import CarCard from './components/CarCard';

export default function App() {
  // Screen router: 'landing' | 'catalog' | 'services' | 'brands' | 'admin'
  const [currentView, setCurrentView] = useState<'landing' | 'catalog' | 'services' | 'brands' | 'admin'>('landing');

  // Secret code keyboard override system state
  const [keySequence, setKeySequence] = useState<string>('');
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overridePasscode, setOverridePasscode] = useState('');
  const [overrideError, setOverrideError] = useState('');

  // Handle keyboard security override trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }
      const char = e.key.toLowerCase();
      if (/^[a-z0-9]$/.test(char)) {
        setKeySequence(prev => {
          const next = (prev + char).slice(-15);
          if (next.endsWith('aventus') || next.endsWith('admin') || next.endsWith('vault')) {
            setShowOverrideModal(true);
            return '';
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Master local database synced with standard storage
  const [cars, setCars] = useState<Car[]>(() => {
    const cached = localStorage.getItem('autoaventus_showroom_cars');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Clean migration for prices under 4M: if any car's startingPrice is less than 4,000,000, force reload defaults to align with new Naira Millions pricing
        if (Array.isArray(parsed) && parsed.some(c => c.startingPrice < 4000000)) {
          localStorage.removeItem('autoaventus_showroom_cars');
          return INITIAL_CARS;
        }
        return parsed;
      } catch (err) {
        console.error("Corrupted database found in cache. Seeding defaults.", err);
      }
    }
    return INITIAL_CARS;
  });

  // Selected car for modal view
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Active Offworld Booking state persistent logs
  const [bookings, setBookings] = useState<any[]>(() => {
    const cached = localStorage.getItem('autoaventus_showroom_bookings');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    carModel: '',
    date: ''
  });

  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.carModel || !bookingForm.date) {
      alert("Please fill out all required reservation fields.");
      return;
    }
    const newBooking = {
      id: 'bk-' + Date.now(),
      name: bookingForm.name,
      email: bookingForm.email,
      carModel: bookingForm.carModel,
      date: bookingForm.date
    };
    const updated = [...bookings, newBooking];
    setBookings(updated);
    localStorage.setItem('autoaventus_showroom_bookings', JSON.stringify(updated));
    setBookingSuccess(`Drive Reserved! ${bookingForm.name.toUpperCase()} is scheduled with ${bookingForm.carModel.toUpperCase()} for ${bookingForm.date}. Contact email sent to ${bookingForm.email}.`);
    setBookingForm({ name: '', email: '', carModel: '', date: '' });
    setTimeout(() => {
      setBookingSuccess(null);
    }, 8000);
  };

  const deleteBooking = (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem('autoaventus_showroom_bookings', JSON.stringify(updated));
  };

  // Scroll smoothly to screen anchors
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Dynamic filter conditions state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    maxPrice: 450000000,
    engineType: 'All',
    year: 'All'
  });

  const [mobileFiltersExpanded, setMobileFiltersExpanded] = useState(false);

  // Persist master state whenever database undergoes modification
  useEffect(() => {
    localStorage.setItem('autoaventus_showroom_cars', JSON.stringify(cars));
  }, [cars]);

  // Reset Master Database
  const resetMasterDatabase = () => {
    setCars(INITIAL_CARS);
    alert("Success: Showroom default vehicles have been restored.");
  };

  // Callback to handle updating central data array
  const handleUpdateDatabase = (updatedCars: Car[]) => {
    setCars(updatedCars);
  };

  // Reset filters state
  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      maxPrice: 450000000,
      engineType: 'All',
      year: 'All'
    });
  };

  // Filter cars block
  const filteredCars = cars.filter((car) => {
    // 1. Must be published by the administrator on the public catalog
    if (!car.isPublic) return false;

    // 2. Keyword match
    const query = filters.searchQuery.toLowerCase().trim();
    if (query) {
      const matchMake = car.make.toLowerCase().includes(query);
      const matchModel = car.model.toLowerCase().includes(query);
      const matchCat = car.category.toLowerCase().includes(query);
      if (!matchMake && !matchModel && !matchCat) return false;
    }

    // 3. Price ceiling constraint
    if (car.startingPrice > filters.maxPrice) return false;

    // 4. Engine match
    if (filters.engineType !== 'All') {
      if (car.engineType !== filters.engineType) return false;
    }

    // 5. Build year specification match
    if (filters.year !== 'All') {
      if (car.year !== Number(filters.year)) return false;
    }

    return true;
  });

  // Determine available model years for dynamic dropdown
  const uniqueYears = Array.from(new Set(cars.map(c => c.year))).sort((a: number, b: number) => b - a);

  // Format monetary figures for layout
  const formatCompactPrice = (num: number) => {
    if (num >= 1000000) {
      return `₦${(num / 1000000).toFixed(2)}M`;
    }
    return `₦${(num / 1000).toFixed(0)}K`;
  };

  // Route to catalog following landing click animation
  const handleDrivingArrival = () => {
    setCurrentView('catalog');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 selection:bg-[#8B0000] selection:text-white">
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: IMMERSIVE WELCOME LANDING */}
        {currentView === 'landing' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
          >
            <DrivingTransition onComplete={handleDrivingArrival} />
          </motion.div>
        )}

        {/* VIEW 2: CORE PUBLIC EXPERIENCE SHELL (SHOWROOM, SERVICES, BRANDS) */}
        {(currentView === 'catalog' || currentView === 'services' || currentView === 'brands') && (
          <motion.div
            key="showroom-shell"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col min-h-screen relative overflow-hidden"
          >
            {/* Background luxury illumination points */}
            <div className="absolute top-[10%] left-[25%] w-[400px] h-[400px] bg-[#8B0000]/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[20%] right-[15%] w-[350px] h-[350px] bg-[#8B0000]/5 blur-[140px] rounded-full pointer-events-none" />

            {/* Premium Header Navbar in AutoAventus style */}
            <nav className="h-20 flex items-center justify-between px-6 md:px-10 border-b border-[#222]/45 bg-[#050505] relative z-30 select-none">
              <div 
                onClick={(e) => {
                  if (e.shiftKey) {
                    setShowOverrideModal(true);
                  } else {
                    setCurrentView('landing');
                  }
                }} 
                className="text-2xl font-sans font-black tracking-widest flex items-center cursor-pointer text-[#8B0000]"
                title="Hold Shift + Click for security override"
              >
                AUTOAVENTUS
              </div>
              
              <div className="flex gap-4 sm:gap-8 md:gap-10 text-[10px] uppercase tracking-[0.3em] font-bold">
                <button 
                  onClick={() => setCurrentView('catalog')}
                  className={`cursor-pointer transition-colors pb-1 ${
                    currentView === 'catalog' 
                      ? 'text-white border-b border-[#8B0000]' 
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Showroom
                </button>
                <button 
                  onClick={() => setCurrentView('services')}
                  className={`cursor-pointer transition-colors pb-1 ${
                    currentView === 'services' 
                      ? 'text-white border-b border-[#8B0000]' 
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Services
                </button>
                <button 
                  onClick={() => setCurrentView('brands')}
                  className={`cursor-pointer transition-colors pb-1 ${
                    currentView === 'brands' 
                      ? 'text-white border-b border-[#8B0000]' 
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Brands
                </button>
                <button 
                  onClick={() => {
                    setCurrentView('catalog');
                    setTimeout(() => scrollToSection('booking-section'), 120);
                  }}
                  className="text-zinc-500 hover:text-[#8B0000] cursor-pointer transition-colors"
                >
                  Book Drive
                </button>
              </div>
            </nav>

            {/* Content Area View Router */}
            <div className="flex-grow flex flex-col relative overflow-hidden">
              {currentView === 'catalog' && (
                <div className="flex-grow flex overflow-hidden">
              
              {/* Left Sidebar Filters Panel (Desktop) */}
              <aside className="w-80 bg-[#080808] border-r border-[#151515] p-8 hidden md:flex flex-col justify-between shrink-0 custom-scrollbar overflow-y-auto">
                <div className="space-y-8">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.35em] text-[#8B0000]">
                    Filter & Search Cars
                  </h3>

                  {/* Filter: Keyword Query */}
                  <div className="space-y-3">
                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">
                      Search for Car
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={filters.searchQuery}
                        onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                        placeholder="Type name/brand here..."
                        className="w-full bg-black border border-zinc-900 text-[10px] p-3 pl-9 text-white focus:border-[#8B0000] focus:outline-none uppercase placeholder:text-zinc-700 font-mono tracking-wider"
                      />
                      <Search className="w-3.5 h-3.5 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Filter: Max Price Ceiling */}
                  <div className="space-y-3">
                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">
                      Maximum Budget
                    </label>
                    <div className="pt-1">
                      <input
                        type="range"
                        min="4000000"
                        max="450000000"
                        step="1000000"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                        className="w-full bg-zinc-900 appearance-none h-[2px] rounded-lg cursor-pointer accent-[#8B0000]"
                      />
                      <div className="flex justify-between mt-3 text-[10px] font-mono text-zinc-500">
                        <span>₦4M</span>
                        <span className="text-white font-black">{formatCompactPrice(filters.maxPrice)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Filter: Propulsions system select */}
                  <div className="space-y-3">
                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">
                      Fuel / Engine Type
                    </label>
                      <select
                        value={filters.engineType}
                        onChange={(e) => setFilters({ ...filters, engineType: e.target.value as any })}
                        className="w-full bg-black border border-zinc-900 text-[10px] p-3 text-zinc-300 focus:border-[#8B0000] focus:outline-none appearance-none uppercase tracking-widest cursor-pointer font-mono"
                      >
                        <option value="All">Show All Engine Types</option>
                        <option value="Nuclear Fusion">Nuclear Electric Motor</option>
                        <option value="Hydrogen Hybrid">Hydrogen Hybrid</option>
                        <option value="Tesla Ion Drive">Tesla Electric Motor</option>
                        <option value="Bi-Turbo Plasma">Twin-Turbo Petrol Engine</option>
                        <option value="Quantum Overdrive">Supercharged Electric</option>
                        <option value="Electric">Pure Electric</option>
                        <option value="Gasoline">Petrol Combustion</option>
                        <option value="Fuel">Hybrid Fuel</option>
                      </select>
                  </div>

                  {/* Filter: Vintage Year dropdown option */}
                  <div className="space-y-3">
                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">
                      Production Year
                    </label>
                    <div className="relative">
                      <select
                        value={filters.year}
                        onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                        className="w-full bg-black border border-zinc-900 text-[10px] p-3 text-zinc-300 focus:border-[#8B0000] focus:outline-none appearance-none uppercase tracking-widest cursor-pointer font-mono"
                      >
                        <option value="All">All Years</option>
                        {uniqueYears.map(yr => (
                          <option key={yr} value={yr.toString()}>{yr}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Reset Actions Trigger Button */}
                  <button
                    onClick={clearFilters}
                    className="w-full border border-zinc-900 hover:border-[#8B0000] text-zinc-400 hover:text-white hover:bg-[#8B0000]/10 text-[10px] py-2.5 font-bold uppercase tracking-widest cursor-pointer transition-all duration-300"
                  >
                    Clear Filters
                  </button>
                </div>

                {/* Left Sidebar Classic Quote Box */}
                <div className="mt-8 border-t border-[#151515] pt-6">
                  <div className="bg-zinc-950 p-4 border border-[#111]">
                    <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-tighter italic">
                      "The difference between speed and excellence is the soul of the machine."
                    </p>
                  </div>
                </div>
              </aside>

              {/* Right Side Main Display (Collection Grid with custom radial background) */}
              <main className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-12 relative bg-[radial-gradient(circle_at_top_right,_#1a0505_0%,_#050505_60%)] custom-scrollbar">
                
                {/* Visual Title Header Area */}
                <div id="inventory-section" className="scroll-mt-24 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="relative">
                    <h1 className="text-4xl sm:text-6xl font-serif italic leading-none opacity-90 text-white font-black">
                      The Collection
                    </h1>
                    <div className="h-[3px] w-24 bg-[#8B0000] mt-4"></div>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                    VOL: 024 // INDEX PAGE • COUNT: {filteredCars.length}
                  </div>
                </div>

                {/* Mobile Filter Button and Foldout (Mobile and Tablet views) */}
                <div className="block md:hidden mb-10">
                  <button
                    onClick={() => setMobileFiltersExpanded(!mobileFiltersExpanded)}
                    className="w-full bg-[#080808] border border-zinc-900 text-white p-3.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-[#8B0000]" />
                      <span>Filter Options ({mobileFiltersExpanded ? 'Close' : 'Open'})</span>
                    </span>
                    <span className="text-[10.5px] text-[#8B0000]">{filteredCars.length} items</span>
                  </button>

                  <AnimatePresence>
                    {mobileFiltersExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#050505] border-l border-r border-b border-zinc-900 p-5 mt-1 space-y-4 overflow-hidden"
                      >
                        {/* Keyword field */}
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Search Car</label>
                          <input
                            type="text"
                            value={filters.searchQuery}
                            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                            placeholder="Type brand name..."
                            className="w-full bg-black border border-zinc-900 p-2 text-xs uppercase text-white font-mono"
                          />
                        </div>

                        {/* Propulsion Selection */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Fuel / Engine</label>
                            <select
                              value={filters.engineType}
                              onChange={(e) => setFilters({ ...filters, engineType: e.target.value as any })}
                              className="w-full bg-black border border-zinc-900 text-[10px] p-2 text-zinc-300 uppercase tracking-widest"
                            >
                              <option value="All">Show All Engine Types</option>
                              <option value="Nuclear Fusion">Nuclear Electric</option>
                              <option value="Hydrogen Hybrid">Hydrogen Hybrid</option>
                              <option value="Tesla Ion Drive">Tesla Electric</option>
                              <option value="Bi-Turbo Plasma">Twin-Turbo Petrol</option>
                              <option value="Quantum Overdrive">Supercharged Electric</option>
                              <option value="Electric">Electric</option>
                              <option value="Gasoline">Petrol Combustion</option>
                              <option value="Fuel">Hybrid Fuel</option>
                            </select>
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Production Year</label>
                            <select
                              value={filters.year}
                              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                              className="w-full bg-black border border-zinc-900 text-[10px] p-2 text-zinc-300 uppercase tracking-widest"
                            >
                              <option value="All">All Years</option>
                              {uniqueYears.map(yr => (
                                <option key={yr} value={yr.toString()}>{yr}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Price range */}
                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                            <span>Max Budget:</span>
                            <span className="text-white font-bold">{formatCompactPrice(filters.maxPrice)}</span>
                          </div>
                          <input
                            type="range"
                            min="4000000"
                            max="450000000"
                            step="1000000"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                            className="w-full accent-[#8B0000]"
                          />
                        </div>

                        <div className="pt-2 flex gap-2">
                          <button
                            onClick={clearFilters}
                            className="flex-1 bg-[#8B0000] text-white text-[10px] font-bold py-2 uppercase tracking-wider"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => setMobileFiltersExpanded(false)}
                            className="flex-1 border border-zinc-800 text-zinc-400 text-[10px] py-1.5 uppercase font-bold"
                          >
                            Apply Filters
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* GRID RESULTS OF EXOTIC CARS */}
                <div className="min-h-[500px]">
                  {filteredCars.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                      {filteredCars.map((car) => (
                        <CarCard
                          key={car.id}
                          car={car}
                          onSelect={(sel) => setSelectedCar(sel)}
                        />
                      ))}
                    </div>
                  ) : (
                    /* EMPTY STATE VISUAL BOX */
                    <div className="bg-zinc-950 border border-zinc-900 rounded-sm py-20 px-8 text-center max-w-lg mx-auto">
                      <div className="w-12 h-12 border border-[#8B0000]/40 rounded-full flex items-center justify-center text-[#8B0000] mx-auto mb-4 bg-[#8B0000]/5">
                        <SlidersHorizontal className="w-5 h-5 animate-pulse" />
                      </div>
                      <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest">
                        No Vehicles Match Your Search
                      </h3>
                      <p className="text-zinc-550 text-[10.5px] mt-3 font-bold max-w-xs mx-auto leading-relaxed uppercase tracking-tighter text-zinc-405">
                        Adjust your search parameters or reset the filters below.
                      </p>
                      <button
                        onClick={clearFilters}
                        className="mt-8 bg-[#8B0000] hover:bg-[#8B0000]/80 text-white font-mono text-[10px] font-black py-3 px-8 rounded-sm uppercase tracking-widest shadow-lg transition-colors cursor-pointer"
                      >
                        Reset Showroom Filter
                      </button>
                    </div>
                  )}
                </div>

                {/* BOOKING TEST DRIVE SECTION */}
                <section id="booking-section" className="pt-24 mt-20 border-t border-[#222]/30 scroll-mt-24">
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                      <p className="text-[#8B0000] font-mono tracking-[0.4em] uppercase text-xs font-black mb-3">
                        RESERVE A TEST DRIVE
                      </p>
                      <h2 className="text-3xl sm:text-5xl font-serif italic text-white font-black leading-tight">
                        Book a Test Drive
                      </h2>
                      <div className="h-[2px] w-20 bg-[#8B0000] mt-4 mx-auto"></div>
                      <p className="text-zinc-400 text-[11px] uppercase tracking-[0.18em] font-mono max-w-lg mx-auto mt-4 leading-relaxed">
                        Fill out the form below to book a test drive of your chosen vehicle.
                      </p>
                    </div>

                    <div className="bg-black/60 border border-zinc-900 p-8 sm:p-10 relative overflow-hidden backdrop-blur-md rounded-sm">
                      <div className="absolute top-0 left-0 w-2 h-full bg-[#8B0000]" />
                      
                      {bookingSuccess && (
                        <div className="mb-8 bg-[#8B0000]/15 border border-[#8B0000]/65 p-5 rounded-sm text-zinc-200 text-xs font-mono tracking-wider flex items-start gap-3 uppercase animate-pulse">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#8B0000] shrink-0 mt-1" />
                          <p className="leading-relaxed font-bold">{bookingSuccess}</p>
                        </div>
                      )}

                      <form onSubmit={handleBookingSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono font-bold block">
                              Your Name
                            </label>
                            <input
                              type="text"
                              required
                              value={bookingForm.name}
                              onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                              placeholder="Name"
                              className="w-full bg-black border border-zinc-900 text-xs p-3 text-white focus:border-[#8B0000] focus:outline-none uppercase placeholder:text-zinc-805 font-mono"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono font-bold block">
                              Email Address
                            </label>
                            <input
                              type="email"
                              required
                              value={bookingForm.email}
                              onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                              placeholder="Email"
                              className="w-full bg-black border border-zinc-900 text-xs p-3 text-white focus:border-[#8B0000] focus:outline-none placeholder:text-zinc-805 font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono font-bold block">
                              Car Model Choice
                            </label>
                            <select
                              required
                              value={bookingForm.carModel}
                              onChange={(e) => setBookingForm({ ...bookingForm, carModel: e.target.value })}
                              className="w-full bg-black border border-zinc-900 text-xs p-3 text-zinc-300 focus:border-[#8B0000] focus:outline-none uppercase font-mono cursor-pointer"
                            >
                              <option value="">-- Select Car Model --</option>
                              {cars.map((c) => (
                                <option key={c.id} value={`${c.make} ${c.model}`}>
                                  {c.make} {c.model} ({formatCompactPrice(c.startingPrice)})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono font-bold block">
                              Reservation Date
                            </label>
                            <input
                              type="date"
                              required
                              value={bookingForm.date}
                              onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                              className="w-full bg-black border border-zinc-900 text-xs p-3 text-zinc-200 focus:border-[#8B0000] focus:outline-none font-mono cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="pt-4">
                          <button
                            type="submit"
                            className="w-full bg-[#8B0000] hover:bg-[#8B0000]/80 text-white font-mono text-[10px] font-black py-4 uppercase tracking-[0.35em] shadow-[0_0_20px_rgba(139,0,0,0.35)] transition-all duration-300 cursor-pointer"
                          >
                            Book My Drive
                          </button>
                        </div>
                      </form>

                      {/* Dynamic bookings telemetry reservation list */}
                      {bookings.length > 0 && (
                        <div className="mt-10 border-t border-zinc-950 pt-8 text-neutral-200">
                          <h4 className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase mb-4 font-black">
                            Telemetry Active Slots ({bookings.length})
                          </h4>
                          <div className="space-y-3 max-h-[180px] overflow-y-auto custom-scrollbar pr-2">
                            {bookings.map((bk) => (
                              <div 
                                key={bk.id}
                                className="bg-zinc-950 border border-zinc-900 p-4 rounded-sm flex items-center justify-between text-[10px] font-mono"
                              >
                                <div>
                                  <div className="text-white uppercase font-black">{bk.carModel}</div>
                                  <div className="text-zinc-500 uppercase mt-1">Pilot: {bk.name} • Email: {bk.email}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-[#8B0000] font-bold">{bk.date}</span>
                                  <button
                                    onClick={() => deleteBooking(bk.id)}
                                    className="text-zinc-600 hover:text-red-500 p-1 cursor-pointer transition-colors"
                                    title="Cancel reservation"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
                
                {/* Visual Section: Your No. 1 Dealer Callout banner */}
                <section className="mt-20 py-16 bg-gradient-to-r from-black via-zinc-950 to-black border-y border-zinc-900 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#8b000030_0%,_transparent_65%)]" />
                  <div className="relative z-10 max-w-xl mx-auto px-4">
                    <h3 className="text-xl sm:text-2xl font-serif italic text-white font-black uppercase tracking-[0.2em] mb-4">
                      Your No. 1 Dealer
                    </h3>
                    <p className="text-zinc-400 text-[10px] font-mono uppercase tracking-widest leading-relaxed">
                      Supplying the premium tier of elite performance and custom luxury vehicles designed for outstanding comfort and power.
                    </p>
                  </div>
                </section>

                {/* Curated visual showroom footer */}
                <footer className="border-t border-[#111] py-12 text-center mt-20 text-[10px] text-zinc-650 font-mono select-none">
                  <p 
                    onClick={() => setShowOverrideModal(true)}
                    className="tracking-[0.25em] uppercase font-bold cursor-pointer hover:text-white transition-colors"
                    title="System administration override link"
                  >
                    AUTOAVENTUS PREMIUM VEHICLES SHOWROOM • COPYRIGHT © 2026
                  </p>
                  <p className="text-[9px] text-zinc-700 uppercase tracking-widest mt-1.5">The ultimate experience in high-end luxury and custom performance vehicles</p>
                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-neutral-400">
                    <span>Contact: <a href="tel:+2347082361899" className="hover:text-red-500 underline">+234 708 236 1899</a></span>
                    <span className="hidden sm:inline">•</span>
                    <span>Email: <a href="mailto:autoaventusaa@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 underline text-red-500" title="Open or copy email address: autoaventusaa@gmail.com">autoaventusaa@gmail.com</a></span>
                    <span className="hidden sm:inline">•</span>
                    <a href="https://wa.link/ru8m34" target="_blank" rel="noreferrer" className="hover:text-green-505 text-green-500 hover:underline uppercase tracking-wide">WhatsApp Support Chat</a>
                  </div>
                </footer>
              </main>
            </div>
          )}

          {/* OUR SERVICES - DEDICATED IMMERSIVE PAGE */}
          {currentView === 'services' && (
            <motion.div
              key="services-subview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="flex-grow overflow-y-auto custom-scrollbar flex flex-col"
            >
              <div className="flex-grow max-w-7xl mx-auto w-full p-6 sm:p-8 md:p-12 relative z-10">
                {/* Header Heading */}
                <div className="mb-14 text-center md:text-left relative">
                  <p className="text-[#8B0000] font-mono tracking-[0.4em] uppercase text-xs font-black mb-3">
                    SERVICES WE PROVIDE
                  </p>
                  <h2 className="text-4xl sm:text-6xl font-serif italic text-white font-black leading-none">
                    Our Services
                  </h2>
                  <div className="h-[3px] w-24 bg-[#8B0000] mt-5 mx-auto md:mx-0"></div>
                  <p className="text-zinc-400 text-xs sm:text-sm font-mono mt-6 max-w-3xl leading-relaxed uppercase tracking-wider">
                    AUTOAVENTUS IS A PREMIUM HIGH-END VEHICLE AGENCY, OFFERING EXCEPTIONAL LUXURY VEHICLES, CONSIGNMENTS, BESPOKE CUSTOMIZATION, AND LONG-TERM PREMIUM SUPPORT.
                  </p>
                </div>

                {/* Bento Grid services layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { 
                      title: 'Direct Purchase (Buy)', 
                      desc: 'Secure a direct purchase of your dream vehicle with hassle-free registration and paperwork.', 
                      details: ['Affordable purchase rates', 'Fast vehicle transfer', 'Full vehicle registration', 'Complete battery and engine check'],
                      icon: DollarSign 
                    },
                    { 
                      title: 'Vehicle Consignment (Sell)', 
                      desc: 'Sell your luxury or performance vehicle with us to get the maximum trade-in value or immediate payouts.', 
                      details: ['Maximum trade-in value', 'Wide market listing placement', 'Certified ownership checks', 'Fast payment clearance'],
                      icon: Sparkles 
                    },
                    { 
                      title: 'Vehicle Swap (Trade-in)', 
                      desc: 'Trade in your older vehicle model for a premium upgrade with favorable down payment rates and instant evaluation.', 
                      details: ['Instant swap eligibility', 'Expert vehicle valuation', 'Hassle-free trade process', 'Flexible payment solutions'],
                      icon: RefreshCw 
                    },
                    { 
                      title: 'Mechanical Refitting (Repair)', 
                      desc: 'Complete diagnostic checks, performance tuning, bodywork maintenance, and premium detailing.', 
                      details: ['Full body maintenance', 'Engine performance tuning', 'Pressure leak testing', 'Fuel system cleaning'],
                      icon: Wrench 
                    },
                    { 
                      title: 'Premium Vehicle Rental (Rent)', 
                      desc: 'Rent premium luxury or performance vehicles for your trips. Comprehensive utility insurance coverage comes standard.', 
                      details: ['Flexible rental schedules', 'Modern stabilizer safety mods', '24/7 client backup support', 'GPS vehicle tracking'],
                      icon: KeyRound 
                    }
                  ].map((srv, idx) => (
                    <div 
                      key={idx} 
                      className="bg-black/60 border border-zinc-900 p-8 rounded-sm hover:border-[#8B0000] hover:shadow-[0_0_20px_rgba(139,0,0,0.15)] transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#8B0000]/5 via-transparent to-transparent rounded-bl-full pointer-events-none group-hover:from-[#8B0000]/15 transition-all duration-500" />
                      
                      <div>
                        <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center text-[#8B0000] group-hover:text-white group-hover:bg-[#8B0000] mb-6 transition-all duration-300 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                          <srv.icon className="w-5 h-5" />
                        </div>
                        
                        <h3 className="text-white font-mono font-black text-sm uppercase tracking-[0.15em] mb-3 text-left">
                          {srv.title}
                        </h3>
                        
                        <p className="text-zinc-500 text-[11px] leading-relaxed uppercase tracking-tight mb-6 text-left">
                          {srv.desc}
                        </p>
                      </div>

                      <div className="border-t border-zinc-950 pt-5 mt-4">
                        <ul className="space-y-2.5">
                          {srv.details.map((dt, dIdx) => (
                            <li key={dIdx} className="flex items-center gap-2.5 text-[9.5px] font-mono text-zinc-650 uppercase">
                              <span className="w-1 h-1 rounded-full bg-[#8B0000]" />
                              <span>{dt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}

                  {/* Dynamic synergy card */}
                  <div className="bg-gradient-to-br from-[#8B0000]/10 via-black to-black border border-[#8B0000]/30 p-8 rounded-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_#8B000020_0%,_transparent_80%)]" />
                    <div>
                      <div className="w-10 h-10 border border-[#8B0000]/30 rounded-full flex items-center justify-center text-[#8B0000] mb-4">
                        <Settings className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                      </div>
                      <h4 className="text-white font-mono font-black text-xs uppercase tracking-[0.2em] mb-2 text-left">Personalized Customizations</h4>
                      <p className="text-zinc-500 text-[10px] leading-relaxed uppercase tracking-widest text-left">
                        Need customized design upgrades, unique colors, or personalized additions? Our custom workshop will fit any vehicle of your choice.
                      </p>
                    </div>
                    <div className="mt-6">
                      <button 
                        onClick={() => {
                          setCurrentView('catalog');
                          setTimeout(() => scrollToSection('booking-section'), 120);
                        }}
                        className="bg-[#8B0000] hover:bg-neutral-100 hover:text-black text-white text-[9px] font-mono font-black uppercase tracking-[0.2em] py-3.5 px-5 transition-all duration-300 w-full cursor-pointer"
                      >
                        Start Customization Request
                      </button>
                    </div>
                  </div>
                </div>

                {/* Interactive State diagnostic calculations inside Services */}
                <div className="mt-20 border-t border-zinc-900 pt-16">
                  <div className="text-center mb-10">
                    <p className="text-[#8B0000] font-mono tracking-[0.4em] uppercase text-xs font-black mb-3">
                      ESTIMATE COMPUTATION SERVICE
                    </p>
                    <h3 className="text-2xl sm:text-4xl font-serif italic text-white font-black">
                      Service Cost Planner
                    </h3>
                    <div className="h-[2px] w-20 bg-[#8B0000] mt-4 mx-auto"></div>
                    <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mt-4">
                      Select custom options below to compute estimated service costs and processing durations.
                    </p>
                  </div>

                  <div className="bg-black/60 border border-zinc-900 p-8 rounded-sm max-w-4xl mx-auto backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-[#8B0000]" />
                    <ServiceDiagnosticCalculator />
                  </div>
                </div>
              </div>

              {/* Visual Section: Your No. 1 Dealer Callout banner */}
              <section className="mt-auto py-16 bg-gradient-to-r from-black via-zinc-950 to-black border-y border-zinc-900 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#8b000030_0%,_transparent_65%)]" />
                <div className="relative z-10 max-w-xl mx-auto px-4">
                  <h3 className="text-xl sm:text-2xl font-serif italic text-white font-black uppercase tracking-[0.2em] mb-4">
                    Your No. 1 Dealer
                  </h3>
                  <p className="text-zinc-400 text-[10px] font-mono uppercase tracking-widest leading-relaxed">
                    Supplying the premium tier of elite performance and custom luxury vehicles designed for outstanding comfort and power.
                  </p>
                </div>
              </section>

              {/* Curated visual showroom footer */}
              <footer className="border-t border-[#111] py-12 text-center text-[10px] text-zinc-650 font-mono select-none">
                <p 
                  onClick={() => setShowOverrideModal(true)}
                  className="tracking-[0.25em] uppercase font-bold cursor-pointer hover:text-white transition-colors"
                  title="System administration override link"
                >
                  AUTOAVENTUS PREMIUM VEHICLES SHOWROOM • COPYRIGHT © 2026
                </p>
                <p className="text-[9px] text-zinc-700 uppercase tracking-widest mt-1.5">The ultimate experience in high-end luxury and custom performance vehicles</p>
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-neutral-400">
                  <span>Contact: <a href="tel:+2347082361899" className="hover:text-red-500 underline">+234 708 236 1899</a></span>
                  <span className="hidden sm:inline">•</span>
                  <span>Email: <a href="mailto:autoaventusaa@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 underline text-red-500" title="Open or copy email address: autoaventusaa@gmail.com">autoaventusaa@gmail.com</a></span>
                  <span className="hidden sm:inline">•</span>
                  <a href="https://wa.link/ru8m34" target="_blank" rel="noreferrer" className="hover:text-green-505 text-green-500 hover:underline uppercase tracking-wide">WhatsApp Support Chat</a>
                </div>
              </footer>
            </motion.div>
          )}

          {/* BRANDS WE OFFER - DEDICATED IMMERSIVE PAGE */}
          {currentView === 'brands' && (
            <motion.div
              key="brands-subview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="flex-grow overflow-y-auto custom-scrollbar flex flex-col"
            >
              <div className="flex-grow max-w-7xl mx-auto w-full p-6 sm:p-8 md:p-12 relative z-10">
                {/* Header Heading */}
                <div className="mb-14 text-center md:text-left relative">
                  <p className="text-[#8B0000] font-mono tracking-[0.4em] uppercase text-xs font-black mb-3">
                    PARTNERED MANUFACTURERS
                  </p>
                  <h2 className="text-4xl sm:text-6xl font-serif italic text-white font-black leading-none">
                    Brands We Offer
                  </h2>
                  <div className="h-[3px] w-24 bg-[#8B0000] mt-5 mx-auto md:mx-0"></div>
                  <p className="text-zinc-400 text-xs sm:text-sm font-mono mt-6 max-w-3xl leading-relaxed uppercase tracking-wider">
                    OUR ESTABLISHED PARTNERSHIPS WITH WORLD-CLASS CAR MANUFACTURERS ENSURE YOU RECEIVE FACTORY-AUTHORIZED SERVICE, WARRANTY PROTECTION, AND EXPERT MECHANICAL SUPPORT.
                  </p>
                </div>

                {/* Brands detailed list */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { 
                      name: 'BMW', 
                      origin: 'Germany', 
                      tech: 'Inline Turbocharged Engine', 
                      desc: 'Renowned for exquisite handling, signature kidney grilles, and highly luxurious premium cabins built for ultimate comfort.',
                      details: 'Active since 1916 • Munich Manufacturing Center',
                      focus: 'Driver Control',
                      estRange: '850 km'
                    },
                    { 
                      name: 'Tesla', 
                      origin: 'United States', 
                      tech: 'Pure Electric Motor', 
                      desc: 'The global leader in all-electric vehicles. Combines advanced cruise control with instant electric torque for a fast and silent drive.',
                      details: 'Active since 2003 • Global Gigafactories',
                      focus: 'Electric Autopilot',
                      estRange: '600 km'
                    },
                    { 
                      name: 'Toyota', 
                      origin: 'Japan', 
                      tech: 'Twin-Scroll Turbocharged Hybrid', 
                      desc: 'Decades of unparalleled vehicle heritage, legendary durability, and state-of-the-art hybrid powertrains built for both everyday utility and racing performance.',
                      details: 'Active since 1937 • Toyota City Plants',
                      focus: 'Reliability & Speed',
                      estRange: '900 km'
                    },
                    { 
                      name: 'Lexus', 
                      origin: 'Japan', 
                      tech: 'Naturally Aspirated V10 / Twin-Turbo V8', 
                      desc: 'Craftsmanship matching absolute quiet luxury with outstanding performance. Renowned for rich leather interiors and premium acoustic exhaust engineering.',
                      details: 'Active since 1989 • Tahara Elite Plants',
                      focus: 'Pure Luxury & Power',
                      estRange: '750 km'
                    },
                    { 
                      name: 'Audi', 
                      origin: 'Germany', 
                      tech: 'Quattro Electric / V8 Turbo', 
                      desc: 'A global pioneer in performance automobiles. Combining legendary Quattro all-wheel drive, sleek futuristic lighting, and highly responsive technological cockpits.',
                      details: 'Active since 1909 • Ingolstadt Yards',
                      focus: 'Progressive Tech',
                      estRange: '820 km'
                    },
                    { 
                      name: 'Porsche', 
                      origin: 'Germany', 
                      tech: 'Twin-Turbo Boxer Engine', 
                      desc: 'Uncompromising design aerodynamics paired with water-cooled twin-turbo systems. Engineered primarily for the racetrack and high-speed sports performance.',
                      details: 'Active since 1931 • Stuttgart Plant',
                      focus: 'Track Performance',
                      estRange: '700 km'
                    },
                    { 
                      name: 'Jaguar', 
                      origin: 'United Kingdom', 
                      tech: 'Supercharged V8 Engine', 
                      desc: 'Combining classic leather and wood aesthetics with highly durable lightweight bodies. Perfect for those who demand executive security, elegance, and extreme comfort.',
                      details: 'Active since 1922 • Coventry Factory',
                      focus: 'Classic Elegance',
                      estRange: '650 km'
                    },
                    { 
                      name: 'Mercedes-Benz', 
                      origin: 'Germany', 
                      tech: 'Biturbo V8 Engine', 
                      desc: 'Prestige luxury vehicles styled with the iconic three-pointed star. Designed to provide state-of-the-art safety, premium materials, and unparalleled power on any terrain.',
                      details: 'Active since 1926 • Stuttgart Factory',
                      focus: 'Premium Luxury',
                      estRange: '800 km'
                    },
                    { 
                      name: 'AutoAventus', 
                      origin: 'Custom Workshop', 
                      tech: 'Bespoke Electric Concept Drive', 
                      desc: 'Our own unique prototype vehicles. Built with fully custom modern electric systems and advanced ride stabilizers for the ultimate driving experience.',
                      details: 'Active since 2026 • Private Custom Docks',
                      focus: 'Custom Innovation',
                      estRange: '1,200 km'
                    }
                  ].map((brand, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setFilters({
                          ...filters,
                          searchQuery: brand.name
                        });
                        setCurrentView('catalog');
                        setTimeout(() => scrollToSection('inventory-section'), 120);
                      }}
                      className="bg-black/60 border border-zinc-900 p-8 rounded-sm hover:border-[#8B0000] relative overflow-hidden group flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,0,0,0.15)] text-left cursor-pointer"
                    >
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#8B0000]/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                      
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-3xl font-sans font-black tracking-widest text-neutral-300 group-hover:text-white transition-colors">
                            {brand.name}
                          </h3>
                          <span className="text-[9px] font-mono bg-[#8B0000]/10 border border-[#8B0000]/30 text-red-500 py-0.5 px-2 rounded-sm uppercase font-black font-bold">
                            {brand.focus}
                          </span>
                        </div>

                        <p className="text-white text-[10px] font-mono tracking-wider uppercase mt-4 font-bold">
                          {brand.origin}
                        </p>
                        <p className="text-[#8B0000] text-[8.5px] font-mono tracking-widest uppercase mt-0.5 font-bold">
                          {brand.tech}
                        </p>

                        <p className="text-zinc-550 text-[10.5px] leading-relaxed uppercase tracking-tighter mt-6 mb-8 border-l border-zinc-900 pl-4 text-zinc-405">
                          {brand.desc}
                        </p>
                      </div>

                      <div className="border-t border-zinc-950 pt-5 mt-auto flex flex-col gap-3">
                        <div className="flex justify-between text-[9px] font-mono text-zinc-500 uppercase">
                          <span>Driving Range:</span>
                          <span className="text-zinc-300 font-bold">{brand.estRange}</span>
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-zinc-500 uppercase">
                          <span>Manufacturer Details:</span>
                          <span className="text-zinc-450">{brand.details}</span>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilters({
                              ...filters,
                              searchQuery: brand.name
                            });
                            setCurrentView('catalog');
                            setTimeout(() => scrollToSection('inventory-section'), 120);
                          }}
                          className="mt-4 w-full bg-zinc-950 border border-zinc-900 group-hover:border-[#8B0000] hover:bg-[#8B0000] hover:text-white text-zinc-400 text-[9px] font-mono py-3 uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer text-center font-bold"
                        >
                          Explore Brand Portfolio
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Section: Your No. 1 Dealer Callout banner */}
              <section className="mt-auto py-16 bg-gradient-to-r from-black via-zinc-950 to-black border-y border-zinc-900 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#8b000030_0%,_transparent_65%)]" />
                <div className="relative z-10 max-w-xl mx-auto px-4">
                  <h3 className="text-xl sm:text-2xl font-serif italic text-white font-black uppercase tracking-[0.2em] mb-4">
                    Your No. 1 Dealer
                  </h3>
                  <p className="text-zinc-400 text-[10px] font-mono uppercase tracking-widest leading-relaxed">
                    Supplying the premium tier of elite performance and custom luxury vehicles designed for outstanding comfort and power.
                  </p>
                </div>
              </section>

              {/* Curated visual showroom footer */}
              <footer className="border-t border-[#111] py-12 text-center text-[10px] text-zinc-650 font-mono select-none">
                <p 
                  onClick={() => setShowOverrideModal(true)}
                  className="tracking-[0.25em] uppercase font-bold cursor-pointer hover:text-white transition-colors"
                  title="System administration override link"
                >
                  AUTOAVENTUS PREMIUM VEHICLES SHOWROOM • COPYRIGHT © 2026
                </p>
                <p className="text-[9px] text-zinc-700 uppercase tracking-widest mt-1.5">The ultimate experience in high-end luxury and custom performance vehicles</p>
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-neutral-400">
                  <span>Contact: <a href="tel:+2347082361899" className="hover:text-red-500 underline">+234 708 236 1899</a></span>
                  <span className="hidden sm:inline">•</span>
                  <span>Email: <a href="mailto:autoaventusaa@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 underline text-red-500" title="Open or copy email address: autoaventusaa@gmail.com">autoaventusaa@gmail.com</a></span>
                  <span className="hidden sm:inline">•</span>
                  <a href="https://wa.link/ru8m34" target="_blank" rel="noreferrer" className="hover:text-green-505 text-green-500 hover:underline uppercase tracking-wide">WhatsApp Support Chat</a>
                </div>
              </footer>
            </motion.div>
          )}
          </div>
        {/* VIEW 2 END */}
        </motion.div>
      )}

        {/* VIEW 3: SECURE PRIVATE ADMIN PANEL */}
        {currentView === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminPanel
              cars={cars}
              onUpdateCars={handleUpdateDatabase}
              onClose={() => setCurrentView('catalog')}
              onResetDatabase={resetMasterDatabase}
            />
          </motion.div>
        )}

      </AnimatePresence>

      {/* RENDER DYNAMIC SPECS DETAIL MODAL */}
      <AnimatePresence>
        {selectedCar && (
          <SpecsModal
            car={selectedCar}
            onClose={() => setSelectedCar(null)}
          />
        )}
      </AnimatePresence>

      {/* SECURITY OVERRIDE PASSCODE TERMINAL MODAL */}
      <AnimatePresence>
        {showOverrideModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 selection:bg-[#8B0000] selection:text-white"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0b0b0b] border-2 border-red-950 max-w-sm w-full p-8 rounded-sm text-white font-mono relative shadow-[0_0_50px_rgba(139,0,0,0.2)]"
            >
              {/* Futuristic Crosshairs */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8B0000]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#8B0000]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#8B0000]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8B0000]" />

              <button
                type="button"
                onClick={() => {
                  setShowOverrideModal(false);
                  setOverridePasscode('');
                  setOverrideError('');
                }}
                className="absolute top-4 right-4 text-zinc-550 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 text-[#8B0000] mb-6">
                <KeyRound className="w-6 h-6 animate-pulse" />
                <h3 className="text-sm font-black tracking-[0.2em] uppercase">
                  ADMIN OVERRIDE GATES
                </h3>
              </div>

              <p className="text-zinc-400 text-[9px] uppercase tracking-widest leading-relaxed mb-6 border-b border-zinc-900 pb-4">
                ADMIN REGISTRY ACCESS. ENTER SECURE PASSCODE FOR DIRECT ADMIN OVERRIDE.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const code = overridePasscode.toUpperCase().trim();
                  if (code === 'AVENTUS99' || code === 'AVENTUS-MASTER-777' || code === 'ADMIN123' || code === 'ADMIN') {
                    setCurrentView('admin');
                    setShowOverrideModal(false);
                    setOverridePasscode('');
                    setOverrideError('');
                  } else {
                    setOverrideError('INVALID PASSCODE. ACCESS REJECTED.');
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[8px] text-zinc-500 uppercase tracking-[0.3em] font-black mb-2">
                    Enter Secure Passcode
                  </label>
                  <input
                    type="password"
                    autoFocus
                    placeholder="••••••••••••••"
                    value={overridePasscode}
                    onChange={(e) => {
                      setOverridePasscode(e.target.value);
                      if (overrideError) setOverrideError('');
                    }}
                    className="w-full bg-black border border-zinc-800 text-center tracking-[0.2em] font-bold text-white py-4 px-3 rounded-sm focus:border-[#8B0000] focus:outline-none transition-all placeholder-zinc-800 text-sm uppercase"
                  />
                </div>

                {overrideError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-[8.5px] uppercase tracking-wider text-center font-bold bg-red-950/10 border border-red-950/20 py-2.5 rounded-sm"
                  >
                    ⚠️ {overrideError}
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOverrideModal(false);
                      setOverridePasscode('');
                      setOverrideError('');
                    }}
                    className="bg-zinc-950 border border-zinc-900 hover:bg-zinc-900 text-zinc-400 font-bold uppercase tracking-wider py-3 px-4 rounded-sm text-[9px] transition-colors cursor-pointer text-center"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="bg-[#8B0000] hover:bg-red-750 text-white font-bold uppercase tracking-widest py-3 px-4 rounded-sm text-[9px] transition-all duration-300 cursor-pointer text-center drop-shadow-[0_0_15px_rgba(139,0,0,0.35)]"
                  >
                    ACCESS
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-4 border-t border-zinc-900 text-[8px] text-zinc-500 text-center space-y-1 select-none font-sans">
                <p>STATUS: SECURE DISCONNECT CHANNELS READY</p>
                <p className="tracking-wider text-[7.5px]">AUTOAVENTUS SHOWROOM PROTOCOL</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ServiceDiagnosticCalculator() {
  const [calcService, setCalcService] = useState('Buy');
  const [calcOrbit, setCalcOrbit] = useState('Earth Port');
  const [calcVessel, setCalcVessel] = useState('Light Vessel (Class-A)');
  const [computed, setComputed] = useState<any>(null);

  const calculateService = () => {
    let priceMultiplier = 120000;
    let days = 3;

    if (calcService === 'Buy') priceMultiplier = 250000;
    else if (calcService === 'Sell') priceMultiplier = -180000;
    else if (calcService === 'Swap') priceMultiplier = 80000;
    else if (calcService === 'Refurbish') priceMultiplier = 150000;
    else if (calcService === 'Rent') priceMultiplier = 35000;

    if (calcOrbit === 'Martian Basin') {
      priceMultiplier = priceMultiplier * 1.35;
      days += 4;
    } else if (calcOrbit === 'Lunar Outlaw Belt') {
      priceMultiplier = priceMultiplier * 1.55;
      days += 7;
    } else if (calcOrbit === 'Jupiter Base') {
      priceMultiplier = priceMultiplier * 2.1;
      days += 12;
    }

    if (calcVessel === 'Medium Freighter (Class-B)') {
      priceMultiplier = priceMultiplier * 1.8;
      days += 2;
    } else if (calcVessel === 'Dreadnought (Class-C)') {
      priceMultiplier = priceMultiplier * 3.4;
      days += 5;
    }

    const equipment = calcOrbit === 'Jupiter Base' || calcVessel === 'Dreadnought (Class-C)' 
      ? 'Advanced Diagnostic Master Equipment'
      : calcOrbit === 'Lunar Outlaw Belt'
        ? 'Specialty Performance Mechanics Tools'
        : 'Standard Computerized Diagnostic System';

    setComputed({
      price: Math.abs(Math.round(priceMultiplier)),
      days: days,
      equipment: equipment,
      isPayout: calcService === 'Sell'
    });
  };

  useEffect(() => {
    calculateService();
  }, [calcService, calcOrbit, calcVessel]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white uppercase font-mono text-left">
      <div className="space-y-4">
        <div>
          <label className="text-[9px] text-zinc-500 block mb-2 font-black tracking-widest">Service Type</label>
          <select 
            value={calcService}
            onChange={(e) => setCalcService(e.target.value)}
            className="w-full bg-black border border-zinc-900 text-xs p-3.5 focus:border-[#8B0000] focus:outline-none cursor-pointer font-bold text-zinc-300"
          >
            <option value="Buy">Full Vehicle Purchase (Buy)</option>
            <option value="Sell">Direct Car Sale (Sell)</option>
            <option value="Swap">Engine & Parts Upgrade (Swap)</option>
            <option value="Refurbish">Complete Mechanical Repair (Refurbish)</option>
            <option value="Rent">Premium Car Fleet Rental (Rent)</option>
          </select>
        </div>

        <div>
          <label className="text-[9px] text-zinc-500 block mb-2 font-black tracking-widest">Showroom Location</label>
          <select 
            value={calcOrbit}
            onChange={(e) => setCalcOrbit(e.target.value)}
            className="w-full bg-black border border-zinc-900 text-xs p-3.5 focus:border-[#8B0000] focus:outline-none cursor-pointer font-bold text-zinc-300"
          >
            <option value="Earth Port">Lagos Showroom & Docks</option>
            <option value="Martian Basin">Abuja Regional Branch</option>
            <option value="Lunar Outlaw Belt">Port Harcourt Express Station</option>
            <option value="Jupiter Base">Mobile Delivery Dispatch (At Home)</option>
          </select>
        </div>

        <div>
          <label className="text-[9px] text-zinc-500 block mb-2 font-black tracking-widest">Vehicle Size & Style</label>
          <select 
            value={calcVessel}
            onChange={(e) => setCalcVessel(e.target.value)}
            className="w-full bg-black border border-zinc-900 text-xs p-3.5 focus:border-[#8B0000] focus:outline-none cursor-pointer font-bold text-zinc-300"
          >
            <option value="Light Vessel (Class-A)">Sedans, Coupes & Hatchbacks</option>
            <option value="Medium Freighter (Class-B)">Luxury SUVs & Crossovers</option>
            <option value="Dreadnought (Class-C)">Supercars & Concept Vehicles</option>
          </select>
        </div>
      </div>

      <div className="bg-zinc-950 p-6 border border-zinc-900 rounded-sm flex flex-col justify-between relative shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] min-h-[220px]">
        <div className="space-y-4">
          <div className="text-[10px] text-[#8B0000] font-black tracking-widest border-b border-zinc-900 pb-2">
            CALCULATOR RESULTS
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-zinc-500 font-bold">Estimated Cost:</span>
            <span className="text-xl font-black text-white tracking-wider">
              {computed?.isPayout ? '+' : ''}
              ₦{computed?.price?.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] text-zinc-500 font-bold">Estimated Time:</span>
            <span className="text-sm font-bold text-red-500 tracking-wide">{computed?.days} DAYS</span>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] text-zinc-500 font-bold block">Equipment Used:</span>
            <span className="text-[10px] font-black text-zinc-300 block leading-tight">{computed?.equipment}</span>
          </div>
        </div>

        <p className="text-zinc-650 text-[8px] leading-relaxed uppercase tracking-tighter mt-4 text-zinc-600">
          *Cost shown is an estimate. Final prices will be verified during dynamic high-fidelity diagnostic inspection at our showrooms.
        </p>
      </div>
    </div>
  );
}
