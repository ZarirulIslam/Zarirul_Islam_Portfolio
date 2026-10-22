import type { Metadata } from "next";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default function LoginPage() {
  if (!isSupabaseConfigured) return <SetupNotice />;
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div className="bg-grid absolute inset-0 -z-10" />
      <div className="glow-blob top-1/4 left-1/3 -z-10 size-80 bg-accent/30" />
      <LoginForm />
    </div>
  );
}
