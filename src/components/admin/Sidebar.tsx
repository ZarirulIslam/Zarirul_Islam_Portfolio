"use client";

import {
  Award,
  BriefcaseBusiness,
  ExternalLink,
  FolderGit2,
  LayoutDashboard,
  LogOut,
  Mail,
  NotebookPen,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/admin/actions";
import { LogoMark } from "@/components/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", Icon: UserRound },
  { href: "/admin/projects", label: "Projects", Icon: FolderGit2 },
  { href: "/admin/skills", label: "Skills", Icon: Sparkles },
  { href: "/admin/experience", label: "Experience", Icon: BriefcaseBusiness },
  { href: "/admin/certifications", label: "Certifications", Icon: Award },
  { href: "/admin/posts", label: "Blog", Icon: NotebookPen },
  { href: "/admin/messages", label: "Messages", Icon: Mail },
];

export function Sidebar({ email, unread }: { email: string; unread: number }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-surface lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-line px-5">
          <LogoMark className="size-8 rounded-lg" />
          <span className="font-display font-semibold">Portfolio Admin</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                isActive(href) ? "bg-accent-soft font-medium text-accent" : "text-muted hover:bg-surface-2 hover:text-fg",
              )}
            >
              <Icon className="size-4" />
              {label}
              {label === "Messages" && unread > 0 && (
                <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white">{unread}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="space-y-3 border-t border-line p-4">
          <p className="truncate text-xs text-muted" title={email}>
            {email}
          </p>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              target="_blank"
              className="grid size-9 place-items-center rounded-xl border border-line text-muted hover:border-accent hover:text-accent"
              title="View site"
            >
              <ExternalLink className="size-4" />
            </Link>
            <form action={signOut} className="ml-auto">
              <button type="submit" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted hover:text-red-500">
                <LogOut className="size-4" /> Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <span className="flex items-center gap-2 font-display font-semibold">
            <LogoMark className="size-7 rounded-md" /> Admin
          </span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <form action={signOut}>
              <button type="submit" aria-label="Sign out" className="grid size-9 place-items-center rounded-xl border border-line text-muted">
                <LogOut className="size-4" />
              </button>
            </form>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-sm",
                isActive(href) ? "bg-accent-soft text-accent" : "text-muted",
              )}
            >
              {label}
              {label === "Messages" && unread > 0 && ` (${unread})`}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
