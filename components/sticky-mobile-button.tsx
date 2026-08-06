import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
};

const buttonClass =
  "flex w-full max-w-sm items-center justify-center gap-2 rounded-lg bg-warm-800 px-6 py-4 text-base font-semibold text-white shadow-xl transition-all hover:bg-warm-700 active:scale-[0.98]";

export default function StickyMobileButton({ label, icon, href, onClick }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] md:hidden">
      {href ? (
        <Link href={href} className={buttonClass}>
          {icon}
          {label}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className={buttonClass}>
          {icon}
          {label}
        </button>
      )}
    </div>
  );
}
