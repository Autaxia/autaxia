export function generateSeoText(category: string, filter: string) {
  const c = category.replace('-', ' ')
  const f = filter.replace('-', ' ')

  return {
    title: `Best ${c} cars for ${f} (2026)`,

    intro: `
Looking for the best ${c} cars for ${f}? 
This ranking highlights vehicles that combine performance, reliability and real ownership experience.

Choosing the right car depends on your needs. Whether you're focused on efficiency, budget or performance, 
this list helps you find the best option.
    `,

    outro: `
These cars have been selected based on real-world data, including maintenance costs, reliability scores 
and performance metrics. Always consider your personal needs before making a decision.
    `
  }
}