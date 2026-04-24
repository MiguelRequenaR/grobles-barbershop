import { useMemo } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/Text";
import type { UpcomingAppointment } from "@/services/dashboardService";

interface UpcomingAppointmentsProps {
  appointments: UpcomingAppointment[];
  isLoading?: boolean;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  completed: "Completado",
  cancelled: "Cancelado",
};

const formatStatus = (status: string | null) => {
  if (!status) return "Sin estado";
  const key = status.toLowerCase();
  return STATUS_LABEL[key] ?? status;
};

export default function UpcomingAppointments({
  appointments,
  isLoading = false,
}: UpcomingAppointmentsProps) {
  const rows = useMemo(
    () =>
      appointments.map((a) => {
        const d = new Date(a.appointment_date);
        const time = d.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const dateShort = d.toLocaleDateString("es-ES", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });
        return { ...a, time, dateShort };
      }),
    [appointments],
  );

  if (isLoading) {
    return (
      <View className="gap-3">
        <Text bold className="text-white text-2xl">
          Próximos turnos
        </Text>
        <Text className="text-tertiary">Cargando...</Text>
      </View>
    );
  }

  if (!rows.length) {
    return (
      <View className="gap-3">
        <Text bold className="text-white text-2xl">
          Próximos turnos
        </Text>
        <View className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-4 py-6">
          <Text className="text-tertiary text-center">
            No hay turnos próximos. Los nuevos walk-ins aparecerán aquí.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="gap-3">
      <Text bold className="text-white text-2xl">
        Próximos turnos
      </Text>
      <View className="gap-3">
        {rows.map((appointment) => (
          <View
            key={appointment.id}
            className="flex-row gap-3 overflow-hidden rounded-3xl border border-primary/40 bg-[#292a2a] p-4"
          >
            <View className="w-16 items-center justify-center rounded-2xl bg-primary/15">
              <Ionicons name="time-outline" size={20} color="#ebf494" />
              <Text bold className="mt-1 text-primary text-base">
                {appointment.time}
              </Text>
            </View>
            <View className="min-w-0 flex-1 justify-center gap-1">
              <Text bold className="text-white text-lg" numberOfLines={1}>
                {appointment.customer_name}
              </Text>
              <Text className="text-tertiary text-sm" numberOfLines={2}>
                {appointment.service_name}
              </Text>
              <View className="mt-1 flex-row flex-wrap items-center gap-2">
                <Text className="text-tertiary text-xs capitalize">
                  {appointment.dateShort}
                </Text>
                <View className="rounded-full bg-white/10 px-2 py-0.5">
                  <Text className="text-tertiary text-[10px]">
                    {formatStatus(appointment.status)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
