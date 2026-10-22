import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { getPosts, getProfile } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [profile, posts] = await Promise.all([getProfile(), getPosts()]);
  return (
    <>
      <Navbar name={profile.name} resumeUrl={profile.resume_url} hasPosts={posts.length > 0} />
      <main>{children}</main>
      <Footer profile={profile} />
    </>
  );
}
