export function simplifyCategory(category: string): string {
  const norm = category.toLowerCase();
  switch (norm) {
    case 'sedan':
      return 'Premium Sedan';
    case 'suv':
      return 'Luxury SUV';
    case 'hatchback':
      return 'Sport Hatchback';
    case 'coupe':
      return 'Grand Coupe';
    case 'truck':
      return 'Heavy Duty Truck';
    case 'minivan':
      return 'Executive Minivan';
    default:
      return category;
  }
}

export function simplifyEngine(engineType: string): string {
  switch (engineType) {
    case 'Nuclear Fusion':
      return 'Nuclear Electric Engine';
    case 'Hydrogen Hybrid':
      return 'Hydrogen Hybrid Engine';
    case 'Tesla Ion Drive':
      return 'High-Power Electric Drive';
    case 'Bi-Turbo Plasma':
      return 'Twin-Turbo Gasoline Engine';
    case 'Quantum Overdrive':
      return 'Advanced Multi-Motor Electric';
    case 'Electric':
      return 'Pure Electric Motor';
    case 'Gasoline':
      return 'Gasoline (Petrol) Combustion';
    case 'Fuel':
      return 'Hybrid Fuel System';
    default:
      return engineType;
  }
}
