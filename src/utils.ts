export function simplifyCategory(category: string): string {
  switch (category) {
    case 'Interstellar GT':
      return 'Luxury Sports Tourer (GT)';
    case 'Martian Cruiser':
      return 'Heavy Off-Road SUV';
    case 'Lunar Outlaw':
      return 'All-Terrain Sports Buggy';
    case 'Deep-Space Utility':
      return 'Premium Family SUV';
    case 'Luxury SUV':
      return 'Luxury SUV';
    case 'Performance Sedan':
      return 'Performance Sedan';
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
