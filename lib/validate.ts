export function validateCar(data: any) {
  if (!data) return null

  if (!data.brand?.name) return null
  if (!data.model?.name) return null
  if (!data.year?.year) return null

  if (!data.engines || data.engines.length === 0) {
    data.engines = [{
      name: "Default Engine",
      power_hp: 150,
      torque_nm: 250,
      fuel_type: "Petrol",
      transmission: "Automatic",
      drivetrain: "FWD",
      top_speed_kmh: 210,
      zero_to_hundred: 9
    }]
  }

  return data
}