import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, updatedContent } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Spec ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("specs")
      .update({ output_markdown: updatedContent })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to update spec" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
