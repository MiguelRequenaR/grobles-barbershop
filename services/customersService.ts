import { supabase } from "@/lib/supabase";

export type ShopCustomerOption = {
  id: string;
  full_name: string;
  phone: string | null;
  is_vip?: boolean;
};

export type CustomerRecentVisit = {
  id: string;
  appointment_date: string;
  status: string | null;
  service_name: string;
  service_price: number;
};

export type CustomerProfile = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  birthday: string | null;
  is_vip: boolean;
  total_appointments: number;
  loyalty_points: number;
  created_at: string | null;
  last_visit: string | null;
  no_shows: number;
  lifetime_value: number;
  recent_history: CustomerRecentVisit[];
};

export async function getCustomersByShopId(
  shopId: string,
): Promise<ShopCustomerOption[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("id, full_name, phone, is_vip")
    .eq("shop_id", shopId)
    .order("full_name", { ascending: true });

  if (error) {
    throw new Error(error.message || "No se pudieron cargar los clientes.");
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    full_name: row.full_name,
    phone: row.phone,
    is_vip: Boolean(row.is_vip),
  }));
}

export async function getCustomerProfileById(
  shopId: string,
  customerId: string,
): Promise<CustomerProfile> {
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select(
      "id, full_name, phone, email, birthday, is_vip, total_appointments, loyalty_points, created_at",
    )
    .eq("shop_id", shopId)
    .eq("id", customerId)
    .maybeSingle();

  if (customerError) {
    throw new Error(customerError.message || "No se pudo cargar el cliente.");
  }

  if (!customer) {
    throw new Error("Cliente no encontrado.");
  }

  const { data: appointmentsData, error: appointmentsError } = await supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_date,
      status,
      services(
        name,
        price
      )
    `,
    )
    .eq("shop_id", shopId)
    .eq("customer_id", customerId)
    .order("appointment_date", { ascending: false });

  if (appointmentsError) {
    throw new Error(appointmentsError.message || "No se pudo cargar historial.");
  }

  const pickService = (
    value: { name?: string; price?: number } | { name?: string; price?: number }[] | null,
  ) => {
    if (!value) return null;
    return Array.isArray(value) ? value[0] : value;
  };

  const normalized = (appointmentsData ?? []).map((row: any) => {
    const service = pickService(row.services);
    return {
      id: row.id,
      appointment_date: row.appointment_date,
      status: row.status,
      service_name: service?.name ?? "Sin servicio",
      service_price: Number(service?.price ?? 0),
    };
  });

  const completedCount = normalized.filter((item) => item.status === "completed").length;
  const noShows = normalized.filter((item) => item.status === "cancelled").length;
  const lifetimeValue = normalized
    .filter((item) => item.status === "completed")
    .reduce((acc, item) => acc + item.service_price, 0);

  return {
    id: customer.id,
    full_name: customer.full_name,
    phone: customer.phone,
    email: customer.email,
    birthday: customer.birthday,
    is_vip: Boolean(customer.is_vip),
    total_appointments: completedCount,
    loyalty_points: customer.loyalty_points ?? 0,
    created_at: customer.created_at,
    last_visit: normalized[0]?.appointment_date ?? null,
    no_shows: noShows,
    lifetime_value: lifetimeValue,
    recent_history: normalized.slice(0, 6),
  };
}
