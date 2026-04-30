import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { courses } from "@/lib/courses-data";
import CourseManageUI from "./CourseManageUI";

const ADMIN_EMAIL = "mr.habibiqbal@gmail.com";

export default async function AdminCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.email !== ADMIN_EMAIL) redirect("/dashboard/student");

  const { id } = await params;
  const course = courses.find((c) => c.id === id);
  if (!course) notFound();

  return <CourseManageUI course={course} />;
}
