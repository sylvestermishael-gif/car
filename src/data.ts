import { Car } from './types';

export const INITIAL_CARS: Car[] = [
  {
    id: 'autoaventus-chronos-gt',
    make: 'AUTOAVENTUS',
    model: 'Chronos GT-V',
    year: 2026,
    startingPrice: 48000000,
    engineType: 'Tesla Ion Drive',
    category: 'Interstellar GT',
    description: 'An ultra-luxury high-altitude grand tourer engineered to glide effortlessly over planetary landscapes. Features carbon-titanium body panels, biometric cockpit interfaces, and a magnetic suspension tuned for extreme terrain comfort.',
    performance: {
      acceleration: '1.9s',
      horsepower: 1200,
      topSpeed: '250 mph',
      engine: 'Tesla Quad-Phase Ion Reactor',
      drivetrain: 'Vector-Stabilized Active AWD',
      fuelCapacity: '95 Liters'
    },
    mainImage: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      {
        name: 'Crimson Plasma Red',
        hex: '#8B0000',
        imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1200'
      },
      {
        name: 'Meteor Charcoal (Matte)',
        hex: '#1C1C1C',
        imageUrl: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=1200'
      },
      {
        name: 'Stardust Bronze Satin',
        hex: '#4A3E2A',
        imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200'
      }
    ],
    trims: [
      {
        id: 'chronos-base',
        name: 'Standard Excursion Spec',
        price: 48000000,
        engine: 'Tesla Quad-Phase Ion Reactor',
        horsepower: 1200,
        acceleration: '1.9s',
        topSpeed: '250 mph'
      },
      {
        id: 'chronos-speedway',
        name: 'Speedway Horizon Package (Gravity Aero)',
        price: 54500000,
        engine: 'Tesla Overclocked Quad-Phase Ion Reactor',
        horsepower: 1350,
        acceleration: '1.75s',
        topSpeed: '265 mph'
      }
    ],
    isPublic: true
  },
  {
    id: 'autoaventus-atlas-6x6',
    make: 'AUTOAVENTUS',
    model: 'Atlas Expedition 6x6',
    year: 2026,
    startingPrice: 125000000,
    engineType: 'Nuclear Fusion',
    category: 'Martian Cruiser',
    description: 'The ultimate planetary flagship. A powerhouse heavy cruiser fitted with custom micro-atmosphere generators, independent active vector cooling on all six tracks, and a luxurious oak-and-titanium command desk.',
    performance: {
      acceleration: '2.8s',
      horsepower: 2400,
      topSpeed: '190 mph',
      engine: 'Miniature Tokamak Fusion Engine',
      drivetrain: '6x6 Continuous Planetary Traction',
      fuelCapacity: '150 Liters'
    },
    mainImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      {
        name: 'Outpost Sand Ochre',
        hex: '#C2986E',
        imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200'
      },
      {
        name: 'Obsidian Night Gloss',
        hex: '#050505',
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200'
      }
    ],
    trims: [
      {
        id: 'atlas-expedition',
        name: 'Base Expedition Spec',
        price: 125000000,
        engine: 'Miniature Tokamak Fusion Core',
        horsepower: 2400,
        acceleration: '2.8s',
        topSpeed: '190 mph'
      },
      {
        id: 'atlas-command-fortress',
        name: 'Command Fortress (Atmosphere Generator)',
        price: 148000000,
        engine: 'Dual-Core Tokamak Fusion Matrix',
        horsepower: 2800,
        acceleration: '2.5s',
        topSpeed: '200 mph'
      }
    ],
    isPublic: true
  },
  {
    id: 'autoaventus-apollo-buggy',
    make: 'AUTOAVENTUS',
    model: 'Apollo Lunar Outlaw',
    year: 2025,
    startingPrice: 34000000,
    engineType: 'Tesla Ion Drive',
    category: 'Lunar Outlaw',
    description: 'An open-air high-velocity buggy built for absolute fun on zero-gravity gravel trails. Composed of raw carbon safety cages, dynamic solar wing collectors, and light track wheels inspired by moon-landings.',
    performance: {
      acceleration: '2.2s',
      horsepower: 950,
      topSpeed: '160 mph',
      engine: 'High-Velocity Tesla Ion Grid',
      drivetrain: 'Active Dynamic RWD',
      fuelCapacity: '80 Liters'
    },
    mainImage: 'https://images.unsplash.com/photo-1547038577-da80abbc4f19?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1547038577-da80abbc4f19?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      {
        name: 'Solar Flaring Orange',
        hex: '#D95C14',
        imageUrl: 'https://images.unsplash.com/photo-1547038577-da80abbc4f19?auto=format&fit=crop&q=80&w=1200'
      },
      {
        name: 'Hypercar Matte Black',
        hex: '#111111',
        imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200'
      }
    ],
    trims: [
      {
        id: 'apollo-buggy-base',
        name: 'Lunar Dune Bugger Base',
        price: 34000000,
        engine: 'High-Velocity Tesla Ion Grid',
        horsepower: 950,
        acceleration: '2.2s',
        topSpeed: '160 mph'
      },
      {
        id: 'apollo-buggy-outlaw',
        name: 'Outlaw Lunar Speedster (Carbon Tub)',
        price: 39500000,
        engine: 'Quad-Motor Lithium Ion Vector Pulse',
        horsepower: 1100,
        acceleration: '2.0s',
        topSpeed: '172 mph'
      }
    ],
    isPublic: true
  },
  {
    id: 'autoaventus-polaris-heavy',
    make: 'AUTOAVENTUS',
    model: 'Polaris Heavy Overlander',
    year: 2026,
    startingPrice: 78000000,
    engineType: 'Hydrogen Hybrid',
    category: 'Deep-Space Utility',
    description: 'Constructed to withstand hazardous atmospheres and extreme temperature swings. Polar is a majestic overland cruiser featuring full self-sufficient sleep berths, oxygen filtration, and liquid-hydrogen high-efficiency cells.',
    performance: {
      acceleration: '3.4s',
      horsepower: 1450,
      topSpeed: '205 mph',
      engine: 'Multiphase Liquid Hydrogen Twin System',
      drivetrain: 'Intelligent Continuous AWD',
      fuelCapacity: '110 Liters'
    },
    mainImage: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      {
        name: 'Atmospheric White Satin',
        hex: '#E5E8E4',
        imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200'
      },
      {
        name: 'Abyssal Black Deep Gloss',
        hex: '#0A0A0B',
        imageUrl: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=1200'
      }
    ],
    trims: [
      {
        id: 'polaris-overlander-base',
        name: 'Polaris Heavy 4x4 Standard',
        price: 78000000,
        engine: 'Multiphase Liquid Hydrogen Drive',
        horsepower: 1450,
        acceleration: '3.4s',
        topSpeed: '205 mph'
      },
      {
        id: 'polaris-dome-lux',
        name: 'Dome Residence Lux Edition',
        price: 89000000,
        engine: 'Overbuilt Hydrogen Fuel Cell Matrix + Battery Reserve',
        horsepower: 1600,
        acceleration: '3.2s',
        topSpeed: '210 mph'
      }
    ],
    isPublic: true
  },
  {
    id: 'autoaventus-nemesis-plasma',
    make: 'AUTOAVENTUS',
    model: 'Nemesis Plasma Racer',
    year: 2026,
    startingPrice: 91000000,
    engineType: 'Bi-Turbo Plasma',
    category: 'Martian Cruiser',
    description: 'A pure track-focused absolute beast. Nemesis utilizes a super-dense plasma burner array that compresses cosmic elements for immediate warp-like velocity. Composed of an vacuum-venturi aerodynamic hull and hypercar stance.',
    performance: {
      acceleration: '1.7s',
      horsepower: 1800,
      topSpeed: '285 mph',
      engine: 'Bespoke Dual-Turbo Charged Plasma Burner',
      drivetrain: 'Magneto-Tuned Vector AWD',
      fuelCapacity: '70 Liters'
    },
    mainImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      {
        name: 'Nemesis Gloss Charcoal',
        hex: '#2B2B2C',
        imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200'
      },
      {
        name: 'Racing Core Giallo',
        hex: '#EDC948',
        imageUrl: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200'
      }
    ],
    trims: [
      {
        id: 'nemesis-base',
        name: 'Standard Plasma Burner',
        price: 91000000,
        engine: 'Bespoke Dual-Turbocharged Plasma Burner',
        horsepower: 1800,
        acceleration: '1.7s',
        topSpeed: '285 mph'
      },
      {
        id: 'nemesis-apex',
        name: 'Apex Solar Fusion Championship Spec',
        price: 115000000,
        engine: 'Triple-Stage Magnetic Plasma Accelerator Core',
        horsepower: 2150,
        acceleration: '1.55s',
        topSpeed: '305 mph'
      }
    ],
    isPublic: true
  },
  {
    id: 'autoaventus-zenith-yacht',
    make: 'AUTOAVENTUS',
    model: 'Zenith Space Yacht',
    year: 2026,
    startingPrice: 320000000,
    engineType: 'Quantum Overdrive',
    category: 'Interstellar GT',
    description: 'Unprecedented opulence fused with ultimate mechanics. Zenith features gold-leaf heatshields, a full self-regulating lounge cabin with floating leather captain seats, and a silent quantum resonance engine that moves beyond standard speed limitations.',
    performance: {
      acceleration: '1.2s',
      horsepower: 3200,
      topSpeed: '340 mph',
      engine: 'Quantum Resonance Slipstream Core',
      drivetrain: 'Dynamic Gravitational Suspension',
      fuelCapacity: '130 Liters'
    },
    mainImage: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      {
        name: 'Quantum Satin Gold',
        hex: '#D4AF37',
        imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200'
      },
      {
        name: 'Space Grey Gloss Metallic',
        hex: '#7A8B99',
        imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200'
      }
    ],
    trims: [
      {
        id: 'zenith-base',
        name: 'Zenith Space Suite Standard',
        price: 320000000,
        engine: 'Quantum Resonance Slipstream Core',
        horsepower: 3200,
        acceleration: '1.2s',
        topSpeed: '340 mph'
      },
      {
        id: 'zenith-monarch',
        name: 'Monarch Royal Bespoke (24K Gold Plated Details)',
        price: 385000000,
        engine: 'Overclocked Dual-Node Quantum Slipstream Engine',
        horsepower: 3600,
        acceleration: '1.1s',
        topSpeed: '360 mph'
      }
    ],
    isPublic: true
  },
  {
    id: 'luxury-bmw-x5',
    make: 'BMW',
    model: 'X5 M-Sport',
    year: 2022,
    startingPrice: 4500000,
    engineType: 'Gasoline',
    category: 'Luxury SUV',
    description: 'A masterpiece of terrestrial luxury and engineering. This pristine BMW X5 combines spacious internal cabin berths with executive black gloss styling, active electronic damping, and incredible cargo utility.',
    performance: {
      acceleration: '4.7s',
      horsepower: 445,
      topSpeed: '155 mph',
      engine: '3.0L TwinPower Turbo Inline-6',
      drivetrain: 'xDrive Intelligent AWD (15,000 km mileage)',
      fuelCapacity: '83 Liters'
    },
    mainImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      {
        name: 'Black Sapphire Metallic',
        hex: '#0A0A0B',
        imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200'
      }
    ],
    trims: [
      {
        id: 'bmw-x5-standard',
        name: 'xDrive40i M-Sport',
        price: 4500000,
        engine: '3.0L TwinPower Turbo I6',
        horsepower: 335,
        acceleration: '5.3s',
        topSpeed: '150 mph'
      },
      {
        id: 'bmw-x5-m50i',
        name: 'X5 M50i Executive',
        price: 6400000,
        engine: '4.4L Twin-Turbo V8',
        horsepower: 523,
        acceleration: '4.1s',
        topSpeed: '155 mph'
      }
    ],
    isPublic: true
  },
  {
    id: 'luxury-tesla-s',
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2023,
    startingPrice: 7000000,
    engineType: 'Electric',
    category: 'Performance Sedan',
    description: 'An peak-efficiency all-electric pioneer from Earth. Plated in high-gloss pearl white, with only 5,000 km of planetary travel. Fast-charge ion capability coupled with instant torque transmission.',
    performance: {
      acceleration: '1.99s',
      horsepower: 1020,
      topSpeed: '200 mph',
      engine: 'Tri-Motor Electric Drive Unit',
      drivetrain: 'Dual-Vector Active AWD (5,000 km mileage)',
      fuelCapacity: '100 kWh'
    },
    mainImage: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      {
        name: 'Pearl White Multi-Coat',
        hex: '#F9FAFB',
        imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200'
      }
    ],
    trims: [
      {
        id: 'tesla-s-plaid',
        name: 'Tri-Motor Plaid Spec',
        price: 7000000,
        engine: 'Tri-Motor Electric Drive Unit',
        horsepower: 1020,
        acceleration: '1.99s',
        topSpeed: '200 mph'
      }
    ],
    isPublic: true
  },
  {
    id: 'luxury-toyota-supra',
    make: 'Toyota',
    model: 'GR Supra GT Premium',
    year: 2024,
    startingPrice: 5800000,
    engineType: 'Gasoline',
    category: 'Performance Sedan',
    description: 'An track-focused performance masterpiece resulting from decades of legendary racing heritage. Features a finely-tuned twin-scroll turbocharged inline-six, active rear differential, adaptive suspension, and racing-focused cockpits.',
    performance: {
      acceleration: '3.9s',
      horsepower: 382,
      topSpeed: '155 mph',
      engine: '3.0L Twin-Scroll Turbocharged Inline-6',
      drivetrain: 'Rear-Wheel Drive (RWD)',
      fuelCapacity: '52 Liters'
    },
    mainImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      {
        name: 'Absolute Zero White',
        hex: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200'
      },
      {
        name: 'Renascence Red',
        hex: '#D11A2A',
        imageUrl: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1200'
      }
    ],
    trims: [
      {
        id: 'supra-premium-base',
        name: '3.0 Premium MT Sport',
        price: 5800000,
        engine: '3.0L Twin-Scroll Turbo I6',
        horsepower: 382,
        acceleration: '3.9s',
        topSpeed: '155 mph'
      },
      {
        id: 'supra-gr-special',
        name: 'GR Anniversary Special Edition',
        price: 6400000,
        engine: 'Tune-Up 3.0L Twin-Scroll Turbo I6',
        horsepower: 410,
        acceleration: '3.7s',
        topSpeed: '162 mph'
      }
    ],
    isPublic: true
  },
  {
    id: 'luxury-lexus-lfa',
    make: 'Lexus',
    model: 'LFA Nürburgring Edition',
    year: 2012,
    startingPrice: 37500000,
    engineType: 'Gasoline',
    category: 'Interstellar GT',
    description: 'A legendary automotive milestone utilizing composite carbon-fiber monocoque structure and a custom high-revving naturally aspirated V10 engine designed in partnership with Yamaha. F1 acoustics integrated seamlessly.',
    performance: {
      acceleration: '3.6s',
      horsepower: 563,
      topSpeed: '202 mph',
      engine: '4.8L Dual VVT-i Naturally Aspirated V10',
      drivetrain: 'Rear-Wheel Drive (RWD)',
      fuelCapacity: '73 Liters'
    },
    mainImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      {
        name: 'Nürburgring Gloss Orange',
        hex: '#FF6F00',
        imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200'
      },
      {
        name: 'Whitest White Satin',
        hex: '#FAFAFF',
        imageUrl: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200'
      }
    ],
    trims: [
      {
        id: 'lexus-lfa-std',
        name: 'LFA Standard Coupe',
        price: 37500000,
        engine: '4.8L Naturally Aspirated V10',
        horsepower: 552,
        acceleration: '3.7s',
        topSpeed: '202 mph'
      },
      {
        id: 'lexus-lfa-nurburgring',
        name: 'Nürburgring Commemorative Package',
        price: 44500000,
        engine: 'Enhanced Calibrated 4.8L V10',
        horsepower: 563,
        acceleration: '3.6s',
        topSpeed: '204 mph'
      }
    ],
    isPublic: true
  },
  {
    id: 'luxury-audi-etron',
    make: 'Audi',
    model: 'e-tron GT RS',
    year: 2024,
    startingPrice: 104000000,
    engineType: 'Electric',
    category: 'Performance Sedan',
    description: 'An electric masterpiece of engineering and craftsmanship, featuring legendary Quattro all-wheel drive, dual-motor power delivery, futuristic sound orchestration, and highly responsive technological cockpits.',
    performance: {
      acceleration: '2.9s',
      horsepower: 637,
      topSpeed: '155 mph',
      engine: 'Dual Synchronous Electric Motors',
      drivetrain: 'quattro Electric All-Wheel Drive',
      fuelCapacity: '93 kWh'
    },
    mainImage: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      {
        name: 'Tactical Green Metallic',
        hex: '#3E4B3E',
        imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200'
      },
      {
        name: 'Ascari Blue Metallic',
        hex: '#1E2C4A',
        imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200'
      }
    ],
    trims: [
      {
        id: 'audi-etron-rs',
        name: 'RS e-tron GT Standard',
        price: 104000000,
        engine: 'Dual Synchronous Electric Motors',
        horsepower: 637,
        acceleration: '2.9s',
        topSpeed: '155 mph'
      },
      {
        id: 'audi-etron-performance',
        name: 'RS e-tron GT Carbon Edition',
        price: 115000000,
        engine: 'RS Tuned Dual Electric Motors',
        horsepower: 646,
        acceleration: '2.8s',
        topSpeed: '155 mph'
      }
    ],
    isPublic: true
  }
];
