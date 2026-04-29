import { forwardRef, useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/Text";

export type UIAppointmentStatus =
  | "Completado"
  | "Pendiente"
  | "Confirmado"
  | "Cancelado";

export type CalendarAppointmentActionData = {
  id: string;
  clientName: string;
  serviceName: string;
  serviceDuration: string;
  amount: number;
  status: UIAppointmentStatus;
  time: string;
};

interface AppointmentActionsSheetProps {
  appointment: CalendarAppointmentActionData | null;
  isSaving?: boolean;
  isDeleting?: boolean;
  onChangeStatus?: (status: UIAppointmentStatus) => Promise<void> | void;
  onEdit?: () => void;
  onDelete?: () => Promise<void> | void;
}

const STATUS_OPTIONS: {
  value: UIAppointmentStatus;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { value: "Pendiente", icon: "time-outline" },
  { value: "Confirmado", icon: "checkmark-circle-outline" },
  { value: "Completado", icon: "checkmark-done-outline" },
  { value: "Cancelado", icon: "close-circle-outline" },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(amount);

const AppointmentActionsSheet = forwardRef<
  BottomSheetModal,
  AppointmentActionsSheetProps
>(
  (
    {
      appointment,
      isSaving = false,
      isDeleting = false,
      onChangeStatus,
      onEdit,
      onDelete,
    },
    ref,
  ) => {
    const snapPoints = useMemo(() => ["72%"], []);

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        handleIndicatorStyle={{ backgroundColor: "#4b5563", width: 40 }}
        backgroundStyle={{ backgroundColor: "#1f1f1f", borderRadius: 24 }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
      >
        <BottomSheetScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="my-6 gap-1">
            <Text bold className="text-white text-3xl">
              Turno
            </Text>
            <Text className="text-tertiary">Acciones y estado del servicio</Text>
          </View>

          {!appointment ? (
            <View className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <Text className="text-tertiary">
                Selecciona un turno para ver sus acciones.
              </Text>
            </View>
          ) : (
            <>
              <View className="mb-5 rounded-2xl border border-white/10 bg-black/40 p-4 gap-2">
                <Text bold className="text-white text-xl">
                  {appointment.clientName}
                </Text>
                <Text className="text-tertiary">
                  {appointment.serviceName} - {appointment.serviceDuration}
                </Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-tertiary">Hora: {appointment.time}</Text>
                  <Text bold className="text-primary text-lg">
                    {formatCurrency(appointment.amount)}
                  </Text>
                </View>
              </View>

              <Text bold className="text-tertiary text-sm mb-3 uppercase">
                Cambiar estado
              </Text>
              <View className="gap-2 mb-6">
                {STATUS_OPTIONS.map((option) => {
                  const isSelected = appointment.status === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      disabled={isSaving || isDeleting || isSelected}
                      onPress={() => onChangeStatus?.(option.value)}
                      className={`flex-row items-center justify-between rounded-xl border px-4 py-3 ${
                        isSelected
                          ? "border-primary bg-primary/15"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <View className="flex-row items-center gap-2">
                        <Ionicons
                          name={option.icon}
                          size={18}
                          color={isSelected ? "#ff9900" : "#e5e2e1"}
                        />
                        <Text className={isSelected ? "text-primary" : "text-white"}>
                          {option.value}
                        </Text>
                      </View>
                      {isSelected ? (
                        <Ionicons name="checkmark" size={18} color="#ff9900" />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

AppointmentActionsSheet.displayName = "AppointmentActionsSheet";

export default AppointmentActionsSheet;
