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
  MessageCircle,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { PublicAccount } from "@/types/database";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  // Try public first, fallback to sold
  const { data: pub } = await supabase
    .from("public_accounts")
    .select("title, selling_price, primary_image_url, status")
    .eq("id", id)
    .single();

  const { data: sold } = !pub
    ? await supabase
        .from("accounts")
        .select("title, selling_price, primary_image_url, status")
        .eq("id", id)
        .single()
    : { data: null };

  const account = pub ?? sold;
  if (!account) return {};

  const isSold = account.status === "Sold";
  const title = isSold ? `[Đã Bán] ${account.title}` : account.title;
  const description = isSold
    ? `Tài khoản ${account.title} đã được bán. Xem các tài khoản khác đang sẵn sàng tại THC eFootball Shop.`
    : `Mua ngay tài khoản ${account.title} với giá ${formatCurrency(account.selling_price)}. Giao dịch nhanh, uy tín tại THC eFootball Shop.`;
  const image = account.primary_image_url ?? undefined;

  return {
    title,
    description,
    robots: isSold
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `/accounts/${id}`,
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: account.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  // Try public_accounts view first (Available/Pending)
  const { data: publicData } = await supabase
    .from("public_accounts")
    .select("*")
    .eq("id", id)
    .single();

  // Fallback: check if it's a sold account
  if (!publicData) {
    const { data: soldData } = await supabase
      .from("accounts")
      .select(
        "id, title, selling_price, images, primary_image_url, status, total_gp, total_coins_android, total_coins_ios, team_strength, created_at",
      )
      .eq("id", id)
      .eq("status", "Sold")
      .single();

    if (!soldData) notFound();

    const account = soldData as PublicAccount;
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
          <div className="mx-auto w-full max-w-5xl px-0 py-4 sm:px-6 sm:py-8 lg:px-8">
            <div className="mb-4 px-4 sm:mb-6 sm:px-0">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
              >
                <ArrowLeft className="h-4 w-4" /> Quay lại Cửa Hàng
              </Link>
            </div>

            <div className="overflow-hidden shadow-sm sm:rounded-xl">
              <div className="grid gap-8 p-4 lg:grid-cols-2">
                {/* Images — greyed out */}
                <div className="relative">
                  <div className="pointer-events-none opacity-60 grayscale">
                    <ImageGallery
                      images={galleryImages}
                      title={account.title}
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <h1 className="text-2xl font-bold text-slate-700 line-through decoration-slate-400 lg:text-3xl">
                      {account.title}
                    </h1>
                    <StatusBadge status="Sold" />
                  </div>

                  {/* Sold banner */}
                  <div className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-100 px-5 py-4">
                    <CheckCircle2 className="h-8 w-8 shrink-0 text-emerald-500" />
                    <div>
                      <p className="font-semibold text-emerald-800">
                        Tài khoản đã được bán
                      </p>
                      <p className="mt-0.5 text-sm text-emerald-600">
                        Tài khoản này đã có chủ. Khám phá các tài khoản khác
                        đang sẵn sàng ngay bên dưới!
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="rounded-xl bg-amber-50 p-4 text-center opacity-60">
                      <Zap className="mx-auto mb-1 h-5 w-5 text-amber-500" />
                      <p className="text-lg font-bold text-slate-900">
                        {formatNumber(account.total_gp)}
                      </p>
                      <p className="text-xs text-slate-500">Tổng GP</p>
                    </div>
                    <div className="rounded-xl bg-yellow-50 p-4 text-center opacity-60">
                      <Coins className="mx-auto mb-1 h-5 w-5 text-yellow-500" />
                      <p className="text-sm font-bold text-slate-900">
                        {formatNumber(account.total_coins_android)} 🤖 |{" "}
                        {formatNumber(account.total_coins_ios)} 🍎
                      </p>
                      <p className="text-xs text-slate-500">Coins</p>
                    </div>
                    <div className="rounded-xl bg-blue-50 p-4 text-center opacity-60">
                      <Shield className="mx-auto mb-1 h-5 w-5 text-blue-500" />
                      <p className="text-lg font-bold text-slate-900">
                        {account.team_strength}
                      </p>
                      <p className="text-xs text-slate-500">Lực Chiến</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-8">
                    <div className="mb-6">
                      <p className="text-sm text-slate-500">Giá Đã Bán</p>
                      <p className="text-3xl font-extrabold text-slate-400 line-through decoration-slate-300">
                        {formatCurrency(account.selling_price)}
                      </p>
                    </div>

                    <Link
                      href="/"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                    >
                      Xem Tài Khoản Khác
                    </Link>
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

  // Normal available/pending account
  const account = publicData as PublicAccount;
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
