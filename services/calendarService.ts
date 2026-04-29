import { supabase } from "@/lib/supabase";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type CalendarAppointment = {
  id: string;
  startsAt: string;
  status: AppointmentStatus;
  clientName: string;
  serviceName: string;
  durationMin: number;
  price: number;
};

const normalizeStatus = (
  value: string | null | undefined,
): AppointmentStatus => {
  if (
    value === "pending" ||
    value === "confirmed" ||
    value === "completed" ||
    value === "cancelled"
  ) {
    return value;
  }
  return "pending";
};

export async function getCalendarAppointments(
  shopId: string,
  date: string,
): Promise<CalendarAppointment[]> {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) {
    throw new Error("Fecha invalida en getCalendar");
  }
  const targetDate = new Date(year, month - 1, day);
  if (Number.isNaN(targetDate.getTime())) {
    throw new Error("Fecha invalida en getCalendar");
  }
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_date,
      status,
      customers(
        full_name
      ),
      services(
        name,
        duration_minutes,
        price
      )
    `,
    )
    .eq("shop_id", shopId)
    .gte("appointment_date", startOfDay.toISOString())
    .lt("appointment_date", endOfDay.toISOString())
    .order("appointment_date", { ascending: true });

  if (error) {
    throw new Error(error.message || "Error al obtener citas");
  }
  return (data ?? []).map((appointment: any) => ({
    id: appointment.id,
    startsAt: appointment.appointment_date,
    status: normalizeStatus(appointment.status),
    clientName: appointment.customers?.full_name || "Sin nombre",
    serviceName: appointment.services?.name || "Sin servicio",
    durationMin: appointment.services?.duration_minutes ?? 0,
    price: appointment.services?.price ?? 0,
  }));
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
): Promise<void> {
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", appointmentId);

  if (error) {
    throw new Error(error.message || "No se pudo actualizar el estado del turno.");
  }
}

export async function deleteAppointment(appointmentId: string): Promise<void> {
  const { error } = await supabase.from("appointments").delete().eq("id", appointmentId);

  if (error) {
    throw new Error(error.message || "No se pudo eliminar el turno.");
  }
}
