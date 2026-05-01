import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { courseId } = await request.json();

  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Check existing enrollment
  const { data: existing } = await supabase
    .from("enrollments")
    .select("id, is_active")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single();

  if (existing?.is_active) {
    return NextResponse.json({ enrolled: true, alreadyEnrolled: true });
  }

  if (existing) {
    // Re-activate a previously removed enrollment
    const { error } = await supabase
      .from("enrollments")
      .update({ is_active: true, enrolled_at: new Date().toISOString(), removed_at: null })
      .eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    // New enrollment
    const { error } = await supabase
      .from("enrollments")
      .insert({ user_id: user.id, course_id: courseId, is_active: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ enrolled: true });
}
