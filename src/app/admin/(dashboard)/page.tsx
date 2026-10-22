import { ArrowRight, Award, BriefcaseBusiness, Download, FolderGit2, Mail, NotebookPen, Sparkles } from "lucide-react";
import Link from "next/link";
import { importStarterContent } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/ConfirmButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { getAdmin } from "@/lib/auth";
import type { Message } from "@/lib/types";
import { formatDate, shortName } from "@/lib/utils";

const cards = [
  { table: "projects", href: "/admin/projects", label: "Projects", Icon: FolderGit2 },
  { table: "skills", href: "/admin/skills", label: "Skills", Icon: Sparkles },
  { table: "experiences", href: "/admin/experience", label: "Experience & education", Icon: BriefcaseBusiness },
  { table: "certifications", href: "/admin/certifications", label: "Certifications", Icon: Award },
  { table: "posts", href: "/admin/posts", label: "Blog posts", Icon: NotebookPen },
  { table: "messages", href: "/admin/messages", label: "Messages", Icon: Mail },
];

export default async function DashboardPage() {
  const { supabase } = await getAdmin();

  const counts = await Promise.all(
    cards.map(async (c) => (await supabase.from(c.table).select("id", { count: "exact", head: true })).count ?? 0),
  );
  const { data: profile } = await supabase.from("profile").select("name").eq("id", 1).maybeSingle();
  const { data: recent } = await supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(5);

  const isEmpty = !profile && counts.slice(0, 5).every((c) => c === 0);

  return (
    <>
      <PageHeader title={`Welcome back${profile?.name ? `, ${shortName(profile.name)}` : ""} 👋`} description="Here's an overview of your portfolio content.">
        <Link href="/" target="_blank" className="btn-ghost">
          View site
        </Link>
      </PageHeader>

      {isEmpty && (
        <div className="card mb-8 border-accent/40 bg-accent-soft p-6">
          <h2 className="font-display text-lg font-semibold">Your database is empty</h2>
          <p className="mt-1 text-sm text-muted">
            Import the starter content (sample profile, skills, projects and so on) and then edit it to match your own. Or start
            from scratch with the Profile page.
          </p>
          <form action={importStarterContent} className="mt-4">
            <SubmitButton className="btn-primary">
              <Download className="size-4" /> Import starter content
            </SubmitButton>
          </form>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ href, label, Icon }, i) => (
          <Link key={href} href={href} className="card group flex items-center gap-4 p-5 transition hover:border-accent/50">
            <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="font-display text-2xl font-bold">{counts[i]}</p>
              <p className="text-sm text-muted">{label}</p>
            </div>
            <ArrowRight className="ml-auto size-4 text-muted transition group-hover:translate-x-1 group-hover:text-accent" />
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Recent messages</h2>
          <Link href="/admin/messages" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>
        <div className="card divide-y divide-line">
          {(recent as Message[] | null)?.length ? (
            (recent as Message[]).map((m) => (
              <Link key={m.id} href="/admin/messages" className="flex items-center gap-4 px-5 py-4 hover:bg-surface-2">
                <span className={`size-2 shrink-0 rounded-full ${m.read ? "bg-transparent" : "bg-accent"}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {m.name} <span className="font-normal text-muted">· {m.subject ?? "No subject"}</span>
                  </p>
                  <p className="truncate text-sm text-muted">{m.message}</p>
                </div>
                <span className="shrink-0 text-xs text-muted">{formatDate(m.created_at)}</span>
              </Link>
            ))
          ) : (
            <p className="p-8 text-center text-sm text-muted">No messages yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
