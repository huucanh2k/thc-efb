"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

type EmailFormValues = {
  emailAddress: string;
  password: string;
  recoveryInfo: string;
};

export default function NewEmailPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormValues>({
    defaultValues: { emailAddress: "", password: "", recoveryInfo: "" },
  });

  const onSubmit = async (values: EmailFormValues) => {
    setLoading(true);
    setError("");

    const { error: err } = await supabase.from("emails").insert({
      email_address: values.emailAddress,
      password: values.password,
      recovery_info: values.recoveryInfo || null,
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard/emails");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/dashboard/emails"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại Danh Sách Email
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Thêm Email Mới</h1>
        <p className="mt-1 text-sm text-slate-500">
          Đăng ký một email để liên kết với các tài khoản game.
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Địa chỉ Email
            </label>
            <input
              type="email"
              {...register("emailAddress", {
                required: "Vui lòng nhập email",
              })}
              aria-invalid={!!errors.emailAddress}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="account@example.com"
            />
            {errors.emailAddress && (
              <p className="mt-1 text-xs text-red-600">
                {errors.emailAddress.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Mật khẩu
            </label>
            <input
              type="text"
              {...register("password", {
                required: "Vui lòng nhập mật khẩu",
              })}
              aria-invalid={!!errors.password}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="Mật khẩu của email"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Thông tin khôi phục
            </label>
            <textarea
              {...register("recoveryInfo")}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="Số điện thoại khôi phục, câu hỏi bảo mật, v.v."
              rows={3}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Đang lưu..." : "Lưu Email"}
            </button>
            <Link
              href="/admin/dashboard/emails"
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
