"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

type RichTextEditorProps = {
  name: string;
  placeholder?: string;
  minHeight?: string;
};

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded px-2 py-1 text-sm transition-colors ${
        active
          ? "bg-zinc-900 text-white"
          : "text-zinc-600 hover:bg-zinc-200"
      }`}
    >
      {children}
    </button>
  );
}

function EmojiButton({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title="Emoji"
        className="rounded px-2 py-1 text-sm text-zinc-600 transition-colors hover:bg-zinc-200"
      >
        <span className="text-base leading-none">😊</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1">
          <EmojiPicker
            onEmojiClick={(data: EmojiClickData) => {
              onSelect(data.emoji);
              setOpen(false);
            }}
            width={320}
            height={360}
            skinTonesDisabled
            searchPlaceHolder="Search emoji..."
          />
        </div>
      )}
    </div>
  );
}

export default function RichTextEditor({
  name,
  placeholder,
  minHeight = "5rem",
}: RichTextEditorProps) {
  const [html, setHtml] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-sm prose-zinc max-w-none focus:outline-none",
        style: `min-height: ${minHeight}`,
      },
    },
    content: "",
    onUpdate: ({ editor: e }) => {
      setHtml(e.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-md border border-zinc-300 shadow-sm focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-zinc-200 bg-zinc-50 px-2 py-1.5">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
        >
          <span className="underline">U</span>
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-zinc-300" />

        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M6 4.75A.75.75 0 0 1 6.75 4h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 4.75ZM6 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 10Zm0 5.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 1-.75-.75ZM1.99 4.75a1 1 0 0 1 1-1h.01a1 1 0 0 1 0 2h-.01a1 1 0 0 1-1-1ZM2.99 9a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM1.99 15.25a1 1 0 0 1 1-1h.01a1 1 0 0 1 0 2h-.01a1 1 0 0 1-1-1Z" clipRule="evenodd" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M6 4.75A.75.75 0 0 1 6.75 4h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 4.75ZM6 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 10Zm0 5.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
            <text x="1" y="6" fontSize="5" fontWeight="bold" fill="currentColor">1</text>
            <text x="1" y="11.5" fontSize="5" fontWeight="bold" fill="currentColor">2</text>
            <text x="1" y="17" fontSize="5" fontWeight="bold" fill="currentColor">3</text>
          </svg>
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-zinc-300" />

        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading"
        >
          H
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M4.5 3A2.5 2.5 0 0 0 2 5.5v3.006a2.5 2.5 0 0 0 2.5 2.5h.006a.75.75 0 0 0 0-1.5H4.5a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3.006a1 1 0 0 1-1 1 2.494 2.494 0 0 0-1.591.58A3.991 3.991 0 0 0 4.5 13.5a.75.75 0 0 0 1.5 0c0-.638.26-1.217.678-1.635.419-.419.998-.679 1.636-.679A2.494 2.494 0 0 0 10.5 8.506V5.5A2.5 2.5 0 0 0 8 3H4.5Zm8 0A2.5 2.5 0 0 0 10 5.5v3.006a2.5 2.5 0 0 0 2.5 2.5h.006a.75.75 0 0 0 0-1.5H12.5a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3.006a1 1 0 0 1-1 1 2.494 2.494 0 0 0-1.591.58A3.991 3.991 0 0 0 12.5 13.5a.75.75 0 0 0 1.5 0c0-.638.26-1.217.678-1.635.419-.419.998-.679 1.636-.679A2.494 2.494 0 0 0 18.5 8.506V5.5A2.5 2.5 0 0 0 16 3h-3.5Z" clipRule="evenodd" />
          </svg>
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-zinc-300" />

        <EmojiButton
          onSelect={(emoji) => editor.chain().focus().insertContent(emoji).run()}
        />
      </div>

      {/* Editor area */}
      <div className="px-3 py-2">
        <EditorContent editor={editor} />
      </div>

      {/* Hidden input synced via onUpdate */}
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
