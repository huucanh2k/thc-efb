"use client";

import { STATUS_COLORS } from "@/lib/constants";

export function StatusBadge({ status }: { status: string }) {
  const statusTranslations: Record<string, string> = {
    Available: "Sẵn Sàng",
    Pending: "Đang Chờ",
    Sold: "Đã Bán",
  };

  const translatedStatus = statusTranslations[status] || status;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-800"}`}
    >
      {translatedStatus}
    </span>
  );
}
