import CalendarAppointmetsList from "@/components/calendar/CalendarAppointmetsList";
import CalendarGreeting from "@/components/calendar/CalendarGreeting";
import { useCalendarDay } from "@/hooks/useCalendarDay";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

const formatShortName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "Sin nombre";
  if (parts.length === 1) return parts[0];

  return `${parts[0]} ${parts[1][0]?.toUpperCase()}.`;
};

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data, isLoading } = useCalendarDay({ selectedDate });

  const appointments = useMemo(() => {
    return (data ?? []).map((appointment) => {
      const startsAtDate = new Date(appointment.startsAt);
      const time = startsAtDate.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const initials = appointment.clientName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((chunk) => chunk[0]?.toUpperCase() ?? "")
        .join("");

      const statusMap = {
        completed: "Completado",
        confirmed: "Confirmado",
        pending: "Pendiente",
        cancelled: "Cancelado",
      } as const;

      return {
        id: appointment.id,
        time,
        clientName: formatShortName(appointment.clientName),
        serviceName: appointment.serviceName,
        serviceDuration: `${appointment.durationMin}m`,
        amount: appointment.price,
        status: statusMap[appointment.status],
        initials: initials || "•",
      };
    });
  }, [data]);

  return (
    <View className="flex-1 p-4 pt-32">
      <CalendarGreeting
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
      />
      <ScrollView
        className="mt-4 flex-1"
        contentContainerClassName="pb-24"
        showsVerticalScrollIndicator={false}
      >
        <CalendarAppointmetsList
          appointments={appointments}
          isLoading={isLoading}
        />
      </ScrollView>
    </View>
  );
}
