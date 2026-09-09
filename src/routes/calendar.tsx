import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useSettings } from "@/lib/settings";
import {
  cc,
  eventColors,
  initialEvents,
  tagLabels,
  type CalEvent,
  type EventTag,
} from "@/lib/mock-data";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Unified Calendar — Verdant Ops Command" },
      {
        name: "description",
        content: "Day, week and month views of every meeting and custom event, with tags, colors and notes.",
      },
      { property: "og:title", content: "Unified Calendar — Verdant Ops Command" },
      { property: "og:description", content: "Day, week and month views with custom tags, colors and notes." },
    ],
  }),
  component: CalendarPage,
});

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

function CalendarPage() {
  const { t } = useSettings();
  const [events, setEvents] = useState<CalEvent[]>(initialEvents);
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [modal, setModal] = useState<null | "meeting" | "custom">(null);

  const addEvent = (e: CalEvent) => {
    setEvents((prev) => [...prev, e]);
    setModal(null);
  };

  return (
    <AppShell>
      <main className="p-5 lg:p-7 space-y-5">
        <section className="rounded-xl bg-surface border border-line">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line">
            <div>
              <h1 className="font-display font-semibold text-lg">{t("calendar")}</h1>
              <p className="text-xs text-mute mt-0.5">
                June 10 – 16 · {events.length} {t("events")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-line bg-paper p-0.5 text-xs">
                {(["day", "week", "month"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    className={
                      view === v
                        ? "px-2.5 py-1 rounded-md bg-surface shadow-sm font-medium"
                        : "px-2.5 py-1 rounded-md text-mute"
                    }
                  >
                    {t(v)}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setModal("meeting")}
                className="h-8 px-3 rounded-lg bg-brand text-brand-foreground text-xs font-semibold"
              >
                {t("addMeeting")}
              </button>
              <button
                type="button"
                onClick={() => setModal("custom")}
                className="h-8 px-3 rounded-lg border border-line bg-paper text-xs font-semibold text-mute"
              >
                {t("addCustomEvent")}
              </button>
            </div>
          </div>

          {view === "day" ? <DayView events={events.filter((e) => e.date === 12)} /> : null}
          {view === "week" ? <WeekView events={events} /> : null}
          {view === "month" ? <MonthView events={events} /> : null}
        </section>
      </main>

      {modal ? <EventModal kind={modal} onClose={() => setModal(null)} onSave={addEvent} /> : null}
    </AppShell>
  );
}

function DayView({ events }: { events: CalEvent[] }) {
  return (
    <div className="divide-y divide-line">
      {hours.map((h) => {
        const slot = events.filter((e) => e.start.slice(0, 2) === h.slice(0, 2));
        return (
          <div key={h} className="flex gap-4 px-5 py-3 min-h-14">
            <span className="w-14 shrink-0 text-xs text-mute pt-1">{h}</span>
            <div className="flex-1 space-y-2">
              {slot.map((e) => (
                <div key={e.id} className={`rounded-lg px-3 py-2 ${cc(e.color).chip}`}>
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="text-xs opacity-80">
                    {e.start} · {e.duration} · {tagLabels[e.tag]}
                  </p>
                  {e.notes ? <p className="text-xs opacity-70 mt-1">{e.notes}</p> : null}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WeekView({ events }: { events: CalEvent[] }) {
  return (
    <div className="grid grid-cols-7 divide-x divide-line overflow-x-auto">
      {weekDays.map((d, i) => (
        <div key={d} className="min-w-[130px]">
          <div className="px-3 py-2.5 border-b border-line">
            <p className="text-xs font-semibold">{d}</p>
            <p className="text-[11px] text-mute">{10 + i} June</p>
          </div>
          <div className="p-2 space-y-2 min-h-64">
            {events
              .filter((e) => e.day === i)
              .map((e) => (
                <div key={e.id} className={`rounded-lg px-2.5 py-2 ${cc(e.color).chip}`}>
                  <p className="text-[11px] font-semibold">{e.start}</p>
                  <p className="text-xs font-medium leading-snug">{e.title}</p>
                  <p className="text-[10px] opacity-75 mt-0.5">{tagLabels[e.tag]}</p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MonthView({ events }: { events: CalEvent[] }) {
  const cells = Array.from({ length: 35 }, (_, i) => i - 2); // June starts on a Thursday-ish offset
  return (
    <div>
      <div className="grid grid-cols-7 border-b border-line">
        {weekDays.map((d) => (
          <div key={d} className="px-3 py-2 text-[11px] font-semibold text-mute">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((n, idx) => {
          const dayNum = n + 1;
          const valid = dayNum >= 1 && dayNum <= 30;
          const dayEvents = valid ? events.filter((e) => e.date === dayNum) : [];
          return (
            <div key={idx} className="min-h-24 border-b border-r border-line p-2">
              <p className={`text-[11px] ${valid ? "text-mute" : "text-mute/40"}`}>{valid ? dayNum : ""}</p>
              <div className="mt-1 space-y-1">
                {dayEvents.map((e) => (
                  <div key={e.id} className="flex items-center gap-1.5">
                    <span className={`size-1.5 rounded-full shrink-0 ${cc(e.color).dot}`} />
                    <span className="text-[11px] truncate">{e.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventModal({
  kind,
  onClose,
  onSave,
}: {
  kind: "meeting" | "custom";
  onClose: () => void;
  onSave: (e: CalEvent) => void;
}) {
  const { t } = useSettings();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(12);
  const [start, setStart] = useState("10:00");
  const [duration, setDuration] = useState("30 min");
  const [tag, setTag] = useState<EventTag>(kind === "meeting" ? "team" : "custom");
  const [color, setColor] = useState("brand");
  const [notes, setNotes] = useState("");

  const submit = () => {
    if (!title.trim()) return;
    onSave({
      id: `e${Date.now()}`,
      title: title.trim(),
      detail: notes.trim() || tagLabels[tag],
      day: Math.min(6, Math.max(0, date - 10)),
      date,
      start,
      duration,
      tag,
      color,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl bg-surface border border-line shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-line">
          <h2 className="font-display font-semibold">{kind === "meeting" ? t("addMeeting") : t("addCustomEvent")}</h2>
        </div>
        <div className="p-5 space-y-3">
          <Field label={t("title")}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-9 rounded-lg border border-line bg-paper px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="Kickoff with Northwind Labs"
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label={t("date")}>
              <select
                value={date}
                onChange={(e) => setDate(Number(e.target.value))}
                className="w-full h-9 rounded-lg border border-line bg-paper px-2 text-sm"
              >
                {[10, 11, 12, 13, 14, 15, 16].map((d) => (
                  <option key={d} value={d}>
                    {d} June
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("time")}>
              <select
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full h-9 rounded-lg border border-line bg-paper px-2 text-sm"
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("duration")}>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full h-9 rounded-lg border border-line bg-paper px-2 text-sm"
              >
                {["15 min", "30 min", "45 min", "60 min"].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label={t("tag")}>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(tagLabels) as EventTag[]).map((tg) => (
                <button
                  key={tg}
                  type="button"
                  onClick={() => setTag(tg)}
                  className={
                    tag === tg
                      ? "px-2.5 py-1 rounded-md text-[11px] font-medium bg-brand text-brand-foreground"
                      : "px-2.5 py-1 rounded-md text-[11px] font-medium border border-line text-mute"
                  }
                >
                  {tagLabels[tg]}
                </button>
              ))}
            </div>
          </Field>
          <Field label={t("color")}>
            <div className="flex gap-2">
              {eventColors.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setColor(c.key)}
                  className={`size-6 rounded-full ${c.dot} ${
                    color === c.key ? "ring-2 ring-offset-2 ring-brand ring-offset-surface" : ""
                  }`}
                  title={c.key}
                />
              ))}
            </div>
          </Field>
          <Field label={t("notes")}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="Agenda, links, prep…"
            />
          </Field>
        </div>
        <div className="px-5 py-4 border-t border-line flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-9 px-4 rounded-lg border border-line text-sm text-mute">
            {t("cancel")}
          </button>
          <button
            type="button"
            onClick={submit}
            className="h-9 px-4 rounded-lg bg-brand text-brand-foreground text-sm font-semibold"
          >
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium text-mute mb-1.5">{label}</span>
      {children}
    </label>
  );
}
