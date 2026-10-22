import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { About } from "@/components/site/About";
import { Certifications } from "@/components/site/Certifications";
import { Contact } from "@/components/site/Contact";
import { Hero } from "@/components/site/Hero";
import { PostCard } from "@/components/site/PostCard";
import { ProjectsGrid } from "@/components/site/ProjectsGrid";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SkillsGrid } from "@/components/site/Skills";
import { Timeline } from "@/components/site/Timeline";
import { getCertifications, getExperiences, getPosts, getProfile, getProjects, getSkills } from "@/lib/data";

// Pages are cached and rebuilt at most once a minute; admin edits refresh them instantly.
export const revalidate = 60;

export default async function HomePage() {
  const [profile, skills, projects, experiences, certifications, posts] = await Promise.all([
    getProfile(),
    getSkills(),
    getProjects(),
    getExperiences(),
    getCertifications(),
    getPosts(),
  ]);

  const sortedProjects = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <>
      <Hero profile={profile} skills={skills} />

      <About
        profile={profile}
        counts={{ projects: projects.length, certifications: certifications.length, skills: skills.length }}
      />

      {skills.length > 0 && (
        <section id="skills" className="border-y border-line bg-surface/40 py-24">
          <div className="container-x">
            <SectionHeading
              index="02"
              kicker="skills"
              title="My data toolkit"
              intro="The languages, libraries and tools I use to collect, clean, analyse, model and visualise data."
            />
            <SkillsGrid skills={skills} />
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section id="projects" className="py-24">
          <div className="container-x">
            <SectionHeading
              index="03"
              kicker="projects"
              title="Research & projects"
              intro="My thesis research in machine learning and NLP, plus web development work. Each one starts with a question and ends with a measurable result."
            />
            <ProjectsGrid projects={sortedProjects} />
          </div>
        </section>
      )}

      {experiences.length > 0 && (
        <section id="experience" className="border-y border-line bg-surface/40 py-24">
          <div className="container-x">
            <SectionHeading index="04" kicker="journey" title="Experience, education & leadership" />
            <Timeline items={experiences} />
          </div>
        </section>
      )}

      {certifications.length > 0 && (
        <section id="certifications" className="py-24">
          <div className="container-x">
            <SectionHeading
              index="05"
              kicker="credentials"
              title="Certifications & achievements"
              intro="Courses I've completed and milestones I'm proud of."
            />
            <Certifications items={certifications} />
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section id="blog" className="border-y border-line bg-surface/40 py-24">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-x-4">
              <SectionHeading index="06" kicker="blog" title="Notes & write-ups" />
              <Reveal className="mb-12">
                <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
                  All posts <ArrowRight className="size-4" />
                </Link>
              </Reveal>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((post, i) => (
                <Reveal key={post.id} delay={i * 0.08}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-24">
        <div className="container-x">
          <SectionHeading
            index="07"
            kicker="contact"
            title="Get in touch"
            intro="Whether it's a job opportunity, a freelance project or just a question about data, I'd love to hear from you."
          />
          <Contact profile={profile} />
        </div>
      </section>
    </>
  );
}
