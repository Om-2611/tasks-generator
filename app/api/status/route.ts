import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateTasks } from "@/lib/llm";

export async function GET() {
  let backend = true;
  let database = false;
  let llm = false;

  // Test DB
  try {
    const { error } = await supabase
      .from("specs")
      .select("id")
      .limit(1);

    if (!error) {
      database = true;
    }
  } catch (err) {
    database = false;
  }

  // Test LLM (lightweight prompt)
  try {
    const response = await generateTasks("Reply with OK only.");
    if (response.toLowerCase().includes("ok")) {
      llm = true;
    }
  } catch (err) {
    llm = false;
  }

  return NextResponse.json({
    backend,
    database,
    llm,
  });
}
