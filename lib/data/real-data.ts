export function enrichRealData(data: any) {
  const brand = data.brand?.name?.toLowerCase() || ''
  const model = data.model?.name?.toLowerCase() || ''

  let problems: string[] = []
  let maintenance: string[] = []
  let engines: any[] = []

  // =========================
  // 🔥 REGLAS REALES
  // =========================

  if (model.includes('golf')) {
    problems = [
      'Water pump failure reported',
      'DSG gearbox issues in some versions'
    ]
    maintenance = [
      'Timing belt replacement required',
      'DSG service recommended'
    ]
  }

  if (model.includes('3 series') || model.includes('3-series')) {
    problems = [
      'Timing chain issues in early engines',
      'Oil leaks over time'
    ]
  }

  if (model.includes('gt r') || model.includes('gt-r')) {
    problems = [
      'High maintenance cost',
      'Brake wear due to performance'
    ]
    engines = [
      {
        power: 570,
        fuel_type: 'Petrol',
        transmission: 'Automatic'
      }
    ]
  }

  if (brand === 'toyota') {
    problems = ['Very few issues reported']
    maintenance = ['Low maintenance cost']
  }

  // =========================
  // 🔥 DEFAULT (fallback realista)
  // =========================

  if (!problems.length) {
    problems = [
      'Electrical issues in older models',
      'Suspension wear over time'
    ]
  }

  if (!maintenance.length) {
    maintenance = [
      'Regular oil changes required',
      'Brake maintenance recommended'
    ]
  }

  if (!engines.length) {
    engines = [
      {
        power: 150,
        fuel_type: 'Petrol',
        transmission: 'Manual'
      }
    ]
  }

  return {
    ...data,
    problems,
    maintenance,
    engines
  }
}