"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Trash2 } from "lucide-react";

export function DeleteAccountButton({ id }: { id: string }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này không?")) return;
    await supabase.from("accounts").delete().eq("id", id);
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
