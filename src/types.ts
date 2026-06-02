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
  engineType: string;
  category: string;
  description: string;
  performance: CarPerformance;
  mainImage: string;
  images: string[];
  trims: TrimLevel[];
  colors: ColorOption[];
  isPublic: boolean;
}

export type EngineTypeFilter = 'All' | string;

export interface FilterState {
  searchQuery: string;
  maxPrice: number;
  engineType: EngineTypeFilter;
  year: string;
}
