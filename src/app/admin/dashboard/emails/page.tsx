import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Plus, Mail, Pencil, Link2, Link2Off } from "lucide-react";
import { DeleteEmailButton } from "./DeleteButton";
import type { Email } from "@/types/database";

interface EmailWithAccount extends Email {
  accounts: { id: string; title: string } | null;
}

export default async function EmailsPage() {
  const supabase = await createSupabaseServerClient();

  const { data: emails } = await supabase
    .from("emails")
    .select("*, accounts(id, title)")
    .order("created_at", { ascending: false });

  const items = (emails ?? []) as EmailWithAccount[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Email</h1>
          <p className="mt-1 text-sm text-slate-500">
            {items.length} email đã đăng ký
          </p>
        </div>
        <Link
          href="/admin/dashboard/emails/new"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Thêm Email
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 font-medium text-slate-500">
                  Địa chỉ Email
                </th>
                <th className="px-6 py-3 font-medium text-slate-500">
                  Mật khẩu
                </th>
                <th className="px-6 py-3 font-medium text-slate-500">
                  Thông tin khôi phục
                </th>
                <th className="px-6 py-3 font-medium text-slate-500">
                  Trạng Thái Liên Kết
                </th>
                <th className="px-6 py-3 font-medium text-slate-500">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((email) => (
                <tr key={email.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="font-medium text-slate-900">
                        {email.email_address}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-600">
                    {email.password}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {email.recovery_info || "—"}
                  </td>
                  <td className="px-6 py-4">
                    {email.accounts ? (
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <Link2 className="h-3 w-3" />
                          Đã liên kết
                        </span>
                        <Link
                          href={`/admin/dashboard/accounts/${email.accounts.id}/edit`}
                          className="max-w-[160px] truncate text-xs text-slate-400 hover:text-indigo-600 hover:underline"
                          title={email.accounts.title}
                        >
                          {email.accounts.title}
                        </Link>
                      </div>
                    ) : (
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                        <Link2Off className="h-3 w-3" />
                        Chưa liên kết
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/dashboard/emails/${email.id}/edit`}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteEmailButton id={email.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    Chưa có email nào. Hãy thêm email đầu tiên để bắt đầu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
