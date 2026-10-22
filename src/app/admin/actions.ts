"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { profileFields, resources, type Field } from "@/lib/resources";
import {
  seedCertifications,
  seedExperiences,
  seedPosts,
  seedProfile,
  seedProjects,
  seedSkills,
} from "@/lib/seed";
import { createClient } from "@/lib/supabase/server";
import { slugify, toDirectImageUrl } from "@/lib/utils";

export type FormState = { error: string | null; ok?: boolean };

function parseFields(fields: Field[], formData: FormData) {
  const row: Record<string, unknown> = {};
  for (const field of fields) {
    const raw = formData.get(field.name);
    switch (field.type) {
      case "boolean":
        row[field.name] = raw === "on";
        break;
      case "number": {
        const n = Number(raw);
        row[field.name] = raw === "" || raw === null || Number.isNaN(n) ? 0 : Math.round(n);
        break;
      }
      case "tags":
        row[field.name] = String(raw ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      default: {
        let value = String(raw ?? "").trim();
        if ((field.type === "image" || field.type === "file") && /drive\.google\.com\/drive\/.*folders\//.test(value))
          return { error: `${field.label}: that's a Google Drive folder link. Please use the link of the file itself.`, row };
        if (field.type === "image") value = toDirectImageUrl(value);
        row[field.name] = value === "" ? null : value;
      }
    }
    if (field.required && (row[field.name] === null || row[field.name] === "")) {
      return { error: `${field.label} is required.`, row };
    }
  }
  return { error: null, row };
}

/** Rebuild every public page so edits show up immediately. */
function refreshSite() {
  revalidatePath("/", "layout");
}

export async function saveItem(
  resourceKey: string,
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const resource = resources[resourceKey];
  if (!resource) return { error: "Unknown section." };
  const { supabase } = await requireAdmin();

  const { error: parseError, row } = parseFields(resource.fields, formData);
  if (parseError) return { error: parseError };

  if (resource.hasSlug) {
    row.slug = slugify(String(row.slug ?? "") || String(row.title ?? ""));
    if (!row.slug) return { error: "Please add a title." };
  }

  if (resource.key === "posts" && row.published) {
    let publishedAt: string | null = null;
    if (id) {
      const { data } = await supabase.from("posts").select("published_at").eq("id", id).maybeSingle();
      publishedAt = data?.published_at ?? null;
    }
    row.published_at = publishedAt ?? new Date().toISOString();
  }

  const { error } = id
    ? await supabase.from(resource.table).update(row).eq("id", id)
    : await supabase.from(resource.table).insert(row);

  if (error) {
    if (error.code === "23505") return { error: "That slug is already used. Please choose another one." };
    return { error: error.message };
  }

  refreshSite();
  redirect(`/admin/${resource.key}`);
}

export async function deleteItem(resourceKey: string, id: string) {
  const resource = resources[resourceKey];
  if (!resource) return;
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from(resource.table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  refreshSite();
  redirect(`/admin/${resource.key}`);
}

export async function saveProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const { error: parseError, row } = parseFields(profileFields, formData);
  if (parseError) return { error: parseError };

  const { error } = await supabase
    .from("profile")
    .upsert({ id: 1, ...row, updated_at: new Date().toISOString() });
  if (error) return { error: error.message };

  refreshSite();
  return { error: null, ok: true };
}

export async function setMessageRead(id: string, read: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("messages").update({ read }).eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("messages").delete().eq("id", id);
  revalidatePath("/admin", "layout");
}

/** Fills empty tables with the starter content from src/lib/seed.ts. */
export async function importStarterContent() {
  const { supabase } = await requireAdmin();
  const strip = <T extends { id: unknown }>(rows: T[]) => rows.map(({ id: _id, ...rest }) => rest);

  const { data: existingProfile } = await supabase.from("profile").select("id").eq("id", 1).maybeSingle();
  if (!existingProfile) await supabase.from("profile").insert(seedProfile);

  const tables: [string, Record<string, unknown>[]][] = [
    ["skills", strip(seedSkills)],
    ["projects", strip(seedProjects)],
    ["experiences", strip(seedExperiences)],
    ["certifications", strip(seedCertifications)],
    ["posts", strip(seedPosts)],
  ];
  for (const [table, rows] of tables) {
    const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
    if (!count) {
      const { error } = await supabase.from(table).insert(rows);
      if (error) throw new Error(`${table}: ${error.message}`);
    }
  }

  refreshSite();
  revalidatePath("/admin", "layout");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
