import type { Metadata } from "next";
import { PostCard } from "@/components/site/PostCard";
import { Reveal } from "@/components/site/Reveal";
import { getPosts } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = { title: "Blog", description: "Notes, tutorials and data analysis write-ups." };

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <section className="pt-32 pb-24">
      <div className="container-x">
        <p className="font-mono text-sm text-accent">
          <span className="text-muted">~/</span>blog
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Notes & write-ups</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Things I learn along the way: analysis walkthroughs, tutorials and lessons from real projects.
        </p>

        {posts.length === 0 ? (
          <p className="card mt-12 p-10 text-center text-muted">No posts yet. Check back soon!</p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={(i % 3) * 0.06}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
