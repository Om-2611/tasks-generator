import { NextResponse } from "next/server";
import { generateTasks } from "@/lib/llm";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, goal, users, constraints, type } = body;

    if (!title || !goal) {
      return NextResponse.json(
        { error: "Title and Goal are required." },
        { status: 400 }
      );
    }

    const prompt = `
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

Feature Title: ${title}
Goal: ${goal}
Users: ${users || "Not specified"}
Constraints: ${constraints || "None"}
Type: ${type || "General"}

Rules:
- Be realistic.
- Use practical engineering tasks.
- Milestones must be in days or weeks.
- Return only valid JSON.
`;

    const rawOutput = await generateTasks(prompt);

    // Clean potential markdown wrappers
    const cleaned = rawOutput
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON Parse Error:", cleaned);
      return NextResponse.json(
        { error: "LLM returned invalid JSON" },
        { status: 500 }
      );
    }

    // Save JSON as string in DB
    const { error } = await supabase.from("specs").insert([
      {
        title,
        goal,
        users,
        constraints,
        output_markdown: JSON.stringify(parsed),
      },
    ]);

    if (error) {
      console.error("DB Insert Error:", error);
      return NextResponse.json(
        { error: "Failed to save spec" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: parsed,
    });

  } catch (error) {
    console.error("Generate API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
