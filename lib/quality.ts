export function checkRealism(car: any) {
  let issues = []

  const engines = car.engines || []

  for (const e of engines) {
    // ⚙️ potencia vs aceleración
    if (e.power_hp && e.zero_to_hundred) {
      if (e.power_hp < 150 && e.zero_to_hundred < 8) {
        issues.push('aceleracion_irreal')
      }

      if (e.power_hp > 300 && e.zero_to_hundred > 7) {
        issues.push('performance_incorrecto')
      }
    }

    // ⚙️ torque vs potencia
    if (e.torque_nm && e.power_hp) {
      if (e.torque_nm < e.power_hp * 1.5) {
        issues.push('torque_bajo')
      }
    }

    // ⚙️ top speed absurda
    if (e.top_speed_kmh > 320) {
      issues.push('velocidad_irreal')
    }
  }

  return {
    valid: issues.length === 0,
    issues
  }
}