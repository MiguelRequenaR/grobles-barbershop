import { supabase } from "@/lib/supabase";

export type ShopServiceOption = {
  id: string;
  name: string;
};

export async function getServicesByShopId(
  shopId: string,
): Promise<ShopServiceOption[]> {
  const { data, error } = await supabase
    .from("services")
    .select("id, name")
    .eq("shop_id", shopId)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message || "No se pudieron cargar los servicios.");
  }

  return (data ?? []).map((row) => ({ id: row.id, name: row.name }));
}
