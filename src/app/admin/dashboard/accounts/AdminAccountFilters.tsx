"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { ArrowUpDown, SlidersHorizontal, Search } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "price_asc", label: "Giá bán tăng" },
  { value: "price_desc", label: "Giá bán giảm" },
  { value: "purchase_asc", label: "Giá nhập tăng" },
  { value: "purchase_desc", label: "Giá nhập giảm" },
  { value: "gp_desc", label: "GP cao nhất" },
  { value: "strength_desc", label: "Lực chiến cao nhất" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "Available", label: "Sẵn Sàng" },
  { value: "Pending", label: "Đang Chờ" },
  { value: "Sold", label: "Đã Bán" },
];

interface AdminAccountFiltersProps {
  totalCount: number;
}

export function AdminAccountFilters({ totalCount }: AdminAccountFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const sort = searchParams.get("sort") ?? "newest";
  const status = searchParams.get("status") ?? "";
  const search = searchParams.get("q") ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams],
  );

  const hasActiveFilters = sort !== "newest" || status !== "" || search !== "";

  const clearAll = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  return (
    <div
      className={`transition-opacity duration-200 ${isPending ? "opacity-60 pointer-events-none" : "opacity-100"}`}
    >
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề..."
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                update("q", (e.target as HTMLInputElement).value);
            }}
            onBlur={(e) => update("q", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 transition-colors focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 hover:border-slate-300"
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => update("status", e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 hover:border-slate-300 cursor-pointer"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 shrink-0 text-slate-400" />
          <select
            value={sort}
            onChange={(e) => update("sort", e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 hover:border-slate-300 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100"
          >
            Xoá bộ lọc
          </button>
        )}

        <span className="ml-auto text-sm text-slate-400">
          {isPending ? "Đang lọc..." : `${totalCount} tài khoản`}
        </span>
      </div>
    </div>
  );
}
