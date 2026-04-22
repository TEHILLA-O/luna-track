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
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
      <h2 className="font-serif text-xl text-[var(--foreground)]">Night-sky notes</h2>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Kept only in this browser — clouds, seeing, constellations, or whatever you noticed.
      </p>
      <label className="mt-4 block text-xs uppercase tracking-wider text-[var(--muted)]">
        New note
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-[var(--accent)]/40 placeholder:text-white/25 focus:ring-2"
          placeholder="Thin cirrus, Jupiter above the roofline…"
        />
      </label>
      <button
        type="button"
        onClick={add}
        className="mt-3 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] transition hover:brightness-110"
      >
        Save to journal
      </button>
      <ul className="mt-6 max-h-72 space-y-3 overflow-y-auto pr-1 text-sm">
        {!mounted ? (
          <li className="text-[var(--muted)]">Loading…</li>
        ) : entries.length === 0 ? (
          <li className="text-[var(--muted)]">No entries yet.</li>
        ) : (
          entries.map((e) => (
            <li
              key={e.id}
              className="rounded-xl border border-white/5 bg-black/25 px-3 py-2"
            >
              <time className="text-[10px] uppercase tracking-wider text-white/35">
                {new Date(e.at).toLocaleString()}
              </time>
              <p className="mt-1 whitespace-pre-wrap text-[var(--foreground)]">{e.body}</p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
