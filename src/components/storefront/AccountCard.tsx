import Link from "next/link";
import Image from "next/image";
import { Gamepad2, Coins, Zap, Shield } from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";
import { formatCurrency, formatNumber } from "@/lib/constants";
import type { PublicAccount } from "@/types/database";

export function AccountCard({ account }: { account: PublicAccount }) {
  const thumbnail = account.primary_image_url || account.images?.[0];

  return (
    <Link href={`/accounts/${account.id}`} className="group w-full overflow-hidden">
      <div className="overflow-hidden w-full h-full flex flex-col rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-16/7 bg-gradient-to-br from-slate-100 to-slate-200">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={account.title}
              width={1600}
              height={700}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Gamepad2 className="h-16 w-16 text-slate-300" />
            </div>
          )}
        </div>
        <div className="p-4 flex-1 min-h-0 flex flex-col">
          <h3 className="truncate text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {account.title}
          </h3>
          <div className="mt-3 grid grid-cols-3 gap-2 flex-1 min-h-0">
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
            <span className="text-xl font-bold text-indigo-600">
              {formatCurrency(account.selling_price)}
            </span>
            <span className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              Xem Chi Tiết
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
