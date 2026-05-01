import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardUI from "./DashboardUI";
import { courses } from "@/lib/courses-data";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Base info from auth metadata
  const name  = user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";
  const level = user.user_metadata?.level || "o_level";
  const email = user.email || "";

  // Fetch real profile (student ID etc.)
  let studentId = "IH-????";
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("student_id, full_name, level")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) console.error("Profile fetch error:", profileError.message);
  if (profile?.student_id) studentId = profile.student_id;

  // Fetch enrolled course IDs
  let enrolledCourseIds: string[] = [];
  try {
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("course_id, enrolled_at")
      .eq("user_id", user.id)
      .eq("is_active", true);
    if (enrollments) enrolledCourseIds = enrollments.map((e) => e.course_id);
  } catch { /* enrollments table not yet created */ }

  // Fetch lesson progress counts per course
  let progressMap: Record<string, number> = {};
  try {
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("lesson_id, lessons(course_id)")
      .eq("user_id", user.id);
    if (progress) {
      for (const row of progress) {
        // Supabase returns joined tables as arrays
        const lessonsJoin = row.lessons as { course_id: string }[] | { course_id: string } | null;
        const cid = Array.isArray(lessonsJoin) ? lessonsJoin[0]?.course_id : lessonsJoin?.course_id;
        if (cid) progressMap[cid] = (progressMap[cid] ?? 0) + 1;
      }
    }
  } catch { /* tables not yet created */ }

  // Build enrolled courses list using courses-data for names/totals
  const enrolledCourses = enrolledCourseIds
    .map((cid) => {
      const c = courses.find((x) => x.id === cid);
      if (!c) return null;
      const total     = c.curriculum.reduce((s, sec) => s + sec.lessons.length, 0);
      const completed = progressMap[cid] ?? 0;
      return {
        courseId:   cid,
        name:       c.title,
        color:      "bg-indigo-500",
        total,
        completed,
        progress:   total > 0 ? Math.round((completed / total) * 100) : 0,
        next:       c.curriculum[0]?.lessons[completed] ?? "Start Lesson 1",
      };
    })
    .filter(Boolean) as {
      courseId: string; name: string; color: string;
      total: number; completed: number; progress: number; next: string;
    }[];

  return (
    <DashboardUI
      name={name}
      level={level}
      email={email}
      studentId={studentId}
      enrolledCourses={enrolledCourses}
    />
  );
}
