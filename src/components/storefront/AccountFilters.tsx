"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "gp_desc", label: "GP cao nhất" },
  { value: "strength_desc", label: "Lực chiến cao nhất" },
];

export function AccountFilters({ totalCount }: { totalCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const sort = searchParams.get("sort") ?? "newest";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

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

  const hasActiveFilters =
    sort !== "newest" || minPrice !== "" || maxPrice !== "";

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

        {/* Price range */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-400" />
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="Giá từ"
              value={minPrice}
              min={0}
              step={10000}
              onChange={(e) => update("minPrice", e.target.value)}
              className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 hover:border-slate-300"
            />
            <span className="text-slate-400">—</span>
            <input
              type="number"
              placeholder="đến"
              value={maxPrice}
              min={0}
              step={10000}
              onChange={(e) => update("maxPrice", e.target.value)}
              className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 hover:border-slate-300"
            />
          </div>
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

        {/* Result count */}
        <span className="ml-auto text-sm text-slate-400">
          {isPending ? "Đang lọc..." : `${totalCount} tài khoản`}
        </span>
      </div>
    </div>
  );
}
