import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PromoCodesUI from "./PromoCodesUI";

const ADMIN_EMAIL = "mr.habibiqbal@gmail.com";

export default async function PromoCodesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user)                        redirect("/login");
  if (user.email !== ADMIN_EMAIL)   redirect("/dashboard/student");

  const name = user.user_metadata?.full_name ?? user.email ?? "Admin";
  return <PromoCodesUI adminName={name} />;
}
