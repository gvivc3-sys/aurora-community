"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Is Aurora really worth it?",
    a: "Connection is one of the biggest predictors of long-term health and happiness, and it's usually the first thing to slip in a busy life. Aurora gives you a standing space for it: real conversations, real women, and direct access to Ashley, all for less than a couple of coffees a month.",
  },
  {
    q: "What do I actually get with my membership?",
    a: "The Portal (Ashley's articles, voice notes, and community discussion), Discussions (open threads with the whole community), and Ashley's Guides (her full library of guides, books, and audio tracks, worth over $125 alone).",
  },
  {
    q: "Is my privacy protected?",
    a: "Yes. Whispers to Ashley can be sent completely anonymously, and it's always your choice whether to reveal your identity.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, no contracts, no questions asked. Cancel anytime through your account settings.",
  },
  {
    q: "What if I don't click with the community right away?",
    a: "Every woman in Aurora started as a stranger to the rest. Post a whisper, jump into a Discussion, or just read for a while. There's no wrong way to ease in.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-warm-200 rounded-xl border border-warm-200 bg-white shadow-sm">
      {faqs.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
            >
              <span className="text-sm font-medium text-warm-900 sm:text-base">
                {item.q}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`h-5 w-5 shrink-0 text-warm-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              >
                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
            {open && (
              <p className="px-5 pb-4 text-sm leading-relaxed text-warm-600 sm:px-6">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
