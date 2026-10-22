import { ArrowLeft, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/site/Markdown";
import { getPost } from "@/lib/data";
import { formatDate, readingTime } from "@/lib/utils";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: { type: "article", images: post.cover_url ? [post.cover_url] : undefined },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  return (
    <article className="pt-28 pb-24">
      <div className="container-x max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent">
          <ArrowLeft className="size-4" /> All posts
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
            <time dateTime={post.published_at ?? post.created_at}>{formatDate(post.published_at ?? post.created_at)}</time>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" /> {readingTime(post.content)} min read
            </span>
          </div>
          <h1 className="mt-3 font-display text-4xl leading-tight font-bold tracking-tight sm:text-5xl">{post.title}</h1>
          {post.excerpt && <p className="mt-5 text-lg text-muted">{post.excerpt}</p>}
          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t} className="chip">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </header>

        {post.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_url} alt="" className="card mt-10 aspect-[16/9] w-full object-cover" />
        )}

        <Markdown className="mt-12">{post.content}</Markdown>
      </div>
    </article>
  );
}
