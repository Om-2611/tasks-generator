import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("specs")
    .select("*")
    .limit(1);

  if (error) {
    return NextResponse.json({ success: false, error });
  }

  return NextResponse.json({ success: true, data });
}
