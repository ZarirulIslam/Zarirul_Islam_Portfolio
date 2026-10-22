import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GithubIcon } from "@/components/icons";
import { Markdown } from "@/components/site/Markdown";
import { ProjectCard, ProjectPlaceholder } from "@/components/site/ProjectCard";
import { getProject, getProjects } from "@/lib/data";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary ?? undefined,
    openGraph: project.image_url ? { images: [project.image_url] } : undefined,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const others = (await getProjects()).filter((p) => p.id !== project.id).slice(0, 3);

  return (
    <article className="pt-28 pb-24">
      <div className="container-x max-w-4xl">
        <Link href="/#projects" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent">
          <ArrowLeft className="size-4" /> All projects
        </Link>

        <header className="mt-8">
          {project.category && <p className="font-mono text-sm text-accent">{project.category}</p>}
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">{project.title}</h1>
          {project.summary && <p className="mt-5 text-lg text-muted">{project.summary}</p>}

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>

          {(project.github_url || project.live_url || project.report_url) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <ExternalLink className="size-4" /> Live demo
                </a>
              )}
              {project.report_url && (
                <a
                  href={project.report_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={project.live_url ? "btn-ghost" : "btn-primary"}
                >
                  <FileText className="size-4" /> Read the report
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <GithubIcon className="size-4" /> Source code
                </a>
              )}
            </div>
          )}
        </header>

        <div className="card mt-10 aspect-[16/9] overflow-hidden">
          {project.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.image_url} alt={project.title} className="size-full object-cover" />
          ) : (
            <ProjectPlaceholder seed={project.title} />
          )}
        </div>

        <Markdown className="mt-12">{project.content}</Markdown>
      </div>

      {others.length > 0 && (
        <div className="container-x mt-24">
          <h2 className="mb-8 font-display text-2xl font-bold">More projects</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
