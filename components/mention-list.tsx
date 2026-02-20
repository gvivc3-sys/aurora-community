"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import type { MentionUser } from "@/lib/mention-suggestion";

type MentionListProps = {
  items: MentionUser[];
  command: (item: { id: string; label: string }) => void;
};

const MentionList = forwardRef<{ onKeyDown: (e: KeyboardEvent) => boolean }, MentionListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    const selectItem = (index: number) => {
      const item = items[index];
      if (item) {
        command({ id: item.user_id, label: item.handle });
      }
    };

    useImperativeHandle(ref, () => ({
      onKeyDown: (event: KeyboardEvent) => {
        if (event.key === "ArrowUp") {
          setSelectedIndex((prev) => (prev + items.length - 1) % items.length);
          return true;
        }
        if (event.key === "ArrowDown") {
          setSelectedIndex((prev) => (prev + 1) % items.length);
          return true;
        }
        if (event.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      },
    }));

    if (items.length === 0) return null;

    return (
      <div className="overflow-hidden rounded-xl border border-warm-200 bg-white shadow-lg">
        {items.map((item, index) => (
          <button
            key={item.user_id}
            type="button"
            onClick={() => selectItem(index)}
            className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
              index === selectedIndex
                ? "bg-warm-100 text-warm-900"
                : "text-warm-700 hover:bg-warm-50"
            }`}
          >
            {item.avatar_url ? (
              <img
                src={item.avatar_url}
                alt=""
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-warm-200 text-xs font-medium text-warm-600">
                {(item.display_name || item.handle)[0]?.toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-medium text-warm-900">
                {item.display_name || item.handle}
              </p>
              <p className="truncate text-xs text-warm-500">@{item.handle}</p>
            </div>
          </button>
        ))}
      </div>
    );
  },
);

MentionList.displayName = "MentionList";

export default MentionList;
