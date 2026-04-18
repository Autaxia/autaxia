export function adaptPrompt(basePrompt: string, feedback: any[]) {
  if (!feedback || feedback.length === 0) return basePrompt

  const issues = feedback
    .flatMap(f => f.issues || [])
    .slice(0, 10)
    .join('\n- ')

  return `
${basePrompt}

IMPORTANT IMPROVEMENTS BASED ON REAL FAILURES:
- ${issues}

RULE:
Fix ALL these issues. Do not repeat mistakes.
`
}