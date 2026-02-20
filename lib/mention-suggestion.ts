import { ReactRenderer } from "@tiptap/react";
import type { SuggestionOptions } from "@tiptap/suggestion";
import MentionList from "@/components/mention-list";

export type MentionUser = {
  user_id: string;
  handle: string;
  display_name: string | null;
  avatar_url: string | null;
};

const suggestion: Omit<SuggestionOptions, "editor"> = {
  char: "@",
  items: async ({ query }) => {
    if (!query || query.length < 1) return [];
    const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    return (await res.json()) as MentionUser[];
  },
  render: () => {
    let renderer: ReactRenderer | null = null;
    let container: HTMLDivElement | null = null;

    return {
      onStart: (props) => {
        container = document.createElement("div");
        container.style.position = "absolute";
        container.style.zIndex = "9999";

        // Position near the cursor
        const { view } = props.editor;
        const { from } = view.state.selection;
        const coords = view.coordsAtPos(from);
        container.style.left = `${coords.left}px`;
        container.style.top = `${coords.bottom + 4}px`;

        document.body.appendChild(container);

        renderer = new ReactRenderer(MentionList, {
          props: { ...props, items: props.items ?? [] },
          editor: props.editor,
        });

        container.appendChild(renderer.element as HTMLElement);
      },
      onUpdate: (props) => {
        renderer?.updateProps({ ...props, items: props.items ?? [] });

        if (container) {
          const { view } = props.editor;
          const { from } = view.state.selection;
          const coords = view.coordsAtPos(from);
          container.style.left = `${coords.left}px`;
          container.style.top = `${coords.bottom + 4}px`;
        }
      },
      onKeyDown: (props) => {
        if (props.event.key === "Escape") {
          renderer?.destroy();
          container?.remove();
          return true;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (renderer?.ref as any)?.onKeyDown?.(props.event) ?? false;
      },
      onExit: () => {
        renderer?.destroy();
        container?.remove();
      },
    };
  },
};

export default suggestion;
