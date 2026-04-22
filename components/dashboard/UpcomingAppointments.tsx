import { View } from "react-native"
import { Text } from "@/components/ui/Text"
import type { UpcomingAppointment } from "@/services/dashboardService";

interface UpcomingAppointmentsProps {
  appointments: UpcomingAppointment[];
  isLoading?: boolean;
}

export default function UpcomingAppointments({
  appointments,
  isLoading = false,
}: UpcomingAppointmentsProps) {
  if (isLoading) {
    return (
      <View>
        <Text className="text-white">Cargando próximos turnos...</Text>
      </View>
    );
  }

  if (!appointments.length) {
    return (
      <View>
        <Text className="text-white">No hay turnos próximos.</Text>
      </View>
    );
  }

  return (
    <View className="gap-2">
      <Text className="text-white text-2xl">Próximos Turnos</Text>
      {appointments.map((appointment) => (
        <View key={appointment.id} className="bg-primary/20 rounded-2xl p-4">
          <Text bold className="text-white text-lg">
            {appointment.customer_name}
          </Text>
          <Text className="text-tertiary">{appointment.service_name}</Text>
        </View>
      ))}
    </View>
  );
}