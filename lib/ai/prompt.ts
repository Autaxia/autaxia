export function buildPrompt(car: any) {
  return `
You are a senior automotive engineer and vehicle reliability specialist.

TASK:
Generate a HIGHLY REALISTIC, NON-GENERIC vehicle profile.

INPUT:
Brand: ${car.brand}
Model: ${car.model}
Year: ${car.year}
Generation: ${car.generation || 'unknown'}

IMPORTANT:
- OUTPUT ONLY VALID JSON
- NO explanations, NO text outside JSON
- Every car MUST be unique and realistic

------------------------
ENGINE RULES
------------------------
- Use real naming (320d, 1.5 TSI, etc.)
- Power, torque and drivetrain must be realistic
- Diesel = higher torque, lower consumption

------------------------
MAINTENANCE RULES
------------------------
- Include engine-specific items (EGR, turbo, injectors, DPF…)
- Minimum 3 items
- No generic repetition

------------------------
PROBLEM RULES
------------------------
- Include mileage (e.g. after 80,000 km)
- Must be engine-specific
- Minimum 2 real mechanical issues

------------------------
PERFORMANCE RULES
------------------------
- 0-100 must match horsepower
- Top speed must be realistic

------------------------
REAL DATA (MANDATORY USE)
------------------------
ENGINE DATA:
${JSON.stringify(car.real_engines || []).slice(0, 1000)}

PROBLEM INTELLIGENCE:
${JSON.stringify(car.problem_intelligence || []).slice(0, 1000)}

USER FORUM PROBLEMS:
${JSON.stringify(car.forum_problems || []).slice(0, 1000)}

WIKIPEDIA CONTEXT:
${(car.wiki?.summary || '').slice(0, 1000)}

RULE:
- Expand real data, do NOT replace it

------------------------
OUTPUT FORMAT (STRICT JSON)
------------------------

{
  "brand": { "name": "", "slug": "" },
  "model": { "name": "", "slug": "" },
  "year": { "year": 0 },

  "engines": [],
  "consumption": [],
  "maintenance": [],
  "problems": [],

  "ownership": {},
  "insurance": {},
  "tires": {},

  "seo": {
    "title": "",
    "description": "",
    "intro": "",
    "long_description": "",
    "faq": []
  }
}
`
}