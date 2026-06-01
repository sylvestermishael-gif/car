import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, KeyRound, Database, RefreshCw, Plus, ToggleLeft, ToggleRight, 
  Trash2, DollarSign, CheckCircle2, Eye, EyeOff, Home, ArrowRight,
  Upload, Image
} from 'lucide-react';
import { Car, TrimLevel, ColorOption } from '../types';

interface AdminPanelProps {
  cars: Car[];
  onUpdateCars: (updatedCars: Car[]) => void;
  onClose: () => void;
  onResetDatabase: () => void;
}

export default function AdminPanel({ cars, onUpdateCars, onClose, onResetDatabase }: AdminPanelProps) {
  // Authorization State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Editing States
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [newCar, setNewCar] = useState<Partial<Car>>({
    make: '',
    model: '',
    year: 2026,
    startingPrice: 35000000,
    engineType: 'Tesla Ion Drive',
    category: 'Interstellar GT',
    description: '',
    performance: {
      acceleration: '2.0s',
      horsepower: 850,
      topSpeed: '180 mph',
      engine: 'Tesla Quad-Phase Ion Reactor',
      drivetrain: 'Vector AWD'
    },
    mainImage: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Showroom Finish', hex: '#8C9093', imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1200' }
    ],
    trims: [],
    isPublic: true
  });

  // Dynamic state for adding a custom trim row to the new car
  const [trimName, setTrimName] = useState('');
  const [trimPrice, setTrimPrice] = useState<number>(150000);
  const [trimHP, setTrimHP] = useState<number>(650);

  // Authentication validation
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPassword = password.trim().toUpperCase();
    if (password === 'admin123' || password === 'admin' || cleanPassword === 'AVENTUS99' || cleanPassword === 'AVENTUS-MASTER-777') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('INVALID ACCESS KEY. ACCESS BLOCKED.');
    }
  };

  // Toggle showcase visibility (Put on Public Website)
  const toggleVisibility = (carId: string) => {
    const updated = cars.map(car => {
      if (car.id === carId) {
        return { ...car, isPublic: !car.isPublic };
      }
      return car;
    });
    onUpdateCars(updated);
  };

  // Update base car price directly
  const handlePriceChange = (carId: string, newPrice: number) => {
    const updated = cars.map(car => {
      if (car.id === carId) {
        // Also update standard trim level price to keep them synchronized
        const updatedTrims = car.trims.map((trim, i) => {
          if (i === 0) return { ...trim, price: newPrice };
          return trim;
        });
        return { ...car, startingPrice: newPrice, trims: updatedTrims };
      }
      return car;
    });
    onUpdateCars(updated);
  };

  // Update base car image directly
  const handleImageUploadForCar = (carId: string, base64OrUrl: string) => {
    const updated = cars.map(car => {
      if (car.id === carId) {
        return { 
          ...car, 
          mainImage: base64OrUrl,
          images: [base64OrUrl],
          colors: car.colors.map((c, i) => i === 0 ? { ...c, imageUrl: base64OrUrl } : c)
        };
      }
      return car;
    });
    onUpdateCars(updated);
  };

  // Add trim option to new car builder
  const addTrimOption = () => {
    if (!trimName) return;
    const trimId = `trim-${Date.now()}`;
    const cleanTrim: TrimLevel = {
      id: trimId,
      name: trimName,
      price: trimPrice,
      engine: newCar.performance?.engine || 'Engine Standard',
      horsepower: trimHP,
      acceleration: newCar.performance?.acceleration || '3.2s',
      topSpeed: newCar.performance?.topSpeed || '205 mph'
    };
    
    setNewCar(prev => ({
      ...prev,
      trims: [...(prev.trims || []), cleanTrim]
    }));
    
    setTrimName('');
    setTrimPrice(160000);
    setTrimHP(660);
  };

  // Remove trim option in builder
  const removeTrimOption = (index: number) => {
    setNewCar(prev => ({
      ...prev,
      trims: (prev.trims || []).filter((_, i) => i !== index)
    }));
  };

  // Save the custom created card to database
  const saveNewCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCar.make || !newCar.model) {
      alert("Please provide vehicle make and model.");
      return;
    }

    const completedId = `${newCar.make.toLowerCase()}-${newCar.model.toLowerCase()}`.replace(/\s+/g, '-');
    
    // Ensure there is at least one trim representing standard configuration
    const finalTrims = newCar.trims && newCar.trims.length > 0 
      ? newCar.trims 
      : [{
          id: `${completedId}-standard`,
          name: 'Showroom Base Spec',
          price: newCar.startingPrice || 35000000,
          engine: newCar.performance?.engine || 'Tesla Quad-Phase Ion Reactor',
          horsepower: newCar.performance?.horsepower || 850,
          acceleration: newCar.performance?.acceleration || '2.0s',
          topSpeed: newCar.performance?.topSpeed || '180 mph'
        }];

    const completedCar: Car = {
      id: completedId,
      make: newCar.make,
      model: newCar.model,
      year: Number(newCar.year) || 2026,
      startingPrice: Number(newCar.startingPrice) || 35000000,
      engineType: newCar.engineType as any || 'Tesla Ion Drive',
      category: newCar.category as any || 'Interstellar GT',
      description: newCar.description || 'Custom handbuilt elite class space explorer uploaded by administrator.',
      performance: {
        acceleration: newCar.performance?.acceleration || '2.0s',
        horsepower: Number(newCar.performance?.horsepower) || 850,
        topSpeed: newCar.performance?.topSpeed || '180 mph',
        engine: newCar.performance?.engine || 'Tesla Quad-Phase Ion Reactor',
        drivetrain: newCar.performance?.drivetrain || 'Vector AWD',
        fuelCapacity: newCar.performance?.fuelCapacity || '80 Liters'
      },
      mainImage: newCar.mainImage || 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1200',
      images: [newCar.mainImage || 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1200'],
      colors: newCar.colors || [
        { name: 'Showroom Finish', hex: '#8C9093', imageUrl: newCar.mainImage || 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1200' }
      ],
      trims: finalTrims,
      isPublic: newCar.isPublic !== undefined ? newCar.isPublic : true
    };

    onUpdateCars([completedCar, ...cars]);
    setIsAddingCar(false);
    
    // Clear form defaults
    setNewCar({
      make: '',
      model: '',
      year: 2026,
      startingPrice: 35000000,
      engineType: 'Tesla Ion Drive',
      category: 'Interstellar GT',
      description: '',
      performance: {
        acceleration: '2.0s',
        horsepower: 850,
        topSpeed: '180 mph',
        engine: 'Tesla Quad-Phase Ion Reactor',
        drivetrain: 'Vector AWD'
      },
      mainImage: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1200',
      images: ['https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1200'],
      colors: [{ name: 'Showroom Finish', hex: '#8C9093', imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1200' }],
      trims: [],
      isPublic: true
    });
  };

  // Delete a car from the database entirely
  const handleDeleteCar = (carId: string) => {
    if (confirm("Are you sure you want to permanently delete this car from database?")) {
      const updated = cars.filter(c => c.id !== carId);
      onUpdateCars(updated);
    }
  };

  // Gated Access Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center p-6 text-neutral-200 font-sans relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,0,0,0.06),transparent_75%)] pointer-events-none" />
        
        {/* Lock Shield Circle */}
        <motion.div 
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-[#0d0d0d] border border-zinc-900 rounded-sm p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative z-10"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-black border border-[#8B0000]/30 rounded-full flex items-center justify-center text-[#8B0000] mb-4 shadow-[0_0_20px_rgba(139,0,0,0.15)]">
              <Lock className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-xl font-serif italic font-black tracking-tight text-white uppercase">
              AutoAventus Access Vault
            </h2>
            <p className="text-[10px] text-zinc-500 mt-2 font-bold uppercase tracking-widest leading-relaxed">
              Secure Terminal / Operational Override
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="text-[9px] font-mono tracking-widest text-[#8B0000] uppercase font-black block mb-2">
                Passcode Required
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ENTER ACCESS KEY..."
                  className="w-full bg-black border border-zinc-900 focus:border-[#8B0000] p-3 pl-10 text-xs text-white uppercase font-mono tracking-widest focus:outline-none transition-colors"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-zinc-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {authError && (
              <p className="text-amber-500 font-mono text-[9px] text-center bg-amber-950/20 border border-amber-900/40 py-2.5 uppercase tracking-wider font-bold">
                ⚠ {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#8B0000] hover:bg-[#8B0000]/80 text-white font-mono text-[10px] font-black py-4 px-4 rounded-sm tracking-[0.25em] uppercase hover:shadow-[0_0_20px_rgba(139,0,0,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Authorize Override</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Admin Key helper */}
            <div className="bg-black/80 rounded-sm p-4 border border-zinc-900/80 text-center mt-5">
              <span className="text-[9px] font-mono text-zinc-500 block font-black uppercase tracking-widest mb-1">
                Pin Code Anchor:
              </span>
              <span className="text-xs font-mono font-bold text-white tracking-widest bg-zinc-900 px-3 py-1.5 inline-block">
                admin123
              </span>
            </div>
          </form>

          {/* Fallback button to showroom */}
          <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
            <button
              onClick={onClose}
              className="text-[9px] font-mono text-zinc-500 hover:text-white uppercase tracking-widest transition-colors inline-flex items-center gap-2 cursor-pointer font-bold"
            >
              <Home className="w-3.5 h-3.5 text-[#8B0000]" />
              <span>Return To Showroom</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Calculate high-level stats for the dashboard header
  const totalVehiclesCount = cars.length;
  const publishedCount = cars.filter(c => c.isPublic).length;
  const draftCount = totalVehiclesCount - publishedCount;
  const totalValuation = cars.reduce((total, car) => total + car.startingPrice, 0);

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200 font-sans flex flex-col md:flex-row relative">
      {/* Decorative vertical dark divider bar for tech console mood */}
      <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-[#8B0000] shadow-[0_0_20px_#8b0000] z-20 hidden md:block" />

      {/* Admin Sidebar Layout on wide viewports */}
      <aside className="w-full md:w-64 bg-[#080808] border-b md:border-b-0 md:border-r border-zinc-900 p-8 flex flex-col justify-between z-10 shrink-0">
        <div className="space-y-8">
          {/* Logo element */}
          <div className="text-[17px] font-sans font-black tracking-widest flex items-center text-white">
            <span className="text-[#8B0000] text-xl mr-1">A</span>UTOAVENTUS ADMIN
          </div>

          <div className="pt-4 space-y-2">
            <h4 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black mb-4">Operations Panel</h4>
            
            <button
              onClick={() => setIsAddingCar(false)}
              className={`w-full text-left px-4 py-3 rounded-sm text-[10px] font-mono tracking-wider transition-colors flex items-center gap-2.5 cursor-pointer ${
                !isAddingCar ? 'bg-[#8B0000]/10 border border-[#8B0000] text-white font-bold' : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>VEHICLE LIST ({totalVehiclesCount})</span>
            </button>

            <button
              onClick={() => setIsAddingCar(true)}
              className={`w-full text-left px-4 py-3 rounded-sm text-[10px] font-mono tracking-wider transition-colors flex items-center gap-2.5 cursor-pointer ${
                isAddingCar ? 'bg-[#8B0000]/10 border border-[#8B0000] text-white font-bold' : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD NEW CAR</span>
            </button>

            <button
              onClick={onResetDatabase}
              className="w-full text-left px-4 py-3 rounded-sm text-[10px] font-mono tracking-wider text-zinc-500 hover:text-[#8B0000] transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RESTORE SHOWROOM CARS</span>
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900 space-y-4 mt-8 md:mt-0">
          <div className="px-1 text-[10px] uppercase font-mono tracking-wider">
            <span className="text-zinc-500 block font-black">Access Level:</span>
            <span className="text-[#8B0000] font-black flex items-center gap-2 mt-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ADMIN USER</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-black border border-zinc-900 hover:border-[#8B0000] text-zinc-300 hover:text-white text-[10px] font-mono py-3 px-3 rounded-sm flex items-center justify-center gap-2 transition-colors cursor-pointer uppercase font-bold tracking-widest"
          >
            <span>Exit Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Operations Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen bg-[radial-gradient(circle_at_top_right,_#150303_0%,_#050505_70%)]">
        {/* Dynamic header row with analytics tiles */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border-b border-zinc-900 pb-8 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif italic text-white font-black leading-none">
              {isAddingCar ? "Add Custom Vehicle" : "Manage Showroom Cars"}
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-[#8B0000] font-mono font-black mt-2">
              System is online and running correctly
            </p>
          </div>

          {/* Quick Stats overview widgets strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full xl:w-auto">
            <div className="bg-zinc-900/60 border border-zinc-900 p-4 rounded-sm text-center">
              <span className="text-[8px] text-zinc-500 block font-mono font-black uppercase tracking-wider">Total Cars</span>
              <span className="text-lg font-mono font-black text-white">{totalVehiclesCount}</span>
            </div>
            <div className="bg-zinc-900/60 border border-[#8B0000]/20 p-4 rounded-sm text-center">
              <span className="text-[8px] text-[#8B0000] block font-mono font-black uppercase tracking-wider">Visible to Customers</span>
              <span className="text-lg font-mono font-black text-[#8B0000]">{publishedCount}</span>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-900/80 p-4 rounded-sm text-center">
              <span className="text-[8px] text-zinc-500 block font-mono font-black uppercase tracking-wider">Hidden Cars</span>
              <span className="text-lg font-mono font-black text-zinc-400">{draftCount}</span>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-900 p-4 rounded-sm text-center">
              <span className="text-[8px] text-zinc-500 block font-mono font-black uppercase tracking-wider">Total Stock Value</span>
              <span className="text-lg font-mono font-black text-zinc-100">₦{(totalValuation/1000000).toFixed(2)}M</span>
            </div>
          </div>
        </div>

        {/* Dynamic View switching */}
        {isAddingCar ? (
          /* FORM TO UPLOAD CAR */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl bg-zinc-950 border border-zinc-900 rounded-sm p-6 sm:p-8 shadow-2xl"
          >
            <h2 className="text-[10px] font-mono font-black uppercase tracking-widest text-[#8B0000] mb-8 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Enter Vehicle Details
            </h2>

            <form onSubmit={saveNewCar} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-2">Make *</label>
                  <input
                    type="text"
                    required
                    value={newCar.make}
                    onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
                    placeholder="e.g. Porsche"
                    className="w-full bg-black border border-zinc-900 focus:border-[#8B0000] text-xs text-white p-3 focus:outline-none rounded-sm uppercase tracking-wider"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-2">Model *</label>
                  <input
                    type="text"
                    required
                    value={newCar.model}
                    onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                    placeholder="e.g. GT3 RS"
                    className="w-full bg-black border border-zinc-900 focus:border-[#8B0000] text-xs text-white p-3 focus:outline-none rounded-sm uppercase tracking-wider"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-2">Production (Year)</label>
                  <input
                    type="number"
                    value={newCar.year}
                    onChange={(e) => setNewCar({ ...newCar, year: parseInt(e.target.value) })}
                    className="w-full bg-black border border-zinc-900 focus:border-[#8B0000] text-xs text-white p-3 focus:outline-none rounded-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-2">Price Tag (₦)</label>
                  <input
                    type="number"
                    value={newCar.startingPrice}
                    onChange={(e) => setNewCar({ ...newCar, startingPrice: parseInt(e.target.value) })}
                    className="w-full bg-black border border-zinc-900 focus:border-[#8B0000] text-xs p-3 focus:outline-none rounded-sm font-mono text-[#8B0000] font-black"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-2">Power Source Configuration</label>
                  <select
                    value={newCar.engineType}
                    onChange={(e) => setNewCar({ ...newCar, engineType: e.target.value as any })}
                    className="w-full bg-black border border-zinc-900 focus:border-[#8B0000] text-xs text-zinc-300 p-3 focus:outline-none rounded-sm uppercase tracking-widest cursor-pointer"
                  >
                    <option value="Nuclear Fusion">Nuclear Fusion</option>
                    <option value="Hydrogen Hybrid">Hydrogen Hybrid</option>
                    <option value="Tesla Ion Drive">Tesla Ion Drive</option>
                    <option value="Bi-Turbo Plasma">Bi-Turbo Plasma</option>
                    <option value="Quantum Overdrive">Quantum Overdrive</option>
                    <option value="Electric">Electric</option>
                    <option value="Gasoline">Gasoline</option>
                    <option value="Fuel">Fuel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-2">Product category</label>
                  <select
                    value={newCar.category}
                    onChange={(e) => setNewCar({ ...newCar, category: e.target.value as any })}
                    className="w-full bg-black border border-zinc-900 focus:border-[#8B0000] text-xs text-zinc-300 p-3 focus:outline-none rounded-sm uppercase tracking-widest cursor-pointer mb-4"
                  >
                    <option value="Interstellar GT">Interstellar GT</option>
                    <option value="Martian Cruiser">Martian Cruiser</option>
                    <option value="Lunar Outlaw">Lunar Outlaw</option>
                    <option value="Deep-Space Utility">Deep-Space Utility</option>
                  </select>

                  <div className="border border-zinc-900 bg-black/40 p-4 rounded-sm space-y-3">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-[#8B0000] font-black block">DEVICE PICTURE UPLOAD</span>
                    <p className="text-[9px] text-zinc-400 leading-relaxed uppercase">Upload custom photos, blueprints, or renders from your device. Files are converted to secure Base64 links and synced instantly.</p>
                    <label className="flex flex-col items-center justify-center border border-dashed border-zinc-850 hover:border-[#8B0000] bg-black/70 p-5 rounded-sm cursor-pointer transition-all hover:bg-[#8B0000]/5 group">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-5 h-5 text-zinc-500 group-hover:text-[#8B0000] transition-colors" />
                        <span className="text-[9px] font-mono text-zinc-400 group-hover:text-white uppercase font-bold tracking-wider">Select Device Image</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64String = reader.result as string;
                              setNewCar(prev => ({
                                ...prev,
                                mainImage: base64String,
                                images: [base64String],
                                colors: [
                                  { name: 'Showroom Custom', hex: '#8C9093', imageUrl: base64String }
                                ]
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-2">Catalog Image Resource URL / Data Link</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newCar.mainImage}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewCar(prev => ({
                          ...prev,
                          mainImage: val,
                          images: [val],
                          colors: [
                            { name: 'Showroom Custom', hex: '#8C9093', imageUrl: val }
                          ]
                        }));
                      }}
                      className="w-full bg-black border border-zinc-900 focus:border-[#8B0000] text-xs text-zinc-300 p-3 pr-10 focus:outline-none rounded-sm font-mono tracking-tighter truncate"
                      placeholder="Paste Image URL or choose device file..."
                    />
                    <Image className="w-4 h-4 text-zinc-700 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="mt-4 border border-zinc-900 p-3 rounded-sm bg-black/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500">Live Showroom Art Preview</span>
                      {newCar.mainImage?.startsWith('data:') && (
                        <span className="bg-emerald-950/25 border border-emerald-900/30 text-emerald-500 px-1.5 py-0.5 rounded-[2px] text-[7.5px] font-black uppercase font-mono">BASE64 SYNCED</span>
                      )}
                      {newCar.mainImage && !newCar.mainImage.startsWith('data:') && (
                        <span className="bg-[#8B0000]/10 border border-[#8B0000]/30 text-[#8B0000] px-1.5 py-0.5 rounded-[2px] text-[7.5px] font-black uppercase font-mono">URL LINK SYNCED</span>
                      )}
                    </div>
                    
                    <div className="h-32 w-full bg-[#030303] flex items-center justify-center rounded-sm overflow-hidden border border-zinc-950 relative group">
                      {newCar.mainImage ? (
                        <>
                          <img 
                            src={newCar.mainImage} 
                            alt="Configuration asset" 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <span className="text-[7.5px] text-zinc-400 font-mono uppercase tracking-widest truncate w-full">
                              {newCar.mainImage}
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className="text-[9px] font-mono text-zinc-600 uppercase">No asset selected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical specs breakdown */}
              <div className="bg-black border border-zinc-900 p-5 space-y-4">
                <h4 className="text-[9px] font-mono uppercase tracking-widest text-[#8B0000] font-black mb-3">Engine and Performance specifications setup</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[9px] font-mono uppercase text-zinc-500 block mb-1">Engine Block</label>
                    <input
                      type="text"
                      value={newCar.performance?.engine}
                      onChange={(e) => setNewCar({
                        ...newCar,
                        performance: { ...(newCar.performance as any), engine: e.target.value }
                      })}
                      className="w-full bg-zinc-950 border border-zinc-900 p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono uppercase text-zinc-500 block mb-1">Horsepower</label>
                    <input
                      type="number"
                      value={newCar.performance?.horsepower}
                      onChange={(e) => setNewCar({
                        ...newCar,
                        performance: { ...(newCar.performance as any), horsepower: parseInt(e.target.value) }
                      })}
                      className="w-full bg-zinc-950 border border-zinc-900 p-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono uppercase text-zinc-500 block mb-1">Acceleration</label>
                    <input
                      type="text"
                      value={newCar.performance?.acceleration}
                      onChange={(e) => setNewCar({
                        ...newCar,
                        performance: { ...(newCar.performance as any), acceleration: e.target.value }
                      })}
                      className="w-full bg-zinc-950 border border-zinc-900 p-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[9px] font-mono uppercase text-zinc-500 block mb-1">Top speed limit (MPH)</label>
                    <input
                      type="text"
                      value={newCar.performance?.topSpeed}
                      onChange={(e) => setNewCar({
                        ...newCar,
                        performance: { ...(newCar.performance as any), topSpeed: e.target.value }
                      })}
                      className="w-full bg-zinc-950 border border-zinc-900 p-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono uppercase text-zinc-500 block mb-1">Drivetrain layout</label>
                    <input
                      type="text"
                      value={newCar.performance?.drivetrain}
                      onChange={(e) => setNewCar({
                        ...newCar,
                        performance: { ...(newCar.performance as any), drivetrain: e.target.value }
                      })}
                      className="w-full bg-zinc-950 border border-zinc-900 p-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono uppercase text-zinc-500 block mb-1">Fuel Capacity</label>
                    <input
                      type="text"
                      value={newCar.performance?.fuelCapacity || ''}
                      onChange={(e) => setNewCar({
                        ...newCar,
                        performance: { ...(newCar.performance as any), fuelCapacity: e.target.value }
                      })}
                      placeholder="e.g. 70 Liters or 100 kWh"
                      className="w-full bg-zinc-950 border border-zinc-900 p-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Trim builder */}
              <div className="bg-black border border-zinc-900 p-5 space-y-4">
                <h4 className="text-[9px] font-mono uppercase tracking-widest text-[#8B0000] font-black mb-3">Configure trim versions</h4>
                <div className="flex flex-col sm:flex-row gap-3 border-b border-zinc-900 pb-4 mb-4 items-end">
                  <div className="flex-grow">
                    <label className="text-[9px] font-mono uppercase text-zinc-550 block mb-1">Trim Level Name</label>
                    <input
                      type="text"
                      value={trimName}
                      onChange={(e) => setTrimName(e.target.value)}
                      placeholder="e.g. Weissach, Black Series"
                      className="w-full bg-zinc-950 border border-zinc-900 p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono uppercase text-zinc-550 block mb-1">Trim Cost (₦)</label>
                    <input
                      type="number"
                      value={trimPrice}
                      onChange={(e) => setTrimPrice(parseInt(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-900 p-2.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono uppercase text-zinc-550 block mb-1">Hp Output</label>
                    <input
                      type="number"
                      value={trimHP}
                      onChange={(e) => setTrimHP(parseInt(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-900 p-2.5 text-xs text-white font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addTrimOption}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-[9px] font-black px-4 py-3 tracking-widest uppercase cursor-pointer"
                  >
                    + ADD TRIM
                  </button>
                </div>

                {/* Displaying configured levels */}
                <div className="space-y-2">
                  {newCar.trims && newCar.trims.length > 0 ? (
                    newCar.trims.map((t, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-zinc-950 p-3 text-xs rounded-sm border border-zinc-900">
                        <span className="font-bold text-zinc-200 font-mono text-[11px] uppercase tracking-wider">{t.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-[#8B0000] font-mono font-black">₦{t.price.toLocaleString()}</span>
                          <span className="text-zinc-500 font-mono text-[10px]">{t.horsepower} HP</span>
                          <button 
                            type="button" 
                            onClick={() => removeTrimOption(idx)}
                            className="text-zinc-600 hover:text-[#8B0000] cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[9.5px] text-zinc-600 font-mono uppercase font-bold tracking-wider italic">No custom trims declared. Showcase defaults will auto-generate on commit.</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-2">Description / Philosophy Summary</label>
                <textarea
                  value={newCar.description}
                  onChange={(e) => setNewCar({ ...newCar, description: e.target.value })}
                  placeholder="Summarize visual layout or dynamic design philosophies..."
                  rows={3}
                  className="w-full bg-black border border-zinc-900 focus:border-[#8B0000] text-xs text-white p-3 focus:outline-none rounded-sm uppercase tracking-wider leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-4 py-2">
                <button
                  type="button"
                  onClick={() => setNewCar({ ...newCar, isPublic: !newCar.isPublic })}
                  className="flex items-center gap-2.5 text-[10px] font-mono uppercase text-zinc-300 font-bold tracking-wider"
                >
                  {newCar.isPublic ? (
                    <ToggleRight className="w-6 h-6 text-[#8B0000] cursor-pointer" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-zinc-700 cursor-pointer" />
                  )}
                  <span>Publish directly to showroom database index</span>
                </button>
              </div>

              <div className="pt-6 flex gap-3 border-t border-zinc-900">
                <button
                  type="submit"
                  className="bg-[#8B0000] hover:bg-[#8B0000]/85 text-white font-mono text-[10px] font-black py-3.5 px-8 rounded-sm tracking-widest uppercase cursor-pointer"
                >
                  Save Car Spec Package
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCar(false)}
                  className="bg-black hover:bg-zinc-950 border border-zinc-900 text-zinc-400 font-mono text-[10px] py-3.5 px-8 rounded-sm uppercase tracking-widest cursor-pointer"
                >
                  Cancel configuration
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* LIST AND PRICE CONTROL MANAGEMENT */
          <div className="space-y-6">
            <div className="bg-[#0c0c0c] border border-zinc-900 rounded-sm overflow-hidden shadow-2xl">
              <div className="px-6 py-5 border-b border-zinc-900 bg-zinc-950/70 flex justify-between items-center flex-wrap gap-4">
                <h3 className="text-[10px] font-mono font-black tracking-widest text-[#8B0000] uppercase">
                  Showroom master index register ({totalVehiclesCount} assets)
                </h3>
                <span className="text-[9px] text-zinc-600 font-mono uppercase font-bold">
                  Modify table coordinates to trigger live database updates
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300 font-mono">
                  <thead className="bg-[#050505] text-zinc-500 border-b border-zinc-900">
                    <tr>
                      <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black">Curated Model</th>
                      <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black">Block Motor</th>
                      <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black">Horsepower</th>
                      <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black">Starting Base MSRP</th>
                      <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black text-center">Catalog Showcase Status</th>
                      <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black text-right">Delete Line</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 bg-zinc-950/20">
                    {cars.map((car) => (
                      <tr key={car.id} className="hover:bg-[#8B0000]/5 transition-colors duration-250">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative group/thumb w-14 h-9 border border-zinc-900 rounded-sm overflow-hidden bg-black flex-shrink-0 cursor-pointer" title="Click to upload/replace picture">
                              <img 
                                src={car.mainImage} 
                                alt="Line Artwork" 
                                className="w-full h-full object-cover transition-opacity group-hover/thumb:opacity-40"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                <Upload className="w-3.5 h-3.5 text-[#8B0000]" />
                              </div>
                              <input 
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      handleImageUploadForCar(car.id, reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </div>
                            <div>
                              <span className="font-bold text-white block leading-tight font-serif italic text-sm">{car.make} {car.model}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] text-zinc-500 uppercase tracking-wider">{car.year} Year / {car.category}</span>
                                <span 
                                  onClick={() => {
                                    const newUrl = prompt("Paste new picture URL link for this car:", car.mainImage);
                                    if (newUrl !== null && newUrl.trim() !== "") {
                                      handleImageUploadForCar(car.id, newUrl.trim());
                                    }
                                  }}
                                  className="text-[8.5px] font-mono text-[#8B0000] hover:text-white cursor-pointer hover:underline uppercase tracking-widest font-black"
                                  title="Manually paste a picture web link for this car"
                                >
                                  [ LINK ]
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-400 font-medium uppercase text-[10px]">{car.performance.engine}</td>
                        <td className="px-6 py-4 font-bold text-white text-[10.5px]">{car.performance.horsepower} hp</td>
                        
                        {/* Price change input directly editable */}
                        <td className="px-6 py-4">
                          <div className="relative max-w-[130px]">
                            <span className="text-[11px] font-mono font-black text-[#8B0000] absolute left-2.5 top-1/2 -translate-y-1/2 z-10">₦</span>
                            <input
                              type="number"
                              value={car.startingPrice}
                              onChange={(e) => handlePriceChange(car.id, parseInt(e.target.value) || 0)}
                              className="bg-black border border-zinc-900 focus:border-[#8B0000] rounded-sm w-full py-1.5 pl-6 pr-2 text-xs font-bold text-[#8B0000] focus:outline-none font-mono relative z-0"
                            />
                          </div>
                        </td>

                        {/* Showcase Toggle Status (Put on Public Website) */}
                        <td className="px-6 py-4 text-center">
                          <button
                            id={`public-toggle-${car.id}`}
                            onClick={() => toggleVisibility(car.id)}
                            className="inline-flex items-center gap-1.5 focus:outline-none transition-transform active:scale-95 cursor-pointer uppercase"
                            title={car.isPublic ? "Click to draft in vault" : "Click to showcase in open showroom"}
                          >
                            {car.isPublic ? (
                              <span className="bg-[#8B0000]/10 border border-[#8B0000]/30 text-[#8B0000] px-3 py-1.5 rounded-sm text-[8.5px] font-black flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>SHOWROOM ACTIVE</span>
                              </span>
                            ) : (
                              <span className="bg-black border border-zinc-900 text-zinc-500 px-3 py-1.5 rounded-sm text-[8.5px] font-bold flex items-center gap-1">
                                <EyeOff className="w-3 h-3" />
                                <span>VAULT RETRACTED</span>
                              </span>
                            )}
                          </button>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteCar(car.id)}
                            className="text-zinc-600 hover:text-[#8B0000] transition-colors p-1.5 rounded-sm hover:bg-black/40"
                            title="Delete car record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
