import { createSupabaseServerClient } from "@/lib/supabase-server";
import { formatCurrency } from "@/lib/constants";
import { StatCard } from "@/components/ui/StatCard";
import {
  Package,
  CheckCircle,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  BarChart3,
} from "lucide-react";
import type { Account } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const { data: accounts } = await supabase.from("accounts").select("*");
  const items = (accounts ?? []) as Account[];

  const totalAccounts = items.length;
  const availableAccounts = items.filter(
    (a) => a.status === "Available",
  ).length;
  const soldAccounts = items.filter((a) => a.status === "Sold").length;
  const totalRevenue = items
    .filter((a) => a.status === "Sold")
    .reduce((sum, a) => sum + Number(a.selling_price), 0);
  const totalCost = items
    .filter((a) => a.status === "Sold")
    .reduce((sum, a) => sum + Number(a.purchase_price), 0);
  const totalProfit = totalRevenue - totalCost;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Bảng Điều Khiển</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tổng quan về cửa hàng eFootball của bạn
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Tổng Tài Khoản"
          value={totalAccounts.toString()}
          icon={<Package className="h-6 w-6" />}
        />
        <StatCard
          label="Sẵn Sàng"
          value={availableAccounts.toString()}
          icon={<ShoppingCart className="h-6 w-6" />}
        />
        <StatCard
          label="Đã Bán"
          value={soldAccounts.toString()}
          icon={<CheckCircle className="h-6 w-6" />}
        />
        <StatCard
          label="Tổng Doanh Thu"
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard
          label="Tổng Chi Phí"
          value={formatCurrency(totalCost)}
          icon={<BarChart3 className="h-6 w-6" />}
        />
        <StatCard
          label="Tổng Lợi Nhuận"
          value={formatCurrency(totalProfit)}
          icon={<TrendingUp className="h-6 w-6" />}
          className={
            totalProfit >= 0 ? "ring-1 ring-emerald-200" : "ring-1 ring-red-200"
          }
        />
      </div>
    </div>
  );
}
