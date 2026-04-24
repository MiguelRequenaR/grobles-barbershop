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
  const targetDate = new Date(date);
  if (Number.isNaN(targetDate.getTime())){
    throw new Error("Fecha invalida en getCalendar")
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
        full_name,
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
