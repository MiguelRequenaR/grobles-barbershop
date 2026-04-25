import { supabase } from "@/lib/supabase";

export type ShopCustomerOption = {
  id: string;
  full_name: string;
  phone: string | null;
};

export async function getCustomersByShopId(
  shopId: string,
): Promise<ShopCustomerOption[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("id, full_name, phone")
    .eq("shop_id", shopId)
    .order("full_name", { ascending: true });

  if (error) {
    throw new Error(error.message || "No se pudieron cargar los clientes.");
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    full_name: row.full_name,
    phone: row.phone,
  }));
}
