import Image from "next/image";
import { Gamepad2, Coins, Zap, Shield, CheckCircle2 } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/constants";
import type { PublicAccount } from "@/types/database";

export function SoldAccountCard({ account }: { account: PublicAccount }) {
  const thumbnail = account.primary_image_url || account.images?.[0];

  return (
    <div className="group w-full overflow-hidden">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white opacity-80 transition-all duration-300 hover:opacity-100 hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={account.title}
              fill
              sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw"
              className="h-full w-full object-cover grayscale-[30%]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Gamepad2 className="h-16 w-16 text-slate-300" />
            </div>
          )}
          {/* Sold ribbon */}
          <div className="absolute left-0 top-3 flex items-center gap-1.5 rounded-r-full bg-emerald-500 pl-3 pr-4 py-1 shadow-md">
            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-white">
              Đã Bán
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="truncate text-base font-semibold text-slate-700">
            {account.title}
          </h3>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>{formatNumber(account.total_gp)} GP</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <Coins className="h-3.5 w-3.5 text-yellow-400" />
              <span>
                {formatNumber(account.total_coins_android)} 🤖 |{" "}
                {formatNumber(account.total_coins_ios)} 🍎
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <Shield className="h-3.5 w-3.5 text-blue-400" />
              <span>{account.team_strength}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-lg font-bold text-slate-500 line-through decoration-slate-400">
              {formatCurrency(account.selling_price)}
            </span>
            <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              Đã giao dịch
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
