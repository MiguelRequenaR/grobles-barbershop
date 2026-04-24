import { supabase } from "@/lib/supabase";

export type CurrentShop = {
  id: string;
  name: string;
};

export async function getCurrentShopByOwner(userId: string) {
  const { data, error } = await supabase
    .from("shops")
    .select("id, name")
    .eq("owner_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "No se puedo obtener la barbería")
  }

  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
  }
}