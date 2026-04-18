export function extractStructure(results: any[]) {

  const headings: string[] = []

  for (const r of results) {

    const cleaned = r.title
      .replace(/\d{4}/g, '') // quitar año
      .replace(/BMW X3/g, '') // quitar modelo

    headings.push(cleaned.trim())
  }

  return headings
}