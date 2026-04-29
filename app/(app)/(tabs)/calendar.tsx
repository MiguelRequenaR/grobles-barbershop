import CalendarAppointmetsList from "@/components/calendar/CalendarAppointmetsList";
import AppointmentActionsSheet, {
  type UIAppointmentStatus,
} from "@/components/calendar/AppointmentActionsSheet";
import CalendarGreeting from "@/components/calendar/CalendarGreeting";
import { useCalendarDay } from "@/hooks/useCalendarDay";
import {
  deleteAppointment,
  type AppointmentStatus,
  updateAppointmentStatus,
} from "@/services/calendarService";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAuthStore } from "@/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { Alert, ScrollView, View } from "react-native";

const formatShortName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "Sin nombre";
  if (parts.length === 1) return parts[0];

  return `${parts[0]} ${parts[1][0]?.toUpperCase()}.`;
};

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const shopId = useAuthStore((state) => state.shopId);
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useCalendarDay({ selectedDate });
  const actionsSheetRef = useRef<BottomSheetModal>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(
    null,
  );
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const selectedAppointment = useMemo(
    () => appointments.find((appointment) => appointment.id === selectedAppointmentId) ?? null,
    [appointments, selectedAppointmentId],
  );

  const statusToApiMap: Record<UIAppointmentStatus, AppointmentStatus> = {
    Pendiente: "pending",
    Confirmado: "confirmed",
    Completado: "completed",
    Cancelado: "cancelled",
  };

  const handleMorePress = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    actionsSheetRef.current?.present();
  };

  const handleChangeStatus = async (nextStatus: UIAppointmentStatus) => {
    if (!selectedAppointment) return;
    try {
      setIsSavingStatus(true);
      await updateAppointmentStatus(selectedAppointment.id, statusToApiMap[nextStatus]);
      await refetch();
      await queryClient.invalidateQueries({
        queryKey: ["dashboard", "stats", shopId],
      });
      actionsSheetRef.current?.dismiss();
    } catch (error) {
      Alert.alert(
        "No se pudo actualizar",
        error instanceof Error ? error.message : "Intenta nuevamente.",
      );
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleDelete = () => {
    if (!selectedAppointment) return;
    Alert.alert("Eliminar turno", "Esta acción no se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            setIsDeleting(true);
            await deleteAppointment(selectedAppointment.id);
            await refetch();
            await queryClient.invalidateQueries({
              queryKey: ["dashboard", "stats", shopId],
            });
            actionsSheetRef.current?.dismiss();
          } catch (error) {
            Alert.alert(
              "No se pudo eliminar",
              error instanceof Error ? error.message : "Intenta nuevamente.",
            );
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

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
          onMorePress={handleMorePress}
        />
      </ScrollView>
      <AppointmentActionsSheet
        ref={actionsSheetRef}
        appointment={selectedAppointment}
        isSaving={isSavingStatus}
        isDeleting={isDeleting}
        onChangeStatus={handleChangeStatus}
        onEdit={() =>
          Alert.alert(
            "Editar turno",
            "La edición del turno se puede conectar aquí con tu flujo actual.",
          )
        }
        onDelete={handleDelete}
      />
    </View>
  );
}
