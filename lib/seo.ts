export function enhanceSEO(data: any) {
  const name = `${data.brand.name} ${data.model.name} ${data.year.year}`

  const problems = data.forumData?.[0]?.title || 'common problems'
  const engine = data.real_engines?.[0]?.name || ''

  data.seo = {
    title: `${name} Problems, Reliability & Specs (${data.year.year})`,
    
    description: `${name} ${engine ? engine + ' engine,' : ''} real problems, reliability data, maintenance cost and owner issues. Updated ${new Date().getFullYear()}.`,

    h1: `${name} Problems, Reliability & Specs`,

    intro: `${name} is one of the most searched cars in its segment. Here you’ll find real owner problems, engine reliability and maintenance costs.`,

    hook: `⚠️ Real owners report issues like: ${problems}`,

    long_description: `
${name} is known for its ${engine || 'engine options'} but also has some common problems reported by users.

In this guide:
- Real reliability insights
- Known failures
- Maintenance costs
- Engine comparisons
`,

    faq: [
      {
        question: `Is ${name} reliable?`,
        answer: `Depends on the engine. Some versions are very reliable while others have known issues reported by owners.`
      },
      {
        question: `What are common problems of ${name}?`,
        answer: problems
      }
    ]
  }

  return data
}