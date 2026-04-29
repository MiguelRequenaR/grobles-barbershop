import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/Text";

type AppointmentStatus = "Completado" | "Pendiente" | "Confirmado" | "Cancelado";

interface QueueAppointment {
  id: string;
  time: string;
  clientName: string;
  serviceName: string;
  serviceDuration: string;
  amount: number;
  status: AppointmentStatus;
  initials?: string;
  badge?: string;
}

interface CalendarAppointmetsListProps {
  appointments?: QueueAppointment[];
  isLoading?: boolean;
  onMorePress?: (appointmentId: string) => void;
  onReviewPress?: (appointmentId: string) => void;
}


const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(amount);

const STATUS_TEXT_CLASS: Record<AppointmentStatus, string> = {
  Completado: "text-tertiary",
  Pendiente: "text-primary",
  Confirmado: "text-primary",
  Cancelado: "text-tertiary",
};

const CARD_CLASS: Record<AppointmentStatus, string> = {
  Completado: "border-white/10 bg-white/5",
  Pendiente: "border-primary bg-primary/10",
  Confirmado: "border-white/10 bg-white/5",
  Cancelado: "border-white/10 border-dashed bg-white/5",
};

export default function CalendarAppointmetsList({
  appointments = [],
  isLoading = false,
  onMorePress,
  onReviewPress,
}: CalendarAppointmetsListProps) {
  if (isLoading) {
    return (
      <View className="items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 px-4 py-8">
        <Text className="text-tertiary text-base">Cargando turnos...</Text>
      </View>
    );
  }

  if (appointments.length === 0) {
    return (
      <View className="items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 px-4 py-8">
        <Text className="text-tertiary text-base">No hay turnos para este día.</Text>
      </View>
    );
  }

  return (
    <View className="gap-5 pb-10">
      {appointments.map((appointment, index) => {
        const hasVerticalConnector = index !== appointments.length - 1;
        const isInProgress = appointment.status === "Pendiente";
        const isWalkIn = appointment.status === "Cancelado";
        const showAmount = appointment.amount > 0;

        return (
          <View key={appointment.id} className="flex-row gap-3">
            <View className="w-14 items-center">
              <Text className="text-tertiary text-lg">{appointment.time}</Text>
              <View className="mt-2 items-center">
                <View
                  className={`h-2.5 w-2.5 rounded-full ${
                    isInProgress ? "bg-primary" : "bg-white/60"
                  }`}
                />
                {hasVerticalConnector ? (
                  <View className="mt-1 h-36 w-px bg-white/20" />
                ) : null}
              </View>
            </View>

            <View
              className={`flex-1 rounded-3xl border px-4 py-4 ${CARD_CLASS[appointment.status]}`}
            >
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 flex-row items-start gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/20">
                    <Text className="text-tertiary">
                      {appointment.initials ?? "•"}
                    </Text>
                  </View>

                  <View className="flex-1 gap-1">
                    <View className="flex-row items-center gap-2">
                      <Text bold className="text-white text-xl">
                        {appointment.clientName}
                      </Text>
                      {appointment.badge ? (
                        <View className="rounded-full bg-primary/30 px-2.5 py-1">
                          <Text bold className="text-primary text-[10px]">
                            {appointment.badge}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <Text className="text-tertiary text-base">
                      {appointment.serviceName} - {appointment.serviceDuration}
                    </Text>
                  </View>
                </View>

                {!isWalkIn ? (
                  <Pressable
                    onPress={() => onMorePress?.(appointment.id)}
                    className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
                  >
                    <Ionicons name="ellipsis-vertical" size={16} color="#e5e2e1" />
                  </Pressable>
                ) : null}
              </View>

              <View className="mt-4 flex-row items-end justify-between border-t border-white/10 pt-3">
                <View>
                  <Text className={`${STATUS_TEXT_CLASS[appointment.status]} text-sm`}>
                    {appointment.status}
                  </Text>
                  {showAmount ? (
                    <Text bold className="text-primary text-4xl">
                      {formatCurrency(appointment.amount)}
                    </Text>
                  ) : (
                    <Text className="text-tertiary">{appointment.serviceDuration}</Text>
                  )}
                </View>

                {isWalkIn ? (
                  <Pressable
                    onPress={() => onReviewPress?.(appointment.id)}
                    className="rounded-xl border border-white/15 bg-white/10 px-4 py-2"
                  >
                    <Text className="text-white">Review</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
