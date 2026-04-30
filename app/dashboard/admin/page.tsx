import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminUI from "./AdminUI";

const ADMIN_EMAIL = "mr.habibiqbal@gmail.com";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.email !== ADMIN_EMAIL) redirect("/dashboard/student");

  return <AdminUI name={user.user_metadata?.full_name || "Admin"} email={user.email ?? ""} />;
}
