import { supabase } from "@/lib/supabase";
import { TablesInsert } from "@/types/database.types";

export type CreateWalkInParams = {
  shopId: string;
  customerName: string;
  phone: string;
  serviceId: string;
};

const normalizePhone = (phone: string) => phone.replace(/\s+/g, "");

const buildCustomerPayload = (
  params: Pick<CreateWalkInParams, "shopId" | "customerName" | "phone">,
): TablesInsert<"customers"> => ({
  shop_id: params.shopId,
  full_name: params.customerName,
  phone: params.phone || null,
  total_appointments: 0,
  loyalty_points: 0,
  is_vip: false,
});

export async function createWalkInAppointment({
  shopId,
  customerName,
  phone,
  serviceId,
}: CreateWalkInParams) {
  const trimmedName = customerName.trim();
  const normalizedPhone = normalizePhone(phone);

  if (!trimmedName) {
    throw new Error("El nombre del cliente es obligatorio.");
  }

  if (!serviceId) {
    throw new Error("Debes elegir un servicio.");
  }

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("id")
    .eq("shop_id", shopId)
    .eq("id", serviceId)
    .maybeSingle();

  if (serviceError) {
    throw new Error(serviceError.message || "No se pudo validar el servicio.");
  }

  if (!service) {
    throw new Error("El servicio elegido no pertenece a esta barbería.");
  }

  let customerId: string | null = null;

  if (normalizedPhone) {
    const { data: existingCustomer, error: customerSearchError } = await supabase
      .from("customers")
      .select("id")
      .eq("shop_id", shopId)
      .eq("phone", normalizedPhone)
      .maybeSingle();

    if (customerSearchError) {
      throw new Error(
        customerSearchError.message || "No se pudo validar el cliente existente.",
      );
    }

    customerId = existingCustomer?.id ?? null;
  }

  if (!customerId) {
    const payload = buildCustomerPayload({
      shopId,
      customerName: trimmedName,
      phone: normalizedPhone,
    });

    const { data: insertedCustomer, error: customerInsertError } = await supabase
      .from("customers")
      .insert(payload)
      .select("id")
      .single();

    if (customerInsertError) {
      throw new Error(customerInsertError.message || "No se pudo crear el cliente.");
    }

    customerId = insertedCustomer.id;
  }

  const appointmentPayload: TablesInsert<"appointments"> = {
    shop_id: shopId,
    customer_id: customerId,
    service_id: serviceId,
    appointment_date: new Date().toISOString(),
    status: "pending",
  };

  const { error: appointmentInsertError } = await supabase
    .from("appointments")
    .insert(appointmentPayload);

  if (appointmentInsertError) {
    throw new Error(
      appointmentInsertError.message || "No se pudo crear el turno walk-in.",
    );
  }
}
