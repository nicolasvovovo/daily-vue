import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useSettings } from "@/lib/settings";
import { messages, type Channel } from "@/lib/mock-data";

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "Communication Inbox — Verdant Ops Command" },
      {
        name: "description",
        content: "Emails, WhatsApp messages and phone SMS or missed calls together in one split-view inbox.",
      },
      { property: "og:title", content: "Communication Inbox — Verdant Ops Command" },
      { property: "og:description", content: "Email, WhatsApp and SMS conversations in one split-view inbox." },
    ],
  }),
  component: InboxPage,
});

function InboxPage() {
  const { t } = useSettings();
  const [tab, setTab] = useState<Channel>("email");
  const [selectedId, setSelectedId] = useState<string>("m1");
  const [read, setRead] = useState<string[]>([]);

  const list = messages.filter((m) => m.channel === tab);
  const selected = list.find((m) => m.id === selectedId) ?? list[0];

  const select = (id: string) => {
    setSelectedId(id);
    setRead((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <AppShell>
      <main className="p-5 lg:p-7">
        <section className="rounded-xl bg-surface border border-line overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-line">
            <h1 className="font-display font-semibold text-lg">{t("inbox")}</h1>
            <span className="text-xs text-mute">
              {messages.filter((m) => m.unread && !read.includes(m.id)).length} {t("new")}
            </span>
          </div>
          <div className="flex border-b border-line text-xs">
            {(["email", "whatsapp", "sms"] as Channel[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setTab(c);
                  const first = messages.find((m) => m.channel === c);
                  if (first) setSelectedId(first.id);
                }}
                className={
                  tab === c
                    ? "px-5 py-2.5 font-medium border-b-2 border-brand text-brand-deep"
                    : "px-5 py-2.5 font-medium border-b-2 border-transparent text-mute"
                }
              >
                {c === "email" ? t("email") : c === "whatsapp" ? t("whatsapp") : t("smsCalls")}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-[minmax(0,340px)_1fr]">
            <div className="border-r border-line divide-y divide-line max-h-[calc(100vh-14rem)] overflow-y-auto">
              {list.map((m) => {
                const unread = m.unread && !read.includes(m.id);
                const active = selected?.id === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => select(m.id)}
                    className={`w-full text-left flex gap-3 px-4 py-3 transition-colors ${
                      active ? "bg-paper" : "hover:bg-paper"
                    }`}
                  >
                    <span
                      className={`mt-1.5 size-2 rounded-full shrink-0 ${
                        m.missed ? "bg-danger" : unread ? "bg-brand" : "bg-mute"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className={`text-sm truncate ${unread ? "font-semibold" : "font-medium text-mute"}`}>
                          {m.from}
                        </span>
                        <span className="text-[11px] text-mute shrink-0">{m.time}</span>
                      </span>
                      <span className="block text-xs font-medium truncate">{m.subject}</span>
                      <span className="block text-xs text-mute truncate">{m.preview}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-5 min-h-80">
              {selected ? (
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display font-semibold">{selected.subject}</p>
                      <p className="text-xs text-mute mt-0.5">
                        {selected.from} · {selected.company} · {selected.time}
                      </p>
                    </div>
                    {selected.missed ? (
                      <span className="text-[11px] font-medium px-2 py-1 rounded-md bg-danger/10 text-danger shrink-0">
                        {t("missedCalls")}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed">
                    {selected.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  <div className="mt-auto pt-6 flex gap-2">
                    <button
                      type="button"
                      className="h-9 px-4 rounded-lg bg-brand text-brand-foreground text-sm font-semibold"
                    >
                      {selected.missed ? t("callNow") : t("reply")}
                    </button>
                    <button type="button" className="h-9 px-4 rounded-lg border border-line text-sm text-mute">
                      {t("forward")}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-mute">{t("noneSelected")}</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
