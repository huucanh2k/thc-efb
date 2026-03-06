import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { AccountCard } from "@/components/storefront/AccountCard";
import { Gamepad2, Search } from "lucide-react";
import type { PublicAccount } from "@/types/database";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();

  const { data: accounts } = await supabase
    .from("public_accounts")
    .select("*")
    .order("created_at", { ascending: false });

  const items = (accounts ?? []) as PublicAccount[];
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
                  Chọn nhanh tài khoản phù hợp với ngân sách và lối chơi của bạn,
                  cập nhật liên tục mỗi ngày.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Account Grid */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                Tài Khoản Đang Bán
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Tìm thấy {items.length} tài khoản đang sẵn sàng giao dịch
              </p>
            </div>
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
                Không có tài khoản nào
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Hãy quay lại kiểm tra danh sách mới cập nhật sau nhé.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
