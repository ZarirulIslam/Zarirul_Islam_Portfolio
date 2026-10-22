import { ArrowRight, Download, MapPin } from "lucide-react";
import type { Profile, Skill } from "@/lib/types";
import { shortName } from "@/lib/utils";
import { SocialLinks } from "./SocialLinks";
import { Typing } from "./Typing";

export function Hero({ profile, skills }: { profile: Profile; skills: Skill[] }) {
  const topSkills = [...skills].sort((a, b) => b.level - a.level).slice(0, 6);
  const firstName = shortName(profile.name);

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="bg-grid absolute inset-0 -z-10" />
      <div className="glow-blob -top-20 left-[10%] -z-10 size-80 bg-accent/40" />
      <div className="glow-blob top-40 right-[5%] -z-10 size-96 bg-accent-2/30" />

      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
        <div>
          {profile.available && (
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 text-xs text-muted backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Open to opportunities
            </p>
          )}

          <p className="font-mono text-sm text-accent">Hello, I&apos;m</p>
          <h1 className="mt-2 font-display text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-4 h-9 font-display text-2xl font-semibold text-muted sm:text-3xl">
            <span className="text-gradient">
              <Typing words={profile.roles.length ? profile.roles : ["Data Analyst"]} />
            </span>
          </p>
          {profile.headline && <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{profile.headline}</p>}

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="btn-primary">
              View my work <ArrowRight className="size-4" />
            </a>
            {profile.resume_url ? (
              <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <Download className="size-4" /> Download CV
              </a>
            ) : (
              <a href="#contact" className="btn-ghost">
                Get in touch
              </a>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <SocialLinks profile={profile} />
            {profile.location && (
              <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                <MapPin className="size-4" /> {profile.location}
              </span>
            )}
          </div>
        </div>

        <NotebookCard profile={profile} firstName={firstName} topSkills={topSkills} />
      </div>
    </section>
  );
}

/** A Jupyter-style "cell" that introduces the person the way a data scientist would. */
function NotebookCard({ profile, firstName, topSkills }: { profile: Profile; firstName: string; topSkills: Skill[] }) {
  const variable = firstName.toLowerCase().replace(/[^a-z0-9_]/g, "") || "me";
  const rows: [string, string][] = [
    ["role", profile.roles[0] ?? "Data Analyst"],
    ["focus", profile.focus ?? "Analytics · ML"],
    ["tools", topSkills.slice(0, 3).map((s) => s.name).join(", ")],
    ["status", profile.available ? "open_to_work ✓" : "busy"],
  ];

  return (
    <div className="float relative mx-auto w-full max-w-md">
      <div className="absolute -inset-px rounded-2xl bg-linear-to-br from-accent/60 via-transparent to-accent-2/60 opacity-60 blur-sm" />
      <div className="card relative overflow-hidden shadow-2xl shadow-black/20">
        <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-3">
          <span className="size-3 rounded-full bg-red-400/80" />
          <span className="size-3 rounded-full bg-amber-400/80" />
          <span className="size-3 rounded-full bg-emerald-400/80" />
          <span className="ml-3 font-mono text-xs text-muted">portfolio.ipynb</span>
        </div>

        <div className="space-y-4 p-5 font-mono text-[13px]">
          <div className="flex gap-3">
            <span className="shrink-0 text-muted">In [1]:</span>
            <code>
              <span className="text-accent-2">import</span> {variable} <span className="text-accent-2">as</span> me
            </code>
          </div>
          <div className="flex gap-3">
            <span className="shrink-0 text-muted">In [2]:</span>
            <code>
              me.<span className="text-accent">describe</span>()
            </code>
          </div>
          <div className="flex gap-3">
            <span className="shrink-0 text-red-400/80">Out[2]:</span>
            <table className="w-full text-left">
              <tbody>
                {rows.map(([key, value]) => (
                  <tr key={key} className="border-b border-line/60 last:border-0">
                    <td className="py-1.5 pr-3 text-muted">{key}</td>
                    <td className="py-1.5 text-fg">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {topSkills.length > 0 && (
            <div className="flex gap-3">
              <span className="shrink-0 text-muted">In [3]:</span>
              <div className="min-w-0 flex-1">
                <code>
                  skills.<span className="text-accent">plot</span>(kind=<span className="text-emerald-400">&quot;bar&quot;</span>)
                </code>
                <div className="mt-3 flex h-32 items-end gap-2 rounded-xl border border-line bg-surface-2 p-3">
                  {topSkills.map((s, i) => (
                    <div key={s.id} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                      <div
                        className="bar-grow w-full rounded-t-md bg-linear-to-t from-accent to-accent-2"
                        style={{ height: `${s.level}%`, animationDelay: `${0.3 + i * 0.1}s` }}
                        title={`${s.name}: ${s.level}%`}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-1.5 flex gap-2">
                  {topSkills.map((s) => (
                    <span key={s.id} className="flex-1 truncate text-center text-[10px] text-muted">
                      {s.name.split(/[ (/&]/)[0]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
