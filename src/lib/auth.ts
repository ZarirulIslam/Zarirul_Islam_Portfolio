import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export async function getAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, isAdmin: false };
  const { data } = await supabase.rpc("is_admin");
  return { supabase, user, isAdmin: data === true };
}

/** Use at the top of every admin server action. */
export async function requireAdmin() {
  const result = await getAdmin();
  if (!result.user) redirect("/admin/login");
  if (!result.isAdmin) throw new Error("This account is not an admin.");
  return result;
}
