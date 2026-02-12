import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("specs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch specs" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, specs: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
