# Prompts Used During Development

## 1️⃣ Initial Generation Prompt

You are a senior product engineer.

Return ONLY valid JSON. No markdown. No explanations.

Format exactly like this:

{
  "userStories": ["..."],
  "engineeringTasks": {
    "frontend": ["..."],
    "backend": ["..."],
    "database": ["..."],
    "devops": ["..."]
  },
  "risks": ["..."],
  "milestones": ["..."]
}

Feature Title: {title}
Goal: {goal}
Users: {users}
Constraints: {constraints}
Type: {type}

Rules:
- Be realistic.
- Use practical engineering tasks.
- Milestones must be in days or weeks.
- Return only valid JSON.

---

## 2️⃣ JSON Cleanup Prompt Adjustments

- Enforced strict formatting
- Removed markdown fences
- Added structured milestones requirement

---

## 3️⃣ Refinement Prompts

- Improve realism
- Avoid vague engineering tasks
- Use production-level breakdown
