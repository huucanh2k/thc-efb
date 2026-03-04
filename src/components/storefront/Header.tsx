import Link from "next/link";
import { Gamepad2 } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
            <Gamepad2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">
            Shop eFootball<span className="text-indigo-400"> THC</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
