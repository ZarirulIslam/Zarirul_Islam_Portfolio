import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { signOut } from "@/app/admin/actions";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { Sidebar } from "@/components/admin/Sidebar";
import { getAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) return <SetupNotice />;

  const { supabase, user, isAdmin } = await getAdmin();
  if (!user) redirect("/admin/login");

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="card max-w-md p-8 text-center">
          <h1 className="font-display text-2xl font-bold">Not authorized</h1>
          <p className="mt-3 text-sm text-muted">
            <strong>{user.email}</strong> is not in the <code className="chip">admins</code> table. Add it in Supabase
            (see README) and sign in again.
          </p>
          <form action={signOut}>
            <button type="submit" className="btn-ghost mt-6">
              Sign out
            </button>
          </form>
        </div>
      </div>
    );
  }

  const { count } = await supabase.from("messages").select("id", { count: "exact", head: true }).eq("read", false);

  return (
    <div className="min-h-screen">
      <Sidebar email={user.email ?? ""} unread={count ?? 0} />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
