import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { AccountCard } from "@/components/storefront/AccountCard";
import { SoldAccountCard } from "@/components/storefront/SoldAccountCard";
import { AccountFilters } from "@/components/storefront/AccountFilters";
import { Gamepad2, Search, BadgeCheck } from "lucide-react";
import { Suspense } from "react";
import type { Metadata } from "next";
import type { PublicAccount } from "@/types/database";

export const revalidate = 0; // dynamic because filters change per request

export const metadata: Metadata = {
  title: "Cửa Hàng Tài Khoản eFootball",
  description:
    "Khám phá hàng trăm tài khoản eFootball Mobile chất lượng cao, giá tốt. Android & iOS, cập nhật mỗi ngày.",
  openGraph: {
    title: "Cửa Hàng Tài Khoản eFootball | THC Shop",
    description: "Khám phá tài khoản eFootball Mobile chất lượng cao, giá tốt.",
    url: "/",
  },
};

type SearchParams = {
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const sort = params.sort ?? "newest";
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : null;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : null;

  const supabase = await createSupabaseServerClient();

  // Build the accounts query with sort + price filter
  let query = supabase.from("public_accounts").select("*");

  if (minPrice !== null) query = query.gte("selling_price", minPrice);
  if (maxPrice !== null) query = query.lte("selling_price", maxPrice);

  switch (sort) {
    case "price_asc":
      query = query.order("selling_price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("selling_price", { ascending: false });
      break;
    case "gp_desc":
      query = query.order("total_gp", { ascending: false });
      break;
    case "strength_desc":
      query = query.order("team_strength", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: accounts } = await query;

  // Sold accounts (always newest first, no filter)
  const { data: soldAccountsRaw } = await supabase
    .from("accounts")
    .select(
      "id, title, selling_price, images, primary_image_url, status, total_gp, total_coins_android, total_coins_ios, team_strength, created_at",
    )
    .eq("status", "Sold")
    .order("updated_at", { ascending: false })
    .limit(6);

  const items = (accounts ?? []) as PublicAccount[];
  const soldItems = (soldAccountsRaw ?? []) as PublicAccount[];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-bg relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtOS45NC04LjA2LTE4LTE4LTE4UzAgOC4wNiAwIDE4czguMDYgMTggMTggMTggMTgtOC4wNiAxOC0xOCIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
            <div className="flex flex-col py-8 md:py-20">
              <div className="text-center lg:text-left">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/20 ring-1 ring-indigo-500/40 lg:mx-0">
                  <Gamepad2 className="h-7 w-7 text-indigo-400" />
                </div>
                <h1 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Tài Khoản eFootball{" "}
                  <span className="block text-indigo-400">Uy Tín, Giá Tốt</span>
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-slate-300 sm:text-lg lg:mx-0">
                  Chọn nhanh tài khoản phù hợp với ngân sách và lối chơi của
                  bạn, cập nhật liên tục mỗi ngày.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Account Grid */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="mb-6 sm:mb-8">
            <div className="mb-4 flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                Tài Khoản Đang Bán
              </h2>
            </div>

            {/* Filters — wrapped in Suspense for useSearchParams */}
            <Suspense fallback={null}>
              <AccountFilters totalCount={items.length} />
            </Suspense>
          </div>

          {items.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20">
              <Search className="mb-4 h-12 w-12 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-500">
                Không tìm thấy tài khoản nào
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Thử thay đổi bộ lọc hoặc xoá bộ lọc để xem tất cả.
              </p>
            </div>
          )}
        </section>

        {/* Sold Accounts */}
        {soldItems.length > 0 && (
          <section className="border-t border-slate-200 bg-slate-100/60">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
              <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-emerald-500" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                      Đã Giao Dịch Thành Công
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                    Tài Khoản Đã Bán
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {soldItems.length} giao dịch thành công — minh chứng uy tín
                    của shop
                  </p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {soldItems.map((account) => (
                  <SoldAccountCard key={account.id} account={account} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
