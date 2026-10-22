import { cache } from "react";
import { publicClient } from "./supabase/public";
import { isSupabaseConfigured } from "./supabase/env";
import {
  seedCertifications,
  seedExperiences,
  seedPosts,
  seedProfile,
  seedProjects,
  seedSkills,
} from "./seed";
import type { Certification, Experience, Post, Profile, Project, Skill } from "./types";

// Every reader falls back to the starter content until Supabase is configured.
// When a query fails we log it and render an empty section instead of crashing the site.

async function select<T>(table: string, order: [string, boolean][], fallback: T[]): Promise<T[]> {
  if (!isSupabaseConfigured) return fallback;
  let query = publicClient().from(table).select("*");
  for (const [column, ascending] of order) query = query.order(column, { ascending });
  const { data, error } = await query;
  if (error) {
    console.error(`[data] ${table}:`, error.message);
    return [];
  }
  return data as T[];
}

export const getProfile = cache(async (): Promise<Profile> => {
  if (!isSupabaseConfigured) return seedProfile;
  const { data, error } = await publicClient().from("profile").select("*").eq("id", 1).maybeSingle();
  if (error) console.error("[data] profile:", error.message);
  return (data as Profile | null) ?? seedProfile;
});

export const getSkills = cache(() =>
  select<Skill>("skills", [["sort_order", true], ["created_at", true]], seedSkills),
);

export const getProjects = cache(() =>
  select<Project>("projects", [["sort_order", true], ["created_at", false]], seedProjects),
);

export const getExperiences = cache(() =>
  select<Experience>("experiences", [["sort_order", true], ["created_at", false]], seedExperiences),
);

export const getCertifications = cache(() =>
  select<Certification>("certifications", [["sort_order", true], ["created_at", false]], seedCertifications),
);

export const getPosts = cache(async (): Promise<Post[]> => {
  const posts = await select<Post>("posts", [["published_at", false]], seedPosts);
  return posts.filter((p) => p.published);
});

export async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug) ?? null;
}

export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug) ?? null;
}
