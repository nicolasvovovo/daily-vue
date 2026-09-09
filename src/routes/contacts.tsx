import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useSettings } from "@/lib/settings";
import { cc, contacts } from "@/lib/mock-data";

type Search = { id?: string | undefined };

export const Route = createFileRoute("/contacts")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    id: typeof search["id"] === "string" ? (search["id"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Contacts & Client Timeline — Verdant Ops Command" },
      {
        name: "description",
        content: "Every client with a unified history of emails, calls and meetings in a single timeline.",
      },
      { property: "og:title", content: "Contacts & Client Timeline — Verdant Ops Command" },
      { property: "og:description", content: "A unified history of emails, calls and meetings per client." },
    ],
  }),
  component: ContactsPage,
});

const kindGlyph: Record<string, string> = { email: "✉", call: "✆", meeting: "▦" };

function ContactsPage() {
  const { t } = useSettings();
  const { id } = Route.useSearch();
  const navigate = useNavigate({ from: "/contacts" });
  const selected = contacts.find((c) => c.id === id) ?? contacts[0]!;

  return (
    <AppShell>
      <main className="p-5 lg:p-7">
        <section className="rounded-xl bg-surface border border-line overflow-hidden">
          <div className="px-5 py-4 border-b border-line">
            <h1 className="font-display font-semibold text-lg">{t("contacts")}</h1>
            <p className="text-xs text-mute mt-0.5">{contacts.length} clients</p>
          </div>

          <div className="grid md:grid-cols-[minmax(0,300px)_1fr]">
            <div className="border-r border-line divide-y divide-line">
              {contacts.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => navigate({ search: { id: c.id } })}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 transition-colors ${
                    selected.id === c.id ? "bg-paper" : "hover:bg-paper"
                  }`}
                >
                  <span
                    className={`size-9 rounded-lg grid place-items-center text-xs font-semibold shrink-0 ${cc(c.color).chip}`}
                  >
                    {c.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium truncate">{c.name}</span>
                    <span className="block text-[11px] text-mute truncate">{c.company}</span>
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-md shrink-0 ${cc(c.color).chip}`}>
                    {c.status}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-5">
              <div className="flex flex-wrap items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`size-12 rounded-xl grid place-items-center text-sm font-semibold ${cc(selected.color).chip}`}
                  >
                    {selected.initials}
                  </span>
                  <div>
                    <p className="font-display font-semibold text-lg">{selected.name}</p>
                    <p className="text-xs text-mute">
                      {selected.role} · {selected.company}
                    </p>
                    <p className="text-xs text-mute mt-0.5">
                      {selected.email} · {selected.phone}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="h-9 px-4 rounded-lg bg-brand text-brand-foreground text-sm font-semibold"
                  >
                    {t("sendEmail")}
                  </button>
                  <button type="button" className="h-9 px-4 rounded-lg border border-line text-sm text-mute">
                    {t("callNow")}
                  </button>
                </div>
              </div>

              <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">{t("history")}</p>
              <ol className="mt-3 relative border-l border-line pl-6 space-y-5">
                {selected.timeline.map((entry) => (
                  <li key={entry.id} className="relative">
                    <span className="absolute -left-[31px] size-6 rounded-full bg-paper border border-line grid place-items-center text-[11px] text-mute">
                      {kindGlyph[entry.kind] ?? "✉"}
                    </span>
                    <p className="text-sm font-medium">{entry.title}</p>
                    <p className="text-xs text-mute">{entry.detail}</p>
                    <p className="text-[11px] text-mute mt-0.5">{entry.when}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
