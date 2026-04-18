export function detectGeneration(car: any) {
  const brand = GENERATIONS[car.brand]
  if (!brand) return null

  const model = brand[car.model]
  if (!model) return null

  const gen = model.find(
    (g) => car.year >= g.start && car.year <= g.end
  )

  return gen ? gen.name : null
}
type Generation = {
  name: string
  start: number
  end: number
}

type BrandGenerations = {
  [model: string]: Generation[]
}

export const GENERATIONS: { [brand: string]: BrandGenerations } = {
  BMW: {
    '3 Series': [
      { name: 'E90/E91/E92/E93', start: 2005, end: 2011 },
      { name: 'F30/F31/F34', start: 2012, end: 2018 },
      { name: 'G20/G21', start: 2019, end: 9999 }
    ],

    '5 Series': [
      { name: 'E60/E61', start: 2003, end: 2010 },
      { name: 'F10/F11', start: 2010, end: 2016 },
      { name: 'G30/G31', start: 2017, end: 9999 }
    ],

    'X1': [
      { name: 'E84', start: 2009, end: 2015 },
      { name: 'F48', start: 2016, end: 2022 },
      { name: 'U11', start: 2022, end: 9999 }
    ]
  },

  Audi: {
    'A3': [
      { name: '8P', start: 2003, end: 2012 },
      { name: '8V', start: 2013, end: 2020 },
      { name: '8Y', start: 2020, end: 9999 }
    ],

    'A4': [
      { name: 'B7', start: 2004, end: 2008 },
      { name: 'B8', start: 2008, end: 2015 },
      { name: 'B9', start: 2016, end: 9999 }
    ],

    'A6': [
      { name: 'C6', start: 2004, end: 2011 },
      { name: 'C7', start: 2011, end: 2018 },
      { name: 'C8', start: 2018, end: 9999 }
    ]
  },

  'Mercedes-Benz': {
    'C-Class': [
      { name: 'W203', start: 2000, end: 2007 },
      { name: 'W204', start: 2007, end: 2014 },
      { name: 'W205', start: 2015, end: 2021 },
      { name: 'W206', start: 2022, end: 9999 }
    ],

    'E-Class': [
      { name: 'W211', start: 2002, end: 2009 },
      { name: 'W212', start: 2009, end: 2016 },
      { name: 'W213', start: 2016, end: 2023 },
      { name: 'W214', start: 2023, end: 9999 }
    ]
  },

  Volkswagen: {
    'Golf': [
      { name: 'Mk5', start: 2003, end: 2008 },
      { name: 'Mk6', start: 2008, end: 2012 },
      { name: 'Mk7', start: 2013, end: 2019 },
      { name: 'Mk8', start: 2020, end: 9999 }
    ]
  }
}