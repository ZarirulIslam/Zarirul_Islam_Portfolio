import { ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatDate, readingTime } from "@/lib/utils";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-accent/50"
    >
      {post.cover_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover_url} alt="" className="aspect-[16/9] w-full border-b border-line object-cover" />
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 font-mono text-xs text-muted">
          <time dateTime={post.published_at ?? post.created_at}>{formatDate(post.published_at ?? post.created_at)}</time>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" /> {readingTime(post.content)} min read
          </span>
        </div>
        <h3 className="mt-3 font-display text-lg leading-snug font-semibold group-hover:text-accent">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted">{post.excerpt}</p>}
        <div className="mt-auto flex items-center justify-between pt-5">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t) => (
              <span key={t} className="chip">
                #{t}
              </span>
            ))}
          </div>
          <ArrowUpRight className="size-4 shrink-0 text-muted transition group-hover:text-accent" />
        </div>
      </div>
    </Link>
  );
}
