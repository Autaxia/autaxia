export function generatePost(page: any) {
  const name = `${page.brand} ${page.model} ${page.year}`

  return {
    reddit: `⚠️ ${name} problems — real owner data\n\nI analyzed real issues reported by owners. Here are the most common failures.\n\n👉 https://tuweb.com/${page.slug}`,

    twitter: `⚠️ ${name} problems revealed\n\nReal owner data shows common failures.\n\nhttps://tuweb.com/${page.slug}`,

    medium: `
# ${name} Problems (Real Data)

We analyzed real owner reports to uncover the most common issues.

👉 Full breakdown:
https://tuweb.com/${page.slug}
`
  }
}