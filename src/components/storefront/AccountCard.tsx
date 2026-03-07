import Link from "next/link";
import Image from "next/image";
import { Gamepad2, Coins, Zap, Shield, ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";
import { formatCurrency, formatNumber } from "@/lib/constants";
import type { PublicAccount } from "@/types/database";

export function AccountCard({ account }: { account: PublicAccount }) {
  const thumbnail = account.primary_image_url || account.images?.[0];

  return (
    <Link href={`/accounts/${account.id}`} className="group">
      <div className="flex h-full w-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60">
        {/* Image + overlay CTA */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl rounded-b-none">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={account.title}
              fill
              sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-90"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Gamepad2 className="h-16 w-16 text-slate-300 transition-transform duration-300 group-hover:scale-110" />
            </div>
          )}

          {/* Gradient overlay + CTA — slides up on hover */}
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full flex-col items-center justify-end bg-gradient-to-t from-indigo-900/80 via-indigo-900/40 to-transparent pb-4 pt-10 transition-transform duration-300 group-hover:translate-y-0">
            <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-lg">
              Xem Chi Tiết <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="truncate text-base font-semibold text-slate-900 transition-colors duration-200 group-hover:text-indigo-600">
            {account.title}
          </h3>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>{formatNumber(account.total_gp)} GP</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Coins className="h-3.5 w-3.5 text-yellow-500" />
              <span>
                {formatNumber(account.total_coins_android)} 🤖 |{" "}
                {formatNumber(account.total_coins_ios)} 🍎
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Shield className="h-3.5 w-3.5 text-blue-500" />
              <span>{account.team_strength}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-xl font-bold text-indigo-600 transition-colors duration-200 group-hover:text-indigo-700">
              {formatCurrency(account.selling_price)}
            </span>
            <StatusBadge status={account.status} />
          </div>
        </div>
      </div>
    </Link>
  );
}
