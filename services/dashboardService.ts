import { supabase } from "@/lib/supabase";

export type UpcomingAppointment = {
  id: string;
  appointment_date: string;
  status: string | null;
  customer_name: string;
  service_name: string;
};

export type DashboardStats = {
  ingresos: number;
  turnos: number;
  proximosTurnos: UpcomingAppointment[];
};

export async function getDashboardStats(shopId: string): Promise<DashboardStats> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  // Obtenemos los ingresos (citas completadas)
  const { data: incomeData, error: incomeError } = await supabase
    .from("appointments")
    .select("services(price)")
    .eq("shop_id", shopId)
    .eq("status", "completed")
    .gte("appointment_date", startOfDay.toISOString());

  if (incomeError) {
    throw new Error(incomeError.message || "Error al obtener ingresos");
  }

  const ingresos =
    incomeData?.reduce((acc, row: any) => acc + Number(row.services?.price ?? 0), 0) ?? 0;

  // Obtenemos el número de turnos del día
  const { count: turnosCount, error: turnosError } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("shop_id", shopId)
    .gte("appointment_date", startOfDay.toISOString())
    .lt("appointment_date", endOfDay.toISOString())

  if (turnosError) {
    throw new Error(turnosError.message || "Error al obtener turnos");
  }

  // Próximos turnos incluye turnos recien creados
  const upcomingWindowStart = new Date();
  upcomingWindowStart.setMinutes(upcomingWindowStart.getMinutes() - 45);

  const { data: rawUpcoming, error: upcomingError } = await supabase
    .from("appointments")
    .select(`
      id,
      appointment_date,
      status,
      customers(full_name),
      services(name)
    `)
    .eq("shop_id", shopId)
    .gte("appointment_date", upcomingWindowStart.toISOString())
    .order("appointment_date", { ascending: true })
    .limit(8);

  if (upcomingError) {
    throw new Error(upcomingError.message || "Error al obtener próximos turnos");
  }

  const pickNested = <T extends { full_name?: string } | { name?: string }>(
    value: T | T[] | null | undefined,
    key: keyof T,
  ): string | undefined => {
    if (!value) return undefined;
    const row = Array.isArray(value) ? value[0] : value;
    return row?.[key] as string | undefined;
  };

  const proximosTurnos: UpcomingAppointment[] = (rawUpcoming ?? [])
    .slice(0, 5)
    .map((row: any) => ({
      id: row.id,
      appointment_date: row.appointment_date,
      status: row.status,
      customer_name:
        pickNested(row.customers, "full_name") ?? "Sin nombre",
      service_name: pickNested(row.services, "name") ?? "Sin servicio",
    }));

  return {
    ingresos,
    turnos: turnosCount ?? 0,
    proximosTurnos,
  };
}