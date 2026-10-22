import { Database } from "lucide-react";
import Link from "next/link";

export function SetupNotice() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="card max-w-lg p-8">
        <span className="grid size-12 place-items-center rounded-xl bg-accent-soft text-accent">
          <Database className="size-6" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold">Connect Supabase to use the admin</h1>
        <p className="mt-3 text-sm text-muted">
          The public site is currently showing the starter content from <code className="chip">src/lib/seed.ts</code>.
          To edit content from this dashboard:
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>Create a free project at supabase.com</li>
          <li>
            Run <code className="chip">supabase/schema.sql</code> in the SQL Editor (put your email at the bottom)
          </li>
          <li>Create your login user under Authentication → Users</li>
          <li>
            Copy <code className="chip">.env.example</code> to <code className="chip">.env.local</code> and fill in your URL and key
          </li>
          <li>Restart the dev server</li>
        </ol>
        <p className="mt-4 text-sm text-muted">Full step-by-step instructions are in README.md.</p>
        <Link href="/" className="btn-ghost mt-6">
          Back to site
        </Link>
      </div>
    </div>
  );
}
