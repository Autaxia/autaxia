export function scoreCar(data: any) {
  let score = 0
  const issues: string[] = []

  // engines
  if (data.engines?.length >= 3) score += 2
  else issues.push('few engines')

  // maintenance
  if (data.maintenance?.length >= 3) score += 2
  else issues.push('poor maintenance')

  // problems
  if (data.problems?.length >= 2) score += 2
  else issues.push('few problems')

  // seo
  if (data.seo?.description?.length > 120) score += 2
  else issues.push('weak SEO')

  // realism
  const hasTorque = data.engines?.some((e: any) => e.torque_nm > 100)
  if (hasTorque) score += 2
  else issues.push('weak engine realism')

  return {
    score,
    issues,
    valid: score >= 6
  }
}