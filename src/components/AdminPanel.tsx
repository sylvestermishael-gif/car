import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, KeyRound, Database, RefreshCw, Plus, ToggleLeft, ToggleRight, 
  Trash2, DollarSign, CheckCircle2, Eye, EyeOff, Home, ArrowRight,
  Upload, Image, X, Edit, Sliders
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
    category: 'coupe',
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

  // Gallery Management States
  const [selectedCarForGallery, setSelectedCarForGallery] = useState<Car | null>(null);
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

  // Editing Car Master States
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [editTrimName, setEditTrimName] = useState('');
  const [editTrimPrice, setEditTrimPrice] = useState<number>(150000);
  const [editTrimHP, setEditTrimHP] = useState<number>(650);
  const [editColorName, setEditColorName] = useState('');
  const [editColorHex, setEditColorHex] = useState('#8B0000');

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
        // If the new image is not in the list, prepend/add to current list
        const currentImages = [...(car.images || [])];
        if (!currentImages.includes(base64OrUrl)) {
          currentImages.unshift(base64OrUrl);
        }
        return { 
          ...car, 
          mainImage: base64OrUrl,
          images: currentImages,
          colors: car.colors.map((c, i) => i === 0 ? { ...c, imageUrl: base64OrUrl } : c)
        };
      }
      return car;
    });
    onUpdateCars(updated);
  };

  // Gallery Modification Helpers
  const handleAddImageToGallery = (imageUrl: string) => {
    if (!selectedCarForGallery || !imageUrl.trim()) return;
    
    const updatedImages = [...(selectedCarForGallery.images || [])];
    if (!updatedImages.includes(imageUrl.trim())) {
      updatedImages.push(imageUrl.trim());
    }
    
    const updatedCar = {
      ...selectedCarForGallery,
      images: updatedImages,
      mainImage: selectedCarForGallery.mainImage || imageUrl.trim()
    };
    
    setSelectedCarForGallery(updatedCar);
    const updatedCars = cars.map(c => c.id === selectedCarForGallery.id ? updatedCar : c);
    onUpdateCars(updatedCars);
  };

  const handleMakeMainImage = (imageUrl: string) => {
    if (!selectedCarForGallery) return;
    
    const updatedCar = {
      ...selectedCarForGallery,
      mainImage: imageUrl,
      colors: selectedCarForGallery.colors.map((c, i) => i === 0 ? { ...c, imageUrl: imageUrl } : c)
    };
    
    setSelectedCarForGallery(updatedCar);
    const updatedCars = cars.map(c => c.id === selectedCarForGallery.id ? updatedCar : c);
    onUpdateCars(updatedCars);
  };

  const handleRemoveImageFromGallery = (imageUrl: string) => {
    if (!selectedCarForGallery) return;
    
    const updatedImages = (selectedCarForGallery.images || []).filter(img => img !== imageUrl);
    let newMain = selectedCarForGallery.mainImage;
    if (newMain === imageUrl) {
      newMain = updatedImages[0] || 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1200';
    }
    
    const updatedCar = {
      ...selectedCarForGallery,
      images: updatedImages,
      mainImage: newMain,
      colors: selectedCarForGallery.colors.map((c, i) => i === 0 ? { ...c, imageUrl: newMain } : c)
    };
    
    setSelectedCarForGallery(updatedCar);
    const updatedCars = cars.map(c => c.id === selectedCarForGallery.id ? updatedCar : c);
    onUpdateCars(updatedCars);
  };

  // Edit Car Modal Handlers
  const handleSaveEditedCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;
    if (!editingCar.make || !editingCar.model) {
      alert("Please provide vehicle make and model.");
      return;
    }
    const updated = cars.map(c => c.id === editingCar.id ? editingCar : c);
    onUpdateCars(updated);
    setEditingCar(null);
  };

  const handleAddTrimToEditingCar = () => {
    if (!editingCar || !editTrimName.trim()) return;
    const newTrim: TrimLevel = {
      id: `trim-${Date.now()}`,
      name: editTrimName.trim(),
      price: editTrimPrice,
      engine: editingCar.performance?.engine || 'Engine Standard',
      horsepower: editTrimHP,
      acceleration: editingCar.performance?.acceleration || '3.2s',
      topSpeed: editingCar.performance?.topSpeed || '205 mph'
    };
    setEditingCar({
      ...editingCar,
      trims: [...(editingCar.trims || []), newTrim]
    });
    setEditTrimName('');
  };

  const handleRemoveTrimFromEditingCar = (trimId: string) => {
    if (!editingCar) return;
    setEditingCar({
      ...editingCar,
      trims: editingCar.trims.filter(t => t.id !== trimId)
    });
  };

  const handleAddColorToEditingCar = () => {
    if (!editingCar || !editColorName.trim()) return;
    const newColor: ColorOption = {
      name: editColorName.trim(),
      hex: editColorHex,
      imageUrl: editingCar.mainImage
    };
    setEditingCar({
      ...editingCar,
      colors: [...(editingCar.colors || []), newColor]
    });
    setEditColorName('');
  };

  const handleRemoveColorFromEditingCar = (colorName: string) => {
    if (!editingCar) return;
    setEditingCar({
      ...editingCar,
      colors: editingCar.colors.filter(c => c.name !== colorName)
    });
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
      category: newCar.category as any || 'coupe',
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
      category: 'coupe',
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
                    <option value="sedan">sedan</option>
                    <option value="suv">suv</option>
                    <option value="hatchback">hatchback</option>
                    <option value="coupe">coupe</option>
                    <option value="truck">truck</option>
                    <option value="minivan">minivan</option>
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
                      <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black text-right">Administrative Controls</th>
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
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-[9px] text-zinc-550 uppercase tracking-wider">{car.year} / {car.category}</span>
                                <span className="text-zinc-800 font-bold">//</span>
                                <button
                                  onClick={() => setSelectedCarForGallery(car)}
                                  className="text-[8.5px] font-mono text-red-400 hover:text-red-300 cursor-pointer hover:underline uppercase tracking-widest font-black flex items-center gap-1 bg-red-950/20 border border-red-900/30 px-1.5 py-0.5 rounded-sm active:scale-95 transition-transform"
                                  title="Add and edit alternative gallery photos"
                                >
                                  <Image className="w-2.5 h-2.5 text-red-500" />
                                  <span>Gallery ({car.images?.length || 0})</span>
                                </button>
                                <span className="text-zinc-800 font-bold">//</span>
                                <span 
                                  onClick={() => {
                                    const newUrl = prompt("Paste new picture URL link for this car:", car.mainImage);
                                    if (newUrl !== null && newUrl.trim() !== "") {
                                      handleImageUploadForCar(car.id, newUrl.trim());
                                    }
                                  }}
                                  className="text-[8.5px] font-mono text-zinc-400 hover:text-white cursor-pointer hover:underline uppercase tracking-widest font-black"
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
                          <div className="flex justify-end items-center gap-2">
                            <button
                              onClick={() => setEditingCar({ ...car })}
                              className="text-zinc-400 hover:text-white border border-zinc-900 bg-zinc-950 p-1.5 rounded-sm hover:border-[#8B0000] cursor-pointer transition-colors"
                              title="Edit all fields and metadata"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-zinc-800 font-bold">//</span>
                            <button
                              onClick={() => handleDeleteCar(car.id)}
                              className="text-zinc-600 hover:text-[#8B0000] border border-zinc-900 bg-zinc-950 p-1.5 rounded-sm hover:border-[#8B0000] cursor-pointer transition-colors"
                              title="Delete car record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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

      {/* RENDER THE INTERACTIVE PHOTO GALLERY MODAL */}
      <AnimatePresence>
        {selectedCarForGallery && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedCarForGallery(null)}
          >
            <motion.div 
              initial={{ scale: 0.96, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-[#0a0a0a] border border-zinc-900 rounded-sm p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col gap-6 font-sans text-neutral-200"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#8B0000] uppercase font-black">
                    VEHICLE IMAGERY OVERRIDE // CONFIG: {selectedCarForGallery.id.toUpperCase()}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif italic text-white font-black mt-1">
                    {selectedCarForGallery.make} <span className="text-[#8B0000]">{selectedCarForGallery.model}</span> Gallery
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedCarForGallery(null)}
                  className="w-9 h-9 bg-black border border-zinc-900 hover:border-[#8B0000] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Add New Photo Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0e0e0e] border border-zinc-900 p-5 rounded-sm">
                <div>
                  <h4 className="text-[9px] font-mono tracking-widest text-[#8B0000] uppercase font-black mb-3.5">
                    1. Upload Device Photo
                  </h4>
                  <label className="flex flex-col items-center justify-center border border-dashed border-zinc-800 hover:border-red-500/50 bg-black/70 p-6 rounded-sm cursor-pointer transition-all hover:bg-red-950/5 group text-center">
                    <Upload className="w-6 h-6 text-zinc-500 group-hover:text-red-500 transition-colors mb-2" />
                    <span className="text-[10px] font-mono font-bold text-zinc-400 group-hover:text-white uppercase tracking-wider">Select Device Image File</span>
                    <span className="text-[8px] font-mono text-zinc-650 uppercase mt-1 text-zinc-500">Syncs as Base64 link</span>
                    <input 
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            handleAddImageToGallery(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="text-[9px] font-mono tracking-widest text-[#8B0000] uppercase font-black mb-3.5">
                      2. Add via Image Web Link
                    </h4>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={galleryUrlInput}
                        onChange={(e) => setGalleryUrlInput(e.target.value)}
                        placeholder="Paste image URL (e.g. https://...)"
                        className="flex-grow bg-black border border-zinc-850 p-2.5 text-xs text-zinc-300 focus:border-[#8B0000] focus:outline-none rounded-sm font-mono tracking-tight"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (galleryUrlInput.trim()) {
                            handleAddImageToGallery(galleryUrlInput.trim());
                            setGalleryUrlInput('');
                          }
                        }}
                        className="bg-[#8B0000] hover:bg-[#8B0000]/80 text-white text-[9.5px] font-mono tracking-wider font-extrabold px-3 uppercase cursor-pointer transition-colors"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {/* Stock Photos Presets */}
                  <div className="mt-4 pt-4 border-t border-zinc-900/40">
                    <span className="text-[8px] font-mono text-zinc-550 uppercase tracking-widest block mb-2 font-bold">
                      💡 Preset Luxury Stock Backdrops
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { name: 'Ferrari Red', url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200' },
                        { name: 'Porsche Silver', url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200' },
                        { name: 'Aston Green', url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200' },
                        { name: 'Bugatti Blue', url: 'https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&q=80&w=1200' }
                      ].map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => handleAddImageToGallery(item.url)}
                          className="bg-black border border-zinc-850 hover:border-[#8B0000] text-zinc-400 hover:text-white px-2 py-1 text-[8.5px] font-mono uppercase rounded-sm transition-all cursor-pointer"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery Grid Display */}
              <div>
                <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block mb-3 font-bold">
                  Active Gallery Photos ({selectedCarForGallery.images?.length || 0})
                </span>
                
                {selectedCarForGallery.images && selectedCarForGallery.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedCarForGallery.images.map((img, idx) => {
                      const isMain = selectedCarForGallery.mainImage === img;
                      return (
                        <div 
                          key={idx} 
                          className={`relative group h-28 sm:h-32 rounded-sm bg-black border overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                            isMain ? 'border-[#8B0000] shadow-[0_0_15px_rgba(139,0,0,0.25)]' : 'border-zinc-900 hover:border-zinc-700'
                          }`}
                        >
                          {/* Image */}
                          <img 
                            src={img} 
                            alt={`Gallery asset ${idx}`} 
                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            referrerPolicy="no-referrer"
                          />

                          {/* Hover Overlay Controls */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-between p-2">
                            {/* Top row actions (Delete) */}
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleRemoveImageFromGallery(img)}
                                className="w-6 h-6 bg-black/80 border border-zinc-800 hover:border-[#8B0000]/60 hover:text-[#8B0000] text-zinc-400 flex items-center justify-center rounded-sm cursor-pointer transition-colors"
                                title="Delete photo from gallery"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Bottom row actions (Set as Main) */}
                            <div>
                              {!isMain ? (
                                <button
                                  type="button"
                                  onClick={() => handleMakeMainImage(img)}
                                  className="w-full bg-black/90 hover:bg-[#8B0000] text-white border border-zinc-800 hover:border-[#8B0000] uppercase text-[7.5px] font-mono font-black py-1 px-1.5 transition-colors cursor-pointer rounded-sm"
                                >
                                  SET MAIN COVER
                                </button>
                              ) : (
                                <span className="block text-center text-[#8B0000] bg-black/90 font-mono text-[7.5px] font-black py-1 rounded-sm border border-[#8B0000]/30 select-none tracking-widest">
                                  PRIMARY SPEC
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Normal non-hover Badge indicators */}
                          {!isMain ? (
                            <div className="absolute left-2 top-2 bg-black/60 px-1.5 py-0.5 border border-zinc-850 rounded-[2px] pointer-events-none group-hover:opacity-0 transition-opacity">
                              <span className="text-[7px] text-zinc-400 font-mono font-bold">ALT VIEW</span>
                            </div>
                          ) : (
                            <div className="absolute left-2 top-2 bg-[#8B0000]/95 px-1.5 py-0.5 border border-red-500/30 rounded-[2px] pointer-events-none group-hover:opacity-0 transition-opacity">
                              <span className="text-[7.5px] text-white font-mono font-black tracking-widest">PRIMARY</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center p-10 bg-[#070707] border border-zinc-900 rounded-sm">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black">
                      No gallery assets uploaded for this model yet. Add photos above.
                    </p>
                  </div>
                )}
              </div>

              {/* Close Button Footer */}
              <div className="border-t border-zinc-900 pt-5 flex justify-between items-center text-[9px] font-mono text-zinc-500 uppercase">
                <span>All modifications instantly sync with the Master Registry</span>
                <button
                  type="button"
                  onClick={() => setSelectedCarForGallery(null)}
                  className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-650 text-zinc-300 font-mono text-[10px] font-black py-2.5 px-6 rounded-sm uppercase tracking-widest cursor-pointer transition-colors"
                >
                  Close Gallery Override
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RENDER THE INTERACTIVE EDIT CAR MODAL */}
      <AnimatePresence>
        {editingCar && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm overflow-y-auto"
            onClick={() => setEditingCar(null)}
          >
            <motion.div 
              initial={{ scale: 0.96, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-[#0a0a0a] border border-zinc-900 rounded-sm p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col gap-6 font-sans text-neutral-200"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#8B0000] uppercase font-black">
                    VEHICLE OVERRIDE CONSOLE // ID: {editingCar.id.toUpperCase()}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif italic text-white font-black mt-1">
                    Edit {editingCar.make} <span className="text-[#8B0000]">{editingCar.model}</span> Specs
                  </h3>
                </div>
                <button 
                  onClick={() => setEditingCar(null)}
                  className="w-9 h-9 bg-black border border-zinc-900 hover:border-[#8B0000] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditedCar} className="space-y-6">
                {/* General Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-2">Make *</label>
                    <input
                      type="text"
                      required
                      value={editingCar.make}
                      onChange={(e) => setEditingCar({ ...editingCar, make: e.target.value })}
                      className="w-full bg-black border border-zinc-900 focus:border-[#8B0000] text-xs text-white p-3 focus:outline-none rounded-sm uppercase tracking-wider"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-2">Model *</label>
                    <input
                      type="text"
                      required
                      value={editingCar.model}
                      onChange={(e) => setEditingCar({ ...editingCar, model: e.target.value })}
                      className="w-full bg-black border border-zinc-900 focus:border-[#8B0000] text-xs text-white p-3 focus:outline-none rounded-sm uppercase tracking-wider"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-2">Production Year</label>
                    <input
                      type="number"
                      value={editingCar.year}
                      onChange={(e) => setEditingCar({ ...editingCar, year: parseInt(e.target.value) || 2026 })}
                      className="w-full bg-black border border-zinc-900 focus:border-[#8B0000] text-xs text-white p-3 focus:outline-none rounded-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-2">Base Cost Amount (₦)</label>
                    <input
                      type="number"
                      value={editingCar.startingPrice}
                      onChange={(e) => setEditingCar({ ...editingCar, startingPrice: parseInt(e.target.value) || 0 })}
                      className="w-full bg-black border border-zinc-900 focus:border-[#8B0000] text-xs p-3 focus:outline-none rounded-sm font-mono text-[#8B0000] font-black"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-2">Power Source Configuration</label>
                    <select
                      value={editingCar.engineType}
                      onChange={(e) => setEditingCar({ ...editingCar, engineType: e.target.value })}
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
                    <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-2">Product Category</label>
                    <select
                      value={editingCar.category}
                      onChange={(e) => setEditingCar({ ...editingCar, category: e.target.value })}
                      className="w-full bg-black border border-zinc-900 focus:border-[#8B0000] text-xs text-zinc-300 p-3 focus:outline-none rounded-sm uppercase tracking-widest cursor-pointer mb-4"
                    >
                      <option value="sedan">sedan</option>
                      <option value="suv">suv</option>
                      <option value="hatchback">hatchback</option>
                      <option value="coupe">coupe</option>
                      <option value="truck">truck</option>
                      <option value="minivan">minivan</option>
                    </select>

                    <div className="border border-zinc-900 bg-black/40 p-4 rounded-sm space-y-3">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-[#8B0000] font-black block">REPLACE PRIMARY SPEC IMAGE</span>
                      <p className="text-[9px] text-zinc-400 leading-relaxed uppercase">Select image from device to write as the primary layout cover.</p>
                      <label className="flex flex-col items-center justify-center border border-dashed border-zinc-850 hover:border-[#8B0000] bg-black/70 p-4 rounded-sm cursor-pointer transition-all hover:bg-[#8B0000]/5 group">
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
                                const updatedImages = [...(editingCar.images || [])];
                                if (!updatedImages.includes(base64String)) {
                                  updatedImages.unshift(base64String);
                                }
                                setEditingCar({
                                  ...editingCar,
                                  mainImage: base64String,
                                  images: updatedImages,
                                  colors: editingCar.colors.map((c, i) => i === 0 ? { ...c, imageUrl: base64String } : c)
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-2">Display Cover Image URL</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={editingCar.mainImage}
                        onChange={(e) => {
                          const val = e.target.value;
                          const updatedImages = [...(editingCar.images || [])];
                          if (val && !updatedImages.includes(val)) {
                            updatedImages.unshift(val);
                          }
                          setEditingCar({
                            ...editingCar,
                            mainImage: val,
                            images: updatedImages,
                            colors: editingCar.colors.map((c, i) => i === 0 ? { ...c, imageUrl: val } : c)
                          });
                        }}
                        className="w-full bg-black border border-zinc-900 focus:border-[#8B0000] text-xs text-zinc-300 p-3 pr-10 focus:outline-none rounded-sm font-mono tracking-tighter truncate"
                        placeholder="Paste image URL..."
                      />
                      <Image className="w-4 h-4 text-zinc-700 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div className="mt-4 border border-zinc-900 p-3 rounded-sm bg-black/50">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">Live Cover Preview</span>
                      <div className="h-28 w-full bg-[#030303] flex items-center justify-center rounded-sm overflow-hidden border border-zinc-950 relative">
                        {editingCar.mainImage ? (
                          <img 
                            src={editingCar.mainImage} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-[9px] font-mono text-zinc-650 uppercase">No Cover Loaded</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical performance specifications */}
                <div className="bg-black border border-zinc-900 p-5 space-y-4 rounded-sm">
                  <span className="text-[9.5px] font-mono uppercase tracking-widest text-[#8B0000] font-black block">
                    Engineering Specs Matrix
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[9px] font-mono uppercase text-zinc-550 block mb-1">Engine Unit description</label>
                      <input
                        type="text"
                        value={editingCar.performance.engine}
                        onChange={(e) => setEditingCar({
                          ...editingCar,
                          performance: { ...editingCar.performance, engine: e.target.value }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-900 p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono uppercase text-zinc-550 block mb-1">Total Horsepower</label>
                      <input
                        type="number"
                        value={editingCar.performance.horsepower}
                        onChange={(e) => setEditingCar({
                          ...editingCar,
                          performance: { ...editingCar.performance, horsepower: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-900 p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono uppercase text-[#8B0000] block mb-1">Acceleration (0-60)</label>
                      <input
                        type="text"
                        value={editingCar.performance.acceleration}
                        onChange={(e) => setEditingCar({
                          ...editingCar,
                          performance: { ...editingCar.performance, acceleration: e.target.value }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-900 p-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[9px] font-mono uppercase text-zinc-550 block mb-1">Top Speed (MPH)</label>
                      <input
                        type="text"
                        value={editingCar.performance.topSpeed}
                        onChange={(e) => setEditingCar({
                          ...editingCar,
                          performance: { ...editingCar.performance, topSpeed: e.target.value }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-900 p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono uppercase text-zinc-550 block mb-1">Drivetrain Configuration</label>
                      <input
                        type="text"
                        value={editingCar.performance.drivetrain}
                        onChange={(e) => setEditingCar({
                          ...editingCar,
                          performance: { ...editingCar.performance, drivetrain: e.target.value }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-900 p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono uppercase text-zinc-550 block mb-1">Fuel / Energy Capacity</label>
                      <input
                        type="text"
                        value={editingCar.performance.fuelCapacity || ''}
                        onChange={(e) => setEditingCar({
                          ...editingCar,
                          performance: { ...editingCar.performance, fuelCapacity: e.target.value }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-900 p-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Colors Management Panel */}
                <div className="bg-black border border-zinc-900 p-5 space-y-4 rounded-sm">
                  <span className="text-[9.5px] font-mono uppercase tracking-widest text-[#8B0000] font-black block">
                    Paint Finishes & Color Schemes ({editingCar.colors?.length || 0})
                  </span>
                  
                  <div className="flex flex-col sm:flex-row gap-3 border-b border-zinc-900/60 pb-4 items-end">
                    <div className="flex-grow">
                      <label className="text-[9px] font-mono uppercase text-zinc-500 block mb-1">Color Name</label>
                      <input
                        type="text"
                        value={editColorName}
                        onChange={(e) => setEditColorName(e.target.value)}
                        placeholder="e.g. Aventador Gold"
                        className="w-full bg-zinc-950 border border-zinc-900 p-2 text-xs text-white"
                      />
                    </div>
                    <div className="w-full sm:w-28">
                      <label className="text-[9px] font-mono uppercase text-zinc-500 block mb-1">Hex Color Code</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={editColorHex}
                          onChange={(e) => setEditColorHex(e.target.value)}
                          className="w-9 h-8 bg-black border border-zinc-900 rounded-sm cursor-pointer"
                        />
                        <input
                          type="text"
                          value={editColorHex}
                          onChange={(e) => setEditColorHex(e.target.value)}
                          placeholder="#000000"
                          className="w-full bg-zinc-950 border border-zinc-900 p-1 text-center text-xs text-white font-mono uppercase"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddColorToEditingCar}
                      disabled={!editColorName.trim()}
                      className="bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 text-zinc-300 font-mono text-[9px] px-4 py-2.5 uppercase tracking-wider h-9 cursor-pointer active:scale-95 transition-all text-center disabled:opacity-40"
                    >
                      + ADD COLOR
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {editingCar.colors?.map((c, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-2 bg-[#0c0c0c] border border-zinc-900 rounded-sm py-1.5 px-2.5 text-xs text-zinc-300"
                      >
                        <span 
                          className="w-3.5 h-3.5 border border-black rounded-full" 
                          style={{ backgroundColor: c.hex }} 
                        />
                        <span className="font-mono text-[10.5px] uppercase font-bold">{c.name}</span>
                        <span className="text-zinc-600 font-mono text-[9px]">{c.hex}</span>
                        {editingCar.colors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveColorFromEditingCar(c.name)}
                            className="text-zinc-500 hover:text-[#8B0000] cursor-pointer pl-1.5 border-l border-zinc-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trims Management Panel */}
                <div className="bg-black border border-zinc-900 p-5 space-y-4 rounded-sm">
                  <span className="text-[9.5px] font-mono uppercase tracking-widest text-[#8B0000] font-black block">
                    Trim Grade Configurations ({editingCar.trims?.length || 0})
                  </span>

                  <div className="flex flex-col sm:flex-row gap-3 border-b border-zinc-900/60 pb-4 items-end">
                    <div className="flex-grow">
                      <label className="text-[9px] font-mono uppercase text-zinc-500 block mb-1">Trim Level Name</label>
                      <input
                        type="text"
                        value={editTrimName}
                        onChange={(e) => setEditTrimName(e.target.value)}
                        placeholder="e.g. Dynamic GTS, Premium S"
                        className="w-full bg-zinc-950 border border-zinc-900 p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono uppercase text-zinc-500 block mb-1">Trim Cost (₦)</label>
                      <input
                        type="number"
                        value={editTrimPrice}
                        onChange={(e) => setEditTrimPrice(parseInt(e.target.value) || 0)}
                        className="w-full bg-zinc-950 border border-zinc-900 p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono uppercase text-zinc-500 block mb-1">Hp Output</label>
                      <input
                        type="number"
                        value={editTrimHP}
                        onChange={(e) => setEditTrimHP(parseInt(e.target.value) || 0)}
                        className="w-full bg-zinc-950 border border-zinc-900 p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTrimToEditingCar}
                      disabled={!editTrimName.trim()}
                      className="bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 text-zinc-300 font-mono text-[9px] px-4 py-2.5 uppercase tracking-wider h-9 cursor-pointer active:scale-95 transition-all text-center disabled:opacity-40"
                    >
                      + ADD TRIM
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingCar.trims?.map((t, idx) => (
                      <div 
                        key={idx} 
                        className="flex justify-between items-center bg-[#070707] p-2.5 text-xs rounded-sm border border-zinc-900"
                      >
                        <span className="font-bold text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
                          {t.name}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-[#8B0000] font-mono font-black">₦{t.price.toLocaleString()}</span>
                          <span className="text-zinc-500 font-mono text-[10px]">{t.horsepower} HP</span>
                          {editingCar.trims.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => handleRemoveTrimFromEditingCar(t.id)}
                              className="text-zinc-600 hover:text-[#8B0000] cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bio text info */}
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-2">Description / Philosophy Summary</label>
                  <textarea
                    value={editingCar.description}
                    onChange={(e) => setEditingCar({ ...editingCar, description: e.target.value })}
                    rows={3}
                    className="w-full bg-black border border-[#111] focus:border-[#8B0000] text-xs text-white p-3 focus:outline-none rounded-sm uppercase tracking-wider leading-relaxed"
                  />
                </div>

                {/* Visibility Status */}
                <div className="flex items-center gap-4 py-2 border-t border-zinc-900/60">
                  <button
                    type="button"
                    onClick={() => setEditingCar({ ...editingCar, isPublic: !editingCar.isPublic })}
                    className="flex items-center gap-2.5 text-[10px] font-mono uppercase text-zinc-300 font-bold tracking-wider cursor-pointer"
                  >
                    {editingCar.isPublic ? (
                      <ToggleRight className="w-6 h-6 text-[#8B0000]" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-zinc-700" />
                    )}
                    <span>Directly publish this vehicle model on the public catalog</span>
                  </button>
                </div>

                {/* Footer buttons row */}
                <div className="pt-6 flex gap-3 border-t border-zinc-900">
                  <button
                    type="submit"
                    className="bg-[#8B0000] hover:bg-[#8B0000]/85 text-white font-mono text-[10px] font-black py-3.5 px-8 rounded-sm tracking-widest uppercase cursor-pointer"
                  >
                    Commit Updated Package
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCar(null)}
                    className="bg-black hover:bg-zinc-950 border border-zinc-900 text-zinc-400 font-mono text-[10px] py-3.5 px-8 rounded-sm uppercase tracking-widest cursor-pointer"
                  >
                    Discard Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
