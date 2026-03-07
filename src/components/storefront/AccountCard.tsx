import Link from "next/link";
import Image from "next/image";
import {
  Gamepad2,
  Coins,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";
import { formatCurrency, formatNumber } from "@/lib/constants";
import type { PublicAccount } from "@/types/database";

export function AccountCard({ account }: { account: PublicAccount }) {
  const thumbnail = account.primary_image_url || account.images?.[0];
  const isSold = account.status === "Sold";

  const cardContent = (
    <div
      className={`flex h-full w-full flex-col ${!isSold ? "rounded-2xl border border-slate-200 bg-white transition-colors duration-300 hover:border-indigo-200" : ""}`}
    >
      {/* Image + overlay/ribbon */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 aspect-video">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={account.title}
            fill
            sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw"
            className={`h-full w-full object-cover ${
              isSold
                ? "grayscale-[30%]"
                : "transition-transform duration-500 group-hover:scale-110 group-hover:brightness-90"
            }`}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Gamepad2
              className={`h-16 w-16 text-slate-300 ${!isSold ? "transition-transform duration-300 group-hover:scale-110" : ""}`}
            />
          </div>
        )}

        {/* Sold ribbon */}
        {isSold && (
          <div className="absolute left-0 top-3 flex items-center gap-1.5 rounded-r-full bg-emerald-500 py-1 pl-3 pr-4 shadow-md">
            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-white">
              Đã Bán
            </span>
          </div>
        )}

        {/* Gradient overlay + CTA for available accounts */}
        {!isSold && (
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full flex-col items-center justify-end bg-gradient-to-t from-indigo-900/80 via-indigo-900/40 to-transparent pb-4 pt-10 transition-transform duration-300 group-hover:translate-y-0">
            <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-lg">
              Xem Chi Tiết <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3
          className={`truncate text-base font-semibold ${
            isSold
              ? "text-slate-700"
              : "text-slate-900 transition-colors duration-200 group-hover:text-indigo-600"
          }`}
        >
          {account.title}
        </h3>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div
            className={`flex min-w-0 items-center gap-1.5 text-sm ${isSold ? "text-slate-400" : "text-slate-500"}`}
          >
            <Zap
              className={`h-3.5 w-3.5 shrink-0 ${isSold ? "text-amber-400" : "text-amber-500"}`}
            />
            <span className="truncate">
              {formatNumber(account.total_gp)} GP
            </span>
          </div>
          <div
            className={`flex min-w-0 items-center gap-1.5 text-sm ${isSold ? "text-slate-400" : "text-slate-500"}`}
          >
            <Coins
              className={`h-3.5 w-3.5 shrink-0 ${isSold ? "text-yellow-400" : "text-yellow-500"}`}
            />
            <span className="truncate">
              {formatNumber(account.total_coins_android)} 🤖 |{" "}
              {formatNumber(account.total_coins_ios)} 🍎
            </span>
          </div>
          <div
            className={`flex min-w-0 items-center gap-1.5 text-sm ${isSold ? "text-slate-400" : "text-slate-500"}`}
          >
            <Shield
              className={`h-3.5 w-3.5 shrink-0 ${isSold ? "text-blue-400" : "text-blue-500"}`}
            />
            <span className="truncate">{account.team_strength}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span
            className={`truncate pr-2 ${
              isSold
                ? "text-lg font-bold text-slate-500 line-through decoration-slate-400"
                : "text-xl font-bold text-indigo-600 transition-colors duration-200 group-hover:text-indigo-700"
            }`}
          >
            {formatCurrency(account.selling_price)}
          </span>
          <div className="shrink-0">
            {isSold ? (
              <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                Đã giao dịch
              </span>
            ) : (
              <StatusBadge status={account.status} />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isSold) {
    return (
      <div className="group block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white opacity-80 shadow-sm transition-all duration-300 hover:opacity-100 hover:shadow-md">
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={`/accounts/${account.id}`}
      className="group block w-full overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-100/60"
    >
      {cardContent}
    </Link>
  );
}
