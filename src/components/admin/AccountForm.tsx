"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { ArrowLeft, Loader2, Plus, X, UploadCloud, Star } from "lucide-react";
import Link from "next/link";
import type { Account, Email, AccountStatus } from "@/types/database";

interface AccountFormProps {
  account?: Account | null;
}

export function AccountForm({ account }: AccountFormProps) {
  const isEditing = !!account;
  const [title, setTitle] = useState(account?.title ?? "");
  const [purchasePrice, setPurchasePrice] = useState(
    account?.purchase_price?.toString() ?? "",
  );
  const [sellingPrice, setSellingPrice] = useState(
    account?.selling_price?.toString() ?? "",
  );
  const [status, setStatus] = useState<AccountStatus>(
    account?.status ?? "Available",
  );
  const [totalGp, setTotalGp] = useState(account?.total_gp?.toString() ?? "");
  const [totalCoinsAndroid, setTotalCoinsAndroid] = useState(
    account?.total_coins_android?.toString() ?? "",
  );
  const [totalCoinsIos, setTotalCoinsIos] = useState(
    account?.total_coins_ios?.toString() ?? "",
  );
  const [teamStrength, setTeamStrength] = useState(
    account?.team_strength?.toString() ?? "",
  );
  const [emailId, setEmailId] = useState(account?.email_id ?? "");
  const [images, setImages] = useState<string[]>(account?.images ?? []);
  const [primaryImage, setPrimaryImage] = useState<string | null>(
    account?.primary_image_url ?? (account?.images?.[0] || null),
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [availableEmails, setAvailableEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const fetchEmails = async () => {
      // Fetch all emails
      const { data: allEmails } = await supabase
        .from("emails")
        .select("*")
        .order("email_address");
      if (!allEmails) return;

      // Fetch emails already linked to an account (excluding current account if editing)
      let query = supabase
        .from("accounts")
        .select("email_id")
        .not("email_id", "is", null);
      if (isEditing) {
        query = query.neq("id", account.id);
      }
      const { data: linkedAccounts } = await query;

      const linkedEmailIds = new Set(
        (linkedAccounts ?? []).map((a) => a.email_id),
      );
      const available = allEmails.filter((e) => !linkedEmailIds.has(e.id));

      // If editing and the account has an email, include it in the list
      if (isEditing && account.email_id) {
        const currentEmail = allEmails.find((e) => e.id === account.email_id);
        if (currentEmail && !available.find((e) => e.id === currentEmail.id)) {
          available.unshift(currentEmail);
        }
      }

      setAvailableEmails(available);
    };
    fetchEmails();
  }, [supabase, isEditing, account]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeExistingImage = (index: number) => {
    const imgToRemove = images[index];
    if (primaryImage === imgToRemove) setPrimaryImage(null);
    setImages(images.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    const previewToRemove = previews[index];
    if (primaryImage === previewToRemove) setPrimaryImage(null);
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/"),
      );
      setSelectedFiles((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Upload new files to Supabase Storage
      const uploadedUrls: string[] = [];
      let finalPrimaryUrl = primaryImage;

      if (selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const fileExt = file.name.split(".").pop();
          const uniqueId = Math.random().toString(36).substring(2, 15);
          const fileName = `${uniqueId}-${Date.now()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("account-images")
            .upload(`images/${fileName}`, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage
            .from("account-images")
            .getPublicUrl(`images/${fileName}`);

          uploadedUrls.push(publicUrl);

          if (primaryImage === previews[i]) {
            finalPrimaryUrl = publicUrl;
          }
        }
      }

      // 2. Combine existing images and newly uploaded URLs
      const finalImages = [...images, ...uploadedUrls];

      if (
        !finalImages.includes(finalPrimaryUrl as string) &&
        finalImages.length > 0
      ) {
        finalPrimaryUrl = finalImages[0];
      } else if (finalImages.length === 0) {
        finalPrimaryUrl = null;
      }

      const payload = {
        title,
        purchase_price: parseFloat(purchasePrice) || 0,
        selling_price: parseFloat(sellingPrice) || 0,
        status,
        total_gp: parseInt(totalGp) || 0,
        total_coins_android: parseInt(totalCoinsAndroid) || 0,
        total_coins_ios: parseInt(totalCoinsIos) || 0,
        team_strength: parseInt(teamStrength) || 0,
        email_id: emailId || null,
        images: finalImages,
        primary_image_url: finalPrimaryUrl,
      };

      const { error: err } = isEditing
        ? await supabase.from("accounts").update(payload).eq("id", account.id)
        : await supabase.from("accounts").insert(payload);

      if (err) throw err;

      router.push("/admin/dashboard/accounts");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/dashboard/accounts"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại Danh sách Tài Khoản
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">
          {isEditing ? "Chỉnh Sửa Tài Khoản" : "Thêm Tài Khoản Mới"}
        </h1>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Tiêu Đề
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="ví dụ: Tài khoản Android Cực VIP - Lực Chiến 5000+"
            />
          </div>

          {/* Prices */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Giá Nhập (VNĐ)
              </label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                required
                min="0"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Giá Bán (VNĐ)
              </label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                required
                min="0"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Trạng Thái
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AccountStatus)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Available">Sẵn Sàng</option>
              <option value="Pending">Đang Chờ</option>
              <option value="Sold">Đã Bán</option>
            </select>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Tổng GP
              </label>
              <input
                type="number"
                value={totalGp}
                onChange={(e) => setTotalGp(e.target.value)}
                min="0"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Coins (Android)
              </label>
              <input
                type="number"
                value={totalCoinsAndroid}
                onChange={(e) => setTotalCoinsAndroid(e.target.value)}
                min="0"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Coins (iOS)
              </label>
              <input
                type="number"
                value={totalCoinsIos}
                onChange={(e) => setTotalCoinsIos(e.target.value)}
                min="0"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Lực Chiến Đội Hình
              </label>
              <input
                type="number"
                value={teamStrength}
                onChange={(e) => setTeamStrength(e.target.value)}
                min="0"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Linked Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email Liên Kết
              <span className="ml-1 text-xs font-normal text-slate-400">
                (chỉ hiển thị email chưa liên kết)
              </span>
            </label>
            <select
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Không có email liên kết</option>
              {availableEmails.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.email_address}
                </option>
              ))}
            </select>
          </div>

          {/* Images */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Hình Ảnh
            </label>

            {/* Drag & Drop Area */}
            <div
              onDragOver={onDragOver}
              onDrop={onDrop}
              className="mt-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-6 py-8 transition-colors hover:border-indigo-500 hover:bg-slate-50 relative"
            >
              <UploadCloud
                className="mb-3 h-10 w-10 text-slate-400"
                aria-hidden="true"
              />
              <div className="flex text-sm text-slate-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Tải ảnh lên</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">hoặc kéo thả vào đây</p>
              </div>
              <p className="text-xs leading-5 text-slate-500 mt-1">
                PNG, JPG, GIF tối đa 5MB
              </p>
            </div>

            {/* Existing & New Images Preview */}
            {(images.length > 0 || previews.length > 0) && (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {/* Existing Images */}
                {images.map((img, i) => (
                  <div
                    key={`existing-${i}`}
                    className={`relative aspect-video rounded-xl border-2 bg-slate-50 shadow-sm overflow-hidden ${primaryImage === img
                      ? "border-indigo-500"
                      : "border-slate-200"
                      }`}
                  >
                    {primaryImage === img && (
                      <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md bg-indigo-600/90 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white shadow-sm backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-current" /> Trình diện
                      </div>
                    )}
                    <img
                      src={img}
                      alt={`Existing account image ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {/* Action buttons - always visible for touch support */}
                    <div className="absolute bottom-2 right-2 z-10 flex gap-1.5">
                      {primaryImage !== img && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(img)}
                          className="rounded-full bg-white/90 p-1.5 text-indigo-600 shadow-md backdrop-blur-sm hover:bg-white"
                          title="Đặt làm ảnh đại diện"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeExistingImage(i)}
                        className="rounded-full bg-red-500/90 p-1.5 text-white shadow-md backdrop-blur-sm hover:bg-red-600"
                        title="Xóa ảnh"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* New Image Previews */}
                {previews.map((preview, i) => (
                  <div
                    key={`new-${i}`}
                    className={`relative aspect-video rounded-xl border-2 bg-slate-50 shadow-sm overflow-hidden ${primaryImage === preview
                      ? "border-indigo-500"
                      : "border-slate-200"
                      }`}
                  >
                    {primaryImage === preview ? (
                      <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md bg-indigo-600/90 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white shadow-sm backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-current" /> Trình diện
                      </div>
                    ) : (
                      <div className="absolute top-2 left-2 z-10 rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white shadow-sm backdrop-blur-sm">
                        MỚI
                      </div>
                    )}
                    <img
                      src={preview}
                      alt={`New upload preview ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {/* Action buttons - always visible for touch support */}
                    <div className="absolute bottom-2 right-2 z-20 flex gap-1.5">
                      {primaryImage !== preview && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(preview)}
                          className="rounded-full bg-white/90 p-1.5 text-indigo-600 shadow-md backdrop-blur-sm hover:bg-white"
                          title="Đặt làm ảnh đại diện"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="rounded-full bg-red-500/90 p-1.5 text-white shadow-md backdrop-blur-sm hover:bg-red-600"
                        title="Xóa ảnh"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 border-t border-slate-100 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading
                ? "Đang lưu..."
                : isEditing
                  ? "Cập Nhật Tài Khoản"
                  : "Tạo Tài Khoản"}
            </button>
            <Link
              href="/admin/dashboard/accounts"
              className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
