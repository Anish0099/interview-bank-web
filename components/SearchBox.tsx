"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBox({
  initialValue = "",
  autoFocus = false,
}: {
  initialValue?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
      className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-card focus-within:ring-2 focus-within:ring-brand-500"
    >
      <label htmlFor="q" className="sr-only">
        Search interview questions
      </label>
      <input
        id="q"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="search"
        placeholder="Search company, role or topic…"
        className="flex-1 border-0 bg-transparent px-3 py-2 text-base text-zinc-900 outline-none placeholder:text-zinc-400"
        autoComplete="off"
        autoFocus={autoFocus}
      />
      <button type="submit" className="btn-primary">
        Search
      </button>
    </form>
  );
}
