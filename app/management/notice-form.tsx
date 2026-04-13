"use client";

import { useState, useTransition } from "react";
import { upsertNotice, deactivateNotice } from "@/lib/actions/notices";

type NoticeBg = "default" | "amber" | "rose" | "fuchsia" | "green";

interface ActiveNotice {
  id: string;
  body: string;
  bg: NoticeBg;
  from_name: string;
}

const bgOptions: { value: NoticeBg; label: string; preview: string }[] = [
  { value: "default",  label: "Default",  preview: "bg-white border-warm-300" },
  { value: "amber",    label: "Amber",    preview: "bg-amber-50 border-amber-300" },
  { value: "rose",     label: "Rose",     preview: "bg-rose-50 border-rose-300" },
  { value: "fuchsia",  label: "Fuchsia",  preview: "bg-fuchsia-50 border-fuchsia-300" },
  { value: "green",    label: "Green",    preview: "bg-green-50 border-green-300" },
];

const highlightStyles: Record<NoticeBg, string> = {
  default:  "bg-yellow-200/80 text-yellow-900",
  amber:    "bg-amber-300/60 text-amber-900",
  rose:     "bg-rose-300/60 text-rose-900",
  fuchsia:  "bg-fuchsia-300/60 text-fuchsia-900",
  green:    "bg-green-300/60 text-green-900",
};

function renderPreview(body: string, bg: NoticeBg) {
  const hl = highlightStyles[bg];
  return body.split(/(\*\*.+?\*\*)/g).map((chunk, i) => {
    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return (
        <mark key={i} className={`rounded px-0.5 ${hl}`}>
          {chunk.slice(2, -2)}

        </mark>
      );
    }
    return <span key={i}>{chunk}</span>;
  });
}

export default function NoticeForm({ active }: { active: ActiveNotice | null }) {
  const [body, setBody] = useState(active?.body ?? "");
  const [bg, setBg] = useState<NoticeBg>(active?.bg ?? "default");
  const [fromName, setFromName] = useState(active?.from_name ?? "Ashley");
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleSave() {
    if (!body.trim()) return;
    setSuccess(""); setError("");
    startTransition(async () => {
      const result = await upsertNotice({ body: body.trim(), bg, from_name: fromName.trim() || "Ashley" });
      if (result?.error) setError(result.error);
      else setSuccess("Notice saved and activated.");
    });
  }

  function handleDeactivate() {
    setSuccess(""); setError("");
    startTransition(async () => {
      const result = await deactivateNotice();
      if (result?.error) setError(result.error);
      else { setSuccess("Notice deactivated."); setBody(""); setBg("default"); }
    });
  }

  return (
    <div className="space-y-6">
      {/* Active notice indicator */}
      {active ? (
        <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-sm font-medium text-green-800">A notice is currently active</p>
          <button
            type="button"
            onClick={handleDeactivate}
            disabled={isPending}
            className="rounded-full bg-white px-3 py-1 text-xs font-medium text-red-600 shadow-sm ring-1 ring-red-200 transition hover:bg-red-50 disabled:opacity-50"
          >
            Deactivate
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-warm-200 bg-warm-50 px-4 py-3">
          <p className="text-sm text-warm-500">No active notice. Write one below to publish it.</p>
        </div>
      )}

      {/* From name */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-warm-800">From</label>
        <input
          type="text"
          value={fromName}
          onChange={(e) => setFromName(e.target.value)}
          placeholder="Ashley"
          className="w-full rounded-xl border border-warm-200 bg-white px-4 py-2.5 text-sm text-warm-800 placeholder-warm-400 shadow-sm focus:border-warm-400 focus:outline-none focus:ring-2 focus:ring-warm-200"
        />
      </div>

      {/* Body */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-warm-800">
          Notice text
        </label>
        <p className="mb-2 text-xs text-warm-500">
          Use <code className="rounded bg-warm-100 px-1 py-0.5 font-mono">**text**</code> to highlight words.
          e.g. <code className="rounded bg-warm-100 px-1 py-0.5 font-mono">**20% off** this week only</code>
        </p>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="e.g. 🎉 **Founding member discount** — join before Friday for 20% off your first month."
          className="w-full rounded-xl border border-warm-200 bg-white px-4 py-3 text-sm text-warm-800 placeholder-warm-400 shadow-sm focus:border-warm-400 focus:outline-none focus:ring-2 focus:ring-warm-200 resize-none"
        />
      </div>

      {/* Background colour */}
      <div>
        <label className="mb-2 block text-sm font-medium text-warm-800">Background</label>
        <div className="flex flex-wrap gap-2">
          {bgOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setBg(opt.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${opt.preview} ${bg === opt.value ? "ring-2 ring-warm-600 ring-offset-1" : "opacity-70 hover:opacity-100"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live preview */}
      {body.trim() && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-warm-400">Preview</p>
          <div className={`overflow-hidden rounded-2xl border shadow-sm ${
            bg === "default"  ? "border-warm-200 bg-white" :
            bg === "amber"    ? "border-amber-200 bg-amber-50" :
            bg === "rose"     ? "border-rose-200 bg-rose-50" :
            bg === "fuchsia"  ? "border-fuchsia-200 bg-fuchsia-50" :
                                "border-green-200 bg-green-50"
          }`}>
            <div className={`px-4 py-2.5 ${
              bg === "default"  ? "bg-warm-100" :
              bg === "amber"    ? "bg-amber-100" :
              bg === "rose"     ? "bg-rose-100" :
              bg === "fuchsia"  ? "bg-fuchsia-100" :
                                  "bg-green-100"
            }`}>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-warm-600">Notice</span>
            </div>
            <p className="px-4 py-3 text-sm leading-relaxed text-warm-700">
              {renderPreview(body, bg)}
            </p>
          </div>
        </div>
      )}

      {/* Feedback */}
      {success && <p className="text-sm font-medium text-green-700">{success}</p>}
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        disabled={isPending || !body.trim()}
        className="rounded-full bg-warm-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-warm-700 disabled:opacity-40"
      >
        {isPending ? "Saving…" : active ? "Update & re-publish" : "Publish notice"}
      </button>
    </div>
  );
}
