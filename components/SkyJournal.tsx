"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "luna-track-sky-journal";

export type SkyEntry = {
  id: string;
  at: string;
  body: string;
};

function load(): SkyEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SkyEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(entries: SkyEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function SkyJournal() {
  const [entries, setEntries] = useState<SkyEntry[]>([]);
  const [draft, setDraft] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEntries(load());
    setMounted(true);
  }, []);

  const add = useCallback(() => {
    const body = draft.trim();
    if (!body) return;
    const row: SkyEntry = {
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      body,
    };
    setEntries((prev) => {
      const next = [row, ...prev].slice(0, 80);
      save(next);
      return next;
    });
    setDraft("");
  }, [draft]);

  return (
    <section className="luna-card-quiet">
      <h2 className="font-serif text-xl text-[var(--foreground)]">Sky notes</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--muted)]">
        Saved only on this device — a few words about the sky tonight.
      </p>
      <label className="mt-5 block">
        <span className="luna-overline">Write</span>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className="luna-input resize-y"
          placeholder="Wispy clouds, bright Venus…"
        />
      </label>
      <button type="button" onClick={add} className="luna-btn-primary mt-3 w-full sm:w-auto">
        Save note
      </button>
      <ul className="mt-6 max-h-64 space-y-2.5 overflow-y-auto pr-1 text-[14px]">
        {!mounted ? (
          <li className="text-[var(--muted)]">…</li>
        ) : entries.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-[var(--border)] py-8 text-center text-[13px] text-[var(--muted-2)]">
            Nothing here yet. Your first note goes above.
          </li>
        ) : (
          entries.map((e) => (
            <li key={e.id} className="luna-list-row">
              <time className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--muted-2)]">
                {new Date(e.at).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </time>
              <p className="mt-1.5 whitespace-pre-wrap leading-relaxed text-[var(--foreground)]">
                {e.body}
              </p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
