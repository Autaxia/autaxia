export const MODEL_DATABASE: Record<string, any> = {

  // =========================
  // AUDI
  // =========================
  'audi-a3': {
    engines: [
      { name: '1.5 TFSI', power: 150, fuel: 'Petrol' },
      { name: '2.0 TDI', power: 150, fuel: 'Diesel' }
    ],
    problems: [
      'Water pump failures reported',
      'DSG gearbox hesitation at low speeds',
      'Carbon buildup in TFSI engines'
    ]
  },

  'audi-a4': {
    engines: [
      { name: '2.0 TDI', power: 150, fuel: 'Diesel' },
      { name: '2.0 TFSI', power: 190, fuel: 'Petrol' }
    ],
    problems: [
      'Timing chain wear in older engines',
      'Oil consumption in TFSI engines',
      'Suspension bush wear'
    ]
  },

  // =========================
  // BMW
  // =========================
  'bmw-3-series': {
    engines: [
      { name: '320d', power: 190, fuel: 'Diesel' },
      { name: '330i', power: 258, fuel: 'Petrol' }
    ],
    problems: [
      'Timing chain issues in N47 engines',
      'EGR valve problems',
      'Oil leaks over time'
    ]
  },

  'bmw-1-series': {
    engines: [
      { name: '118i', power: 140, fuel: 'Petrol' },
      { name: '120d', power: 190, fuel: 'Diesel' }
    ],
    problems: [
      'Clutch wear in manual models',
      'Timing chain concerns in older diesel engines'
    ]
  },

  // =========================
  // VOLKSWAGEN
  // =========================
  'volkswagen-golf': {
    engines: [
      { name: '1.5 TSI', power: 150, fuel: 'Petrol' },
      { name: '2.0 TDI', power: 150, fuel: 'Diesel' }
    ],
    problems: [
      'Water pump failures',
      'DSG gearbox issues',
      'Turbo actuator faults'
    ]
  },

  'volkswagen-passat': {
    engines: [
      { name: '2.0 TDI', power: 150, fuel: 'Diesel' }
    ],
    problems: [
      'AdBlue system failures',
      'EGR valve issues',
      'Suspension wear'
    ]
  },

  // =========================
  // TOYOTA
  // =========================
  'toyota-corolla': {
    engines: [
      { name: '1.8 Hybrid', power: 122, fuel: 'Hybrid' }
    ],
    problems: [
      'Very few common issues reported',
      'Battery degradation in high mileage units'
    ]
  },

  'toyota-yaris': {
    engines: [
      { name: '1.5 Hybrid', power: 116, fuel: 'Hybrid' }
    ],
    problems: [
      'Minimal reliability issues',
      'Brake wear in city use'
    ]
  },

  'toyota-rav4': {
    engines: [
      { name: '2.5 Hybrid', power: 218, fuel: 'Hybrid' }
    ],
    problems: [
      'Hybrid battery wear after high mileage',
      'Infotainment glitches'
    ]
  },

  // =========================
  // FORD
  // =========================
  'ford-focus': {
    engines: [
      { name: '1.0 EcoBoost', power: 125, fuel: 'Petrol' }
    ],
    problems: [
      'Timing belt in oil issues',
      'Cooling system leaks',
      'Clutch wear'
    ]
  },

  'ford-fiesta': {
    engines: [
      { name: '1.0 EcoBoost', power: 100, fuel: 'Petrol' }
    ],
    problems: [
      'Gearbox issues in some models',
      'Cooling system problems'
    ]
  },

  // =========================
  // MERCEDES
  // =========================
  'mercedes-benz-c-class': {
    engines: [
      { name: 'C220d', power: 194, fuel: 'Diesel' }
    ],
    problems: [
      'AdBlue system failures',
      'Electrical glitches',
      'Suspension wear'
    ]
  },

  'mercedes-benz-a-class': {
    engines: [
      { name: 'A180', power: 136, fuel: 'Petrol' }
    ],
    problems: [
      'Infotainment system bugs',
      'Clutch wear in manual versions'
    ]
  },

  // =========================
  // HYUNDAI / KIA
  // =========================
  'hyundai-i30': {
    engines: [
      { name: '1.0 T-GDI', power: 120, fuel: 'Petrol' }
    ],
    problems: [
      'Minor electrical issues',
      'Brake wear'
    ]
  },

  'kia-sportage': {
    engines: [
      { name: '1.6 CRDi', power: 136, fuel: 'Diesel' }
    ],
    problems: [
      'DPF issues in short trips',
      'Suspension wear'
    ]
  },

  // =========================
  // VOLVO
  // =========================
  'volvo-xc60': {
    engines: [
      { name: 'B5', power: 250, fuel: 'Petrol Hybrid' }
    ],
    problems: [
      'Infotainment glitches',
      'Sensor calibration issues'
    ]
  },

  // =========================
  // MAZDA
  // =========================
  'mazda-3': {
    engines: [
      { name: '2.0 Skyactiv-G', power: 122, fuel: 'Petrol' }
    ],
    problems: [
      'Paint quality issues',
      'Infotainment lag'
    ]
  },

  // =========================
  // NISSAN
  // =========================
  'nissan-qashqai': {
    engines: [
      { name: '1.3 DIG-T', power: 140, fuel: 'Petrol' }
    ],
    problems: [
      'CVT gearbox issues',
      'Suspension noise'
    ]
  },

  // =========================
  // PEUGEOT
  // =========================
  'peugeot-308': {
    engines: [
      { name: '1.2 PureTech', power: 130, fuel: 'Petrol' }
    ],
    problems: [
      'Timing belt wear in oil bath engines',
      'Electrical glitches'
    ]
  },

  // =========================
  // RENAULT
  // =========================
  'renault-megane': {
    engines: [
      { name: '1.5 dCi', power: 115, fuel: 'Diesel' }
    ],
    problems: [
      'Injector issues',
      'EGR valve faults'
    ]
  }

}