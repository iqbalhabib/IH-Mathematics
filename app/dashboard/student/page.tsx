import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardUI from "./DashboardUI";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name  = user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";
  const level = user.user_metadata?.level || "o_level";
  const email = user.email || "";

  return <DashboardUI name={name} level={level} email={email} />;
}
