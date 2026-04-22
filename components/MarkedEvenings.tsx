"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "luna-track-marked-dates";

export type EveningTag = "fast" | "feast" | "rest" | "custom";

export type MarkedEvening = {
  id: string;
  date: string;
  tag: EveningTag;
  label: string;
};

const TAGS: { id: EveningTag; label: string }[] = [
  { id: "fast", label: "Fast" },
  { id: "feast", label: "Feast" },
  { id: "rest", label: "Rest" },
  { id: "custom", label: "Custom" },
];

const tagStyle: Record<EveningTag, string> = {
  fast: "border-violet-400/25 bg-violet-500/10 text-violet-200/90",
  feast: "border-amber-400/25 bg-amber-500/10 text-amber-100/90",
  rest: "border-sky-400/25 bg-sky-500/10 text-sky-100/90",
  custom: "border-[var(--border)] bg-white/[0.04] text-[var(--muted)]",
};

function load(): MarkedEvening[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MarkedEvening[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(rows: MarkedEvening[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

export function MarkedEvenings() {
  const [rows, setRows] = useState<MarkedEvening[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [tag, setTag] = useState<EveningTag>("custom");
  const [label, setLabel] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setRows(load());
    setMounted(true);
  }, []);

  const sorted = useMemo(
    () => [...rows].sort((a, b) => a.date.localeCompare(b.date)),
    [rows],
  );

  const add = useCallback(() => {
    const lab = label.trim() || TAGS.find((t) => t.id === tag)?.label || "Marked";
    const row: MarkedEvening = {
      id: crypto.randomUUID(),
      date,
      tag,
      label: lab,
    };
    setRows((prev) => {
      const next = [...prev.filter((r) => !(r.date === date && r.tag === tag)), row].slice(
        0,
        120,
      );
      save(next);
      return next;
    });
    setLabel("");
  }, [date, tag, label]);

  const remove = useCallback((id: string) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== id);
      save(next);
      return next;
    });
  }, []);

  return (
    <section className="luna-card-quiet">
      <h2 className="font-serif text-xl text-[var(--foreground)]">Evening pins</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--muted)]">
        Gentle reminders — fasts, feasts, quiet nights. Stored locally.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="sm:w-[9.5rem]">
          <span className="luna-overline">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="luna-input"
          />
        </label>
        <label className="sm:w-[8.5rem]">
          <span className="luna-overline">Kind</span>
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value as EveningTag)}
            className="luna-input cursor-pointer"
          >
            {TAGS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-0 flex-1">
          <span className="luna-overline">Label</span>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Optional"
            className="luna-input"
          />
        </label>
        <button type="button" onClick={add} className="luna-btn-soft w-full sm:w-auto">
          Pin
        </button>
      </div>
      <ul className="mt-5 space-y-2 text-[14px]">
        {!mounted ? (
          <li className="text-[var(--muted)]">…</li>
        ) : sorted.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-[var(--border)] py-8 text-center text-[13px] text-[var(--muted-2)]">
            No pins yet.
          </li>
        ) : (
          sorted.map((r) => (
            <li
              key={r.id}
              className="luna-list-row flex items-start justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs tabular-nums text-[var(--foreground)]">{r.date}</span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tagStyle[r.tag]}`}
                  >
                    {r.tag}
                  </span>
                </div>
                <p className="mt-1 text-[var(--foreground)]">{r.label}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(r.id)}
                className="shrink-0 rounded-full px-2 py-1 text-[11px] font-medium text-[var(--muted-2)] transition hover:bg-white/5 hover:text-rose-200/90"
              >
                Remove
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
