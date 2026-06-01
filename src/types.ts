export interface TrimLevel {
  id: string;
  name: string;
  price: number;
  engine: string;
  horsepower: number;
  acceleration: string; // e.g. "2.5s"
  topSpeed: string; // e.g. "211 mph"
}

export interface ColorOption {
  name: string;
  hex: string;
  imageUrl: string;
}

export interface CarPerformance {
  acceleration: string;
  horsepower: number;
  topSpeed: string;
  engine: string;
  drivetrain: string;
  fuelCapacity?: string;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  startingPrice: number;
  engineType: 'Nuclear Fusion' | 'Hydrogen Hybrid' | 'Tesla Ion Drive' | 'Bi-Turbo Plasma' | 'Quantum Overdrive' | 'Electric' | 'Gasoline' | 'Fuel';
  category: 'Interstellar GT' | 'Martian Cruiser' | 'Lunar Outlaw' | 'Deep-Space Utility' | 'Luxury SUV' | 'Performance Sedan';
  description: string;
  performance: CarPerformance;
  mainImage: string;
  images: string[];
  trims: TrimLevel[];
  colors: ColorOption[];
  isPublic: boolean;
}

export type EngineTypeFilter = 'All' | 'Nuclear Fusion' | 'Hydrogen Hybrid' | 'Tesla Ion Drive' | 'Bi-Turbo Plasma' | 'Quantum Overdrive' | 'Electric' | 'Gasoline' | 'Fuel';

export interface FilterState {
  searchQuery: string;
  maxPrice: number;
  engineType: EngineTypeFilter;
  year: string;
}
