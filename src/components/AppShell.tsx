import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import avatar from "@/assets/avatar.jpg";
import { languages, useSettings, type Lang } from "@/lib/settings";

const nav = [
  { to: "/", key: "briefing", glyph: "●" },
  { to: "/calendar", key: "calendar", glyph: "▦" },
  { to: "/inbox", key: "inbox", glyph: "✉", badge: "14" },
  { to: "/contacts", key: "timeline", glyph: "◎" },
] as const;

const insight = [
  { key: "reports", glyph: "▤" },
  { key: "automation", glyph: "✦" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { t, theme, setTheme, lang, setLang } = useSettings();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="font-sans min-h-screen bg-paper text-ink antialiased flex">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-line bg-surface sticky top-0 h-screen">
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-line">
          <div className="size-8 rounded-lg bg-brand grid place-items-center font-display font-bold text-brand-foreground text-sm">
            V
          </div>
          <div>
            <p className="font-display font-semibold leading-none">Verdant</p>
            <p className="text-[11px] text-mute mt-0.5">Ops Command</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">{t("workspace")}</p>
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  active
                    ? "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-brand/10 text-brand-deep font-medium"
                    : "flex items-center gap-3 px-3 py-2.5 rounded-lg text-mute hover:bg-paper transition-colors"
                }
              >
                {active ? (
                  <span className="size-2 rounded-full bg-brand" />
                ) : (
                  <span className="w-4 text-center font-display">{item.glyph}</span>
                )}
                {t(item.key)}
                {"badge" in item && item.badge ? (
                  <span className="ml-auto text-[10px] font-semibold text-brand-foreground bg-brand rounded-full px-1.5 py-0.5">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}

          <p className="px-3 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">{t("insight")}</p>
          {insight.map((item) => (
            <button
              key={item.key}
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-mute hover:bg-paper transition-colors"
            >
              <span className="w-4 text-center font-display">{item.glyph}</span>
              {t(item.key)}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-line">
          <div className="rounded-lg bg-paper p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{t("storage")}</span>
              <span className="text-mute">4.2 GB</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-line overflow-hidden">
              <div className="h-full w-3/5 bg-brand rounded-full" />
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 shrink-0 border-b border-line bg-surface sticky top-0 z-20 flex items-center gap-4 px-5">
          <div className="hidden md:block w-full max-w-md">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mute text-xs">⌕</span>
              <input
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-paper text-sm placeholder:text-mute border border-line focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder={t("search")}
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <label className="hidden sm:flex items-center gap-2">
              <span className="text-[11px] text-mute">{t("language")}</span>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="h-9 rounded-lg border border-line bg-surface px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-center rounded-lg border border-line bg-paper p-0.5">
              <button
                type="button"
                onClick={() => setTheme("light")}
                title={t("lightMode")}
                className={
                  theme === "light"
                    ? "size-8 rounded-md bg-surface shadow-sm grid place-items-center"
                    : "size-8 rounded-md grid place-items-center text-mute"
                }
              >
                <span className="text-sm">☀</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                title={t("darkMode")}
                className={
                  theme === "dark"
                    ? "size-8 rounded-md bg-surface shadow-sm grid place-items-center"
                    : "size-8 rounded-md grid place-items-center text-mute"
                }
              >
                <span className="text-sm">☾</span>
              </button>
            </div>

            <button
              type="button"
              className="relative size-9 rounded-lg border border-line bg-surface grid place-items-center"
              title="Notifications"
            >
              <span className="text-sm">🔔</span>
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-brand text-brand-foreground text-[10px] grid place-items-center font-semibold">
                3
              </span>
            </button>

            <div className="flex items-center gap-2.5 pl-1">
              <img src={avatar} alt="Maya Okonkwo" className="size-9 rounded-full object-cover" />
              <div className="hidden lg:block leading-tight">
                <p className="text-sm font-medium">Maya Okonkwo</p>
                <p className="text-[11px] text-mute">Operations Lead</p>
              </div>
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
