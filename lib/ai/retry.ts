export function buildRetryPrompt(original: string, issues: string[]) {
  return `
${original}

CRITICAL:
Previous output failed due to:

${issues.join('\n')}

You MUST fix all issues and regenerate the JSON.
Return ONLY JSON.
`
}