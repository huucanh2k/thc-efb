import { Gamepad2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <Gamepad2 className="h-5 w-5" />
            <span className="text-sm font-medium">Shop eFootball</span>
          </div>
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Bản quyền thuộc về Shop.
          </p>
        </div>
      </div>
    </footer>
  );
}
