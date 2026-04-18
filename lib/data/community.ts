export async function getCommunityInsights(query: string) {
  console.log('🌍 fake community for:', query)

  return [
    { title: 'Common issues', text: 'Users report typical wear and tear.' },
    { title: 'Reliability', text: 'Generally reliable with proper maintenance.' }
  ]
}