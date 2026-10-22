import { Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { deleteMessage, setMessageRead } from "@/app/admin/actions";
import { ConfirmButton, SubmitButton } from "@/components/admin/ConfirmButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { getAdmin } from "@/lib/auth";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

export default async function MessagesPage() {
  const { supabase } = await getAdmin();
  const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  const messages = (data ?? []) as Message[];
  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <PageHeader
        title="Messages"
        description={`Messages sent from the contact form. ${unread} unread of ${messages.length}.`}
      />

      {messages.length === 0 ? (
        <p className="card p-12 text-center text-sm text-muted">No messages yet. They will appear here when someone uses the contact form.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <details key={m.id} className={cn("card group overflow-hidden", !m.read && "border-accent/40")}>
              <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 hover:bg-surface-2/60">
                <span className={cn("size-2 shrink-0 rounded-full", m.read ? "bg-line" : "bg-accent")} />
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-sm", !m.read && "font-semibold")}>
                    {m.name} <span className="font-normal text-muted">&lt;{m.email}&gt;</span>
                  </p>
                  <p className="truncate text-sm text-muted">{m.subject ?? m.message}</p>
                </div>
                <time className="shrink-0 text-xs text-muted">
                  {new Date(m.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                </time>
              </summary>
              <div className="border-t border-line px-5 py-5">
                {m.subject && <p className="mb-3 font-medium">{m.subject}</p>}
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted">{m.message}</p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject ?? "Your message"}`)}`}
                    className="btn-primary px-4! py-2!"
                  >
                    <Reply className="size-4" /> Reply
                  </a>
                  <form action={setMessageRead.bind(null, m.id, !m.read)}>
                    <SubmitButton className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent">
                      {m.read ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
                      {m.read ? "Mark unread" : "Mark read"}
                    </SubmitButton>
                  </form>
                  <form action={deleteMessage.bind(null, m.id)}>
                    <ConfirmButton message="Delete this message?">
                      <Trash2 className="size-4" /> Delete
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </>
  );
}
