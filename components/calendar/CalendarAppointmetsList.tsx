import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/Text";

type AppointmentStatus = "Completed" | "InProgress" | "Confirmed" | "Walk-in";

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
  onMorePress?: (appointmentId: string) => void;
  onReviewPress?: (appointmentId: string) => void;
}

const DEFAULT_APPOINTMENTS: QueueAppointment[] = [
  {
    id: "a1",
    time: "09:00",
    clientName: "Marcus Chen",
    serviceName: "Classic Cut",
    serviceDuration: "45m",
    amount: 35,
    status: "Completed",
    initials: "MC",
  },
  {
    id: "a2",
    time: "10:00",
    clientName: "Elias Thorne",
    serviceName: "Skin Fade + Beard Sculpting",
    serviceDuration: "60m",
    amount: 65,
    status: "InProgress",
    initials: "ET",
    badge: "IN CHAIR",
  },
  {
    id: "a3",
    time: "11:30",
    clientName: "James Lawson",
    serviceName: "Executive Grooming",
    serviceDuration: "45m",
    amount: 50,
    status: "Confirmed",
    initials: "JL",
  },
  {
    id: "a4",
    time: "13:00",
    clientName: "Walk-in / Unassigned",
    serviceName: "Buzz Cut",
    serviceDuration: "30m",
    amount: 0,
    status: "Walk-in",
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);

const STATUS_TEXT_CLASS: Record<AppointmentStatus, string> = {
  Completed: "text-tertiary",
  InProgress: "text-primary",
  Confirmed: "text-primary",
  "Walk-in": "text-tertiary",
};

const CARD_CLASS: Record<AppointmentStatus, string> = {
  Completed: "border-white/10 bg-white/5",
  InProgress: "border-primary bg-primary/10",
  Confirmed: "border-white/10 bg-white/5",
  "Walk-in": "border-white/10 border-dashed bg-white/5",
};

export default function CalendarAppointmetsList({
  appointments = DEFAULT_APPOINTMENTS,
  onMorePress,
  onReviewPress,
}: CalendarAppointmetsListProps) {
  if (appointments.length === 0) {
    return (
      <View className="items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 px-4 py-8">
        <Text className="text-tertiary text-base">No hay turnos para este dia.</Text>
      </View>
    );
  }

  return (
    <View className="gap-5 pb-10">
      {appointments.map((appointment, index) => {
        const hasVerticalConnector = index !== appointments.length - 1;
        const isInProgress = appointment.status === "InProgress";
        const isWalkIn = appointment.status === "Walk-in";
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
                      <Text bold className="text-white text-2xl">
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
