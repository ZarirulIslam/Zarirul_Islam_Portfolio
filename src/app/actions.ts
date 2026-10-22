"use server";

import { sendContactNotification } from "@/lib/email";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { publicClient } from "@/lib/supabase/public";

export type ContactState = { status: "idle" | "success" | "error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real visitors never fill this hidden field.
  if (formData.get("company")) return { status: "success", message: "Thanks! Your message has been sent." };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) return { status: "error", message: "Please fill in your name, email and message." };
  if (!EMAIL_RE.test(email)) return { status: "error", message: "Please enter a valid email address." };
  if (name.length > 120 || subject.length > 200 || message.length > 5000)
    return { status: "error", message: "Your message is too long." };

  // Save to the admin inbox and email it via Brevo. Either one succeeding is enough.
  let saved = false;
  if (isSupabaseConfigured) {
    const { error } = await publicClient()
      .from("messages")
      .insert({ name, email, subject: subject || null, message });
    if (error) console.error("[contact]", error.message);
    else saved = true;
  }
  const emailed = await sendContactNotification({ name, email, subject, message });

  if (!saved && !emailed) {
    return { status: "error", message: "Something went wrong. Please try again or email me directly." };
  }
  return { status: "success", message: "Thanks! Your message has been sent. I'll get back to you soon." };
}
