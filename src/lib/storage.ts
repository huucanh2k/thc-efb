import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

/**
 * Uploads an image to the 'account-images' Supabase storage bucket
 * and returns the public URL.
 */
export async function uploadImageToStorage(file: File): Promise<string> {
  const supabase = createSupabaseBrowserClient();

  // Create a unique file name to avoid overwriting existing images
  const fileExt = file.name.split(".").pop();
  const uniqueId = Math.random().toString(36).substring(2, 15);
  const fileName = `${uniqueId}-${Date.now()}.${fileExt}`;

  // Upload the file to the 'account-images' bucket
  const { data, error } = await supabase.storage
    .from("account-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false, // Default to false to prevent overwrite
    });

  if (error) {
    throw new Error(`Failed to upload ${file.name}: ${error.message}`);
  }

  // Get the public URL for the newly uploaded file
  const {
    data: { publicUrl },
  } = supabase.storage.from("account-images").getPublicUrl(fileName);

  return publicUrl;
}
