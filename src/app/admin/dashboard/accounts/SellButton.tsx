"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { ShoppingCart, Loader2, X } from "lucide-react";
import type { AccountStatus } from "@/types/database";

interface SellButtonProps {
  id: string;
  currentSellingPrice: number;
  status: AccountStatus;
}

export function SellAccountButton({
  id,
  currentSellingPrice,
  status,
}: SellButtonProps) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(currentSellingPrice.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  if (status === "Sold") return null;

  const handleOpen = () => {
    setPrice(currentSellingPrice.toString());
    setError("");
    setOpen(true);
  };

  const handleClose = () => {
    if (!loading) setOpen(false);
  };

  const handleConfirm = async () => {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Vui lòng nhập giá bán hợp lệ.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: err } = await supabase
        .from("accounts")
        .update({
          status: "Sold",
          selling_price: parsedPrice,
          email_id: null,
        })
        .eq("id", id);

      if (err) throw err;

      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Sell Button */}
      <button
        onClick={handleOpen}
        title="Bán tài khoản"
        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-green-50 hover:text-green-600"
      >
        <ShoppingCart className="h-4 w-4" />
      </button>

      {/* Modal Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
        >
          {/* Modal Panel */}
          <div
            className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              disabled={loading}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="mb-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                <ShoppingCart className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Xác Nhận Bán Tài Khoản
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Giá dự kiến sẽ được cập nhật thành giá bán thực tế. Email liên
                kết sẽ bị gỡ tự động.
              </p>
            </div>

            {/* Price Input */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Giá Bán Thực Tế (VNĐ)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="1"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:opacity-60"
                autoFocus
              />
              {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Đang xử lý..." : "Xác Nhận Bán"}
              </button>
              <button
                onClick={handleClose}
                disabled={loading}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
