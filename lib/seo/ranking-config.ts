export type RankingType =
  | 'reliable'
  | 'few-problems'
  | 'low-maintenance'
  | 'diesel'
  | 'petrol'
  | 'automatic'
  | 'budget'
  | 'high-mileage'

export const rankingConfigs: Record<
  RankingType,
  {
    title: string
    description: string
    filter: (car: any) => boolean
  }
> = {
  reliable: {
    title: 'Most Reliable Cars',
    description: 'Ranking based on real-world reliability and owner reports.',
    filter: () => true,
  },

  'few-problems': {
    title: 'Cars With Fewer Problems',
    description: 'Vehicles with fewer reported issues based on real data.',
    filter: (car) => (car.problems?.length || 0) <= 2,
  },

  'low-maintenance': {
    title: 'Low Maintenance Cars',
    description: 'Cars with lower maintenance requirements.',
    filter: () => true,
  },

  diesel: {
    title: 'Best Diesel Cars',
    description: 'Top diesel vehicles ranked by reliability and ownership.',
    filter: (car) => car.fuel_type === 'diesel',
  },

  petrol: {
    title: 'Best Petrol Cars',
    description: 'Top petrol vehicles ranked by reliability.',
    filter: (car) => car.fuel_type === 'petrol',
  },

  automatic: {
    title: 'Best Automatic Cars',
    description: 'Top automatic transmission vehicles.',
    filter: (car) => car.transmission === 'automatic',
  },

  budget: {
    title: 'Best Budget Cars',
    description: 'Affordable cars with good reliability and low costs.',
    filter: () => true,
  },

  'high-mileage': {
    title: 'Best Cars for High Mileage',
    description: 'Cars that perform well even at high mileage.',
    filter: () => true,
  },
}