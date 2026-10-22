import { ArrowUpRight, BarChart3, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { GithubIcon } from "../icons";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5">
      <Link href={`/projects/${project.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-surface-2">
        {project.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image_url}
            alt={project.title}
            className="size-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <ProjectPlaceholder seed={project.title} />
        )}
        {project.featured && (
          <span className="absolute top-3 left-3 rounded-full bg-bg/80 px-2.5 py-1 font-mono text-[10px] text-accent backdrop-blur">
            ★ featured
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {project.category && <p className="mb-2 font-mono text-xs text-accent">{project.category}</p>}
        <h3 className="font-display text-lg font-semibold">
          <Link href={`/projects/${project.slug}`} className="hover:text-accent">
            {project.title}
          </Link>
        </h3>
        {project.summary && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{project.summary}</p>}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 5).map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-4 pt-5 text-sm">
          <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-1 font-medium text-fg hover:text-accent">
            Case study <ArrowUpRight className="size-4" />
          </Link>
          <div className="ml-auto flex gap-3 text-muted">
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer" aria-label="Source code" className="hover:text-accent">
                <GithubIcon className="size-[18px]" />
              </a>
            )}
            {project.report_url && (
              <a href={project.report_url} target="_blank" rel="noopener noreferrer" aria-label="Report" title="Report" className="hover:text-accent">
                <FileText className="size-[18px]" />
              </a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer" aria-label="Live demo" title="Live demo" className="hover:text-accent">
                <ExternalLink className="size-[18px]" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/** Generated chart-like artwork for projects without a cover image. */
export function ProjectPlaceholder({ seed }: { seed: string }) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const bars = Array.from({ length: 12 }, (_, i) => 25 + ((h >>> (i % 24)) % 60) + (i % 3) * 5);
  const points = bars.map((b, i) => `${(i / 11) * 100},${100 - b}`).join(" ");

  return (
    <div className="relative size-full bg-linear-to-br from-accent/15 via-surface-2 to-accent-2/15">
      <div className="bg-grid absolute inset-0 opacity-60" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-6 bottom-0 h-3/4 w-[calc(100%-3rem)]">
        {bars.map((b, i) => (
          <rect key={i} x={i * (100 / 12) + 1.5} y={100 - b} width={100 / 12 - 3} height={b} rx="1" className="fill-accent/25" />
        ))}
        <polyline points={points} fill="none" strokeWidth="1.2" vectorEffect="non-scaling-stroke" className="stroke-accent-2" />
      </svg>
      <BarChart3 className="absolute top-4 right-4 size-6 text-accent/60" />
    </div>
  );
}
