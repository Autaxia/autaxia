export function generateInsights(data: any, job: any) {
  const insights: string[] = []
  const problems: string[] = data.problems || []

  const avgMPG = data.engines?.[0]?.mpg || 0
  const fuel = data.engines?.[0]?.fuel

  // 🔥 MPG ANALYSIS
  if (avgMPG > 60) {
    insights.push('Excellent fuel efficiency compared to similar vehicles')
  } else if (avgMPG < 35) {
    insights.push('Higher fuel consumption than average in its segment')
  }

  // 🔥 ENGINE ANALYSIS
  if (fuel === 'Diesel') {
    insights.push('Diesel engines may experience DPF-related issues in short trips')
  }

  if (fuel === 'Petrol' && avgMPG < 40) {
    problems.push('Higher fuel consumption reported in petrol variants')
  }

  // 🔥 AGE BASED
  if (job.year < 2018) {
    problems.push('Older models may show increased wear and tear')
  }

  return {
    problems: Array.from(new Set(problems)),
    insights
  }
}