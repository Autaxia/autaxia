export function buildEnginePages(engine: any) {
  const name = engine.name.toLowerCase().replace(/\s+/g, '-')

  return [
    `${name}-problems`,
    `${name}-reliability`,
    `${name}-maintenance`,
    `${name}-specs`
  ]
}