export async function getSerp(query: string) {
  console.log('🔎 fake SERP:', query)

  return [
    { title: 'Top result', snippet: 'Example result' }
  ]
}