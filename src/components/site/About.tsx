import { Briefcase, Database, FolderGit2, Award } from "lucide-react";
import type { Profile } from "@/lib/types";
import { Markdown } from "./Markdown";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function About({
  profile,
  counts,
}: {
  profile: Profile;
  counts: { projects: number; certifications: number; skills: number };
}) {
  const stats = [
    ...(profile.years_experience ? [{ label: "Years experience", value: profile.years_experience, Icon: Briefcase }] : []),
    { label: "Projects", value: `${counts.projects}+`, Icon: FolderGit2 },
    { label: "Skills & tools", value: `${counts.skills}+`, Icon: Database },
    { label: "Certifications", value: `${counts.certifications}`, Icon: Award },
  ];
  const initials = profile.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section id="about" className="py-24">
      <div className="container-x">
        <SectionHeading index="01" kicker="about" title="Who I am" />

        <div className="grid items-start gap-12 lg:grid-cols-[320px_1fr]">
          <Reveal>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-xs">
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border-2 border-accent/50" />
              <div className="relative h-full overflow-hidden rounded-2xl border border-line bg-surface-2">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt={profile.name} className="size-full object-cover" />
                ) : (
                  <div className="grid size-full place-items-center bg-linear-to-br from-accent/20 to-accent-2/20">
                    <span className="font-display text-7xl font-bold text-gradient">{initials}</span>
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal delay={0.1}>
              <Markdown className="prose-lg text-muted prose-strong:text-fg">{profile.bio}</Markdown>
            </Reveal>

            <div className={`mt-10 grid grid-cols-2 gap-4 ${stats.length === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
              {stats.map(({ label, value, Icon }, i) => (
                <Reveal key={label} delay={0.15 + i * 0.05}>
                  <div className="card h-full p-5 transition hover:border-accent/60">
                    <Icon className="size-5 text-accent" />
                    <p className="mt-3 font-display text-3xl font-bold">{value}</p>
                    <p className="mt-1 text-xs text-muted">{label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
