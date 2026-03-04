import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { StatusBadge } from "@/components/ui/Badge";
import { ImageGallery } from "@/components/ui/ImageGallery";
import {
  formatCurrency,
  formatNumber,
  CONTACT_ZALO_URL,
  CONTACT_MESSENGER_URL,
} from "@/lib/constants";
import {
  ArrowLeft,
  Zap,
  Coins,
  Shield,
  Gamepad2,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PublicAccount } from "@/types/database";

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("public_accounts")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  const account = data as PublicAccount;
  const contactMessage = encodeURIComponent(
    `Hi, I'm interested in account: ${account.title} (ID: ${account.id})`,
  );

  const galleryImages = account.primary_image_url
    ? [
      account.primary_image_url,
      ...(account.images?.filter(
        (img) => img !== account.primary_image_url,
      ) || []),
    ]
    : account.images || [];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-0 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="px-4 sm:px-0 mb-4 sm:mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
            >
              <ArrowLeft className="h-4 w-4" /> Quay lại Cửa Hàng
            </Link>
          </div>

          <div className="overflow-hidden sm:rounded-xl shadow-sm">
            <div className="grid gap-8 lg:grid-cols-2 p-4">
              {/* Images */}
              <div className="relative">
                <ImageGallery images={galleryImages} title={account.title} />
              </div>

              {/* Info */}
              <div className="flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">
                    {account.title}
                  </h1>
                  <StatusBadge status={account.status} />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-amber-50 p-4 text-center">
                    <Zap className="mx-auto mb-1 h-5 w-5 text-amber-500" />
                    <p className="text-lg font-bold text-slate-900">
                      {formatNumber(account.total_gp)}
                    </p>
                    <p className="text-xs text-slate-500">Tổng GP</p>
                  </div>
                  <div className="rounded-xl bg-yellow-50 p-4 text-center">
                    <Coins className="mx-auto mb-1 h-5 w-5 text-yellow-500" />
                    <p className="text-sm font-bold text-slate-900">
                      {formatNumber(account.total_coins_android)} 🤖 |{" "}
                      {formatNumber(account.total_coins_ios)} 🍎
                    </p>
                    <p className="text-xs text-slate-500">Coins</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-4 text-center">
                    <Shield className="mx-auto mb-1 h-5 w-5 text-blue-500" />
                    <p className="text-lg font-bold text-slate-900">
                      {account.team_strength}
                    </p>
                    <p className="text-xs text-slate-500">Lực Chiến</p>
                  </div>
                </div>

                <div className="mt-auto pt-8">
                  <div className="mb-6">
                    <p className="text-sm text-slate-500">Giá Bán</p>
                    <p className="text-3xl font-extrabold text-indigo-600">
                      {formatCurrency(account.selling_price)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href={`${CONTACT_ZALO_URL}?text=${contactMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Liên hệ qua Zalo
                    </a>
                    <a
                      href={`${CONTACT_MESSENGER_URL}?ref=${contactMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-indigo-600 px-6 py-3 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Liên hệ qua Messenger
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
