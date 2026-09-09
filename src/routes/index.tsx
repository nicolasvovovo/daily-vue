import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useSettings } from "@/lib/settings";
import {
  cc,
  contacts,
  initialActions,
  initialEvents,
  messages,
  tagLabels,
  type ActionItem,
  type Channel,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today's Briefing — Verdant Ops Command" },
      {
        name: "description",
        content:
          "Start the day with your meetings, missed calls and priority actions in one operations command center.",
      },
      { property: "og:title", content: "Today's Briefing — Verdant Ops Command" },
      {
        property: "og:description",
        content: "Meetings, missed calls and priority actions in one operations command center.",
      },
    ],
  }),
  component: Briefing,
});

function Briefing() {
  const { t } = useSettings();
  const navigate = useNavigate();
  const [actions, setActions] = useState<ActionItem[]>(initialActions);
  const [tab, setTab] = useState<Channel>("email");

  const todays = initialEvents.filter((e) => e.date === 12);
  const openActions = actions.filter((a) => !a.done).length;
  const missed = messages.filter((m) => m.missed).length;
  const tabMessages = messages.filter((m) => m.channel === tab).slice(0, 3);

  const toggle = (id: string) =>
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a)));

  return (
    <AppShell>
      <main className="p-5 lg:p-7 space-y-6">
        <div className="rounded-2xl bg-brand relative overflow-hidden p-6 lg:p-7 text-brand-foreground">
          <div className="absolute -right-10 -top-16 size-56 rounded-full bg-brand-foreground/10" />
          <div className="absolute right-24 -bottom-20 size-40 rounded-full bg-brand-foreground/5" />
          <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="text-brand-foreground/70 text-xs font-medium uppercase tracking-[0.16em]">
                Wednesday · 12 June
              </p>
              <h1 className="mt-2 font-display text-3xl lg:text-4xl font-semibold tracking-tight">{t("greeting")}</h1>
              <p className="mt-2 text-brand-foreground/80 max-w-md text-sm">
                {t("greetingSub", { m: todays.length, c: missed, a: openActions })}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate({ to: "/inbox" })}
                className="h-10 px-4 rounded-lg bg-surface text-brand-deep text-sm font-semibold"
              >
                {t("reviewBoard")}
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/calendar" })}
                className="h-10 px-4 rounded-lg bg-brand-foreground/15 text-sm font-medium border border-brand-foreground/25"
              >
                {t("openCalendar")}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label={t("meetingsToday")} value={String(todays.length)} note={`${t("nextAt")} 10:30`} noteClass="text-good" glyph="▦" glyphClass="bg-brand/10 text-brand" />
          <Stat label={t("missedCalls")} value={String(missed)} note={t("awaitingCallback")} noteClass="text-mute" glyph="✆" glyphClass="bg-danger/10 text-danger" />
          <Stat label={t("openEmails")} value="14" note={t("unreadFlagged")} noteClass="text-mute" glyph="✉" glyphClass="bg-warn/15 text-warn" />
          <Stat label={t("actionItems")} value={String(openActions)} note={t("dueBefore")} noteClass="text-good" glyph="✓" glyphClass="bg-good/10 text-good" />
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <section className="rounded-xl bg-surface border border-line">
              <div className="flex items-center justify-between px-5 py-4 border-b border-line">
                <div>
                  <h2 className="font-display font-semibold">{t("todaysMeetings")}</h2>
                  <p className="text-xs text-mute mt-0.5">
                    {t("unifiedSchedule")} · {todays.length} {t("events")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-lg border border-line bg-paper p-0.5 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-surface shadow-sm font-medium">{t("day")}</span>
                    <Link to="/calendar" className="px-2.5 py-1 rounded-md text-mute">
                      {t("week")}
                    </Link>
                    <Link to="/calendar" className="px-2.5 py-1 rounded-md text-mute">
                      {t("month")}
                    </Link>
                  </div>
                  <Link
                    to="/calendar"
                    className="h-8 px-3 rounded-lg bg-brand text-brand-foreground text-xs font-semibold grid place-items-center"
                  >
                    {t("addMeeting")}
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-line">
                {todays.map((e) => (
                  <div key={e.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="w-14 text-right shrink-0">
                      <p className="text-sm font-semibold">{e.start}</p>
                      <p className="text-[11px] text-mute">{e.duration}</p>
                    </div>
                    <div className={`w-1 self-stretch rounded-full ${cc(e.color).dot}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{e.title}</p>
                      <p className="text-xs text-mute truncate">{e.detail}</p>
                    </div>
                    <span className={`text-[11px] font-medium px-2 py-1 rounded-md shrink-0 ${cc(e.color).chip}`}>
                      {tagLabels[e.tag]}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl bg-surface border border-line overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-line">
                <h2 className="font-display font-semibold">{t("inbox")}</h2>
                <span className="text-xs text-mute">14 {t("new")}</span>
              </div>
              <div className="flex border-b border-line text-xs">
                {(["email", "whatsapp", "sms"] as Channel[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setTab(c)}
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
              <div className="divide-y divide-line text-sm">
                {tabMessages.map((m) => (
                  <Link
                    key={m.id}
                    to="/inbox"
                    className="flex items-center gap-3 px-5 py-3 hover:bg-paper transition-colors"
                  >
                    <span
                      className={`size-2 rounded-full shrink-0 ${
                        m.missed ? "bg-danger" : m.unread ? "bg-brand" : "bg-mute"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium truncate ${m.unread ? "" : "text-mute"}`}>
                        {m.from} — {m.subject}
                      </p>
                      <p className="text-xs text-mute truncate">{m.preview}</p>
                    </div>
                    <span className="text-[11px] text-mute shrink-0">{m.time}</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-5">
            <section className="rounded-xl bg-surface border border-line">
              <div className="flex items-center justify-between px-5 py-4 border-b border-line">
                <h2 className="font-display font-semibold">{t("priorityActions")}</h2>
                <span className="text-xs text-mute">
                  {openActions} {t("open")}
                </span>
              </div>
              <div className="p-3 space-y-1">
                {actions.map((a) => (
                  <label key={a.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-paper cursor-pointer">
                    <input
                      type="checkbox"
                      checked={a.done}
                      onChange={() => toggle(a.id)}
                      className="mt-0.5 size-4 accent-brand"
                    />
                    <span className="flex-1">
                      <span className={`text-sm ${a.done ? "line-through text-mute" : ""}`}>{a.label}</span>
                      {a.due && !a.done ? (
                        <span className={`block text-[11px] ${a.overdue ? "text-danger" : "text-mute"}`}>{a.due}</span>
                      ) : null}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-xl bg-surface border border-line">
              <div className="px-5 py-4 border-b border-line flex items-center justify-between">
                <h2 className="font-display font-semibold">{t("timeline")}</h2>
                <Link to="/contacts" className="text-xs text-brand-deep font-medium">
                  {t("viewAll")}
                </Link>
              </div>
              <div className="p-4 space-y-3">
                {contacts.slice(0, 3).map((c) => (
                  <Link
                    key={c.id}
                    to="/contacts"
                    search={{ id: c.id }}
                    className="flex items-center gap-3 hover:bg-paper rounded-lg p-1.5 transition-colors"
                  >
                    <span
                      className={`size-10 rounded-lg grid place-items-center text-xs font-semibold ${cc(c.color).chip}`}
                    >
                      {c.initials}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{c.company}</p>
                      <p className="text-[11px] text-mute truncate">
                        {c.status} · {c.timeline.length} updates
                      </p>
                    </div>
                    <span className="text-mute">›</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  note,
  noteClass,
  glyph,
  glyphClass,
}: {
  label: string;
  value: string;
  note: string;
  noteClass: string;
  glyph: string;
  glyphClass: string;
}) {
  return (
    <div className="rounded-xl bg-surface border border-line p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-mute font-medium">{label}</p>
        <span className={`size-7 rounded-lg grid place-items-center text-sm ${glyphClass}`}>{glyph}</span>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
      <p className={`mt-1 text-[11px] font-medium ${noteClass}`}>{note}</p>
    </div>
  );
}
