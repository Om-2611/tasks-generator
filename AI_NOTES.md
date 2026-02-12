# AI Usage Notes

## LLM Used

Provider: OpenRouter  
Model: (Specify actual model you used, e.g. meta-llama/llama-3.1-8b-instruct or similar)

## Why This Model?

- Free tier availability
- Fast inference
- Good structured JSON output capability

## What AI Was Used For

- Generating structured user stories
- Generating engineering task breakdown
- Generating risks and milestones
- Assisting in code scaffolding
- Debugging integration issues

## What I Reviewed Manually

- Prompt structure validation
- JSON output validation
- Error handling logic
- Supabase integration
- State management logic
- Saving and updating specs
- API route correctness

## Prompt Engineering

- Forced strict JSON output
- Added explicit output schema
- Added “Return ONLY valid JSON”
- Added constraints for realistic milestones

All prompts used during development are recorded in PROMPTS_USED.md.
