import { Text } from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

interface DashboardSummaryCardsProps {
  ingresos: number;
  turnos: number;
  isLoading?: boolean;
  onNewWalkIn?: () => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(amount);

export default function DashboardSummaryCards({
  ingresos,
  turnos,
  isLoading = false,
  onNewWalkIn,
}: DashboardSummaryCardsProps) {
  return (
    <View className="flex-col gap-4">
      <View className="flex-row gap-4">
        <View className="flex-1 bg-[#292a2a] border border-primary rounded-3xl p-4">
          <Text bold className="text-2xl font-bold text-white">
            {isLoading ? "..." : formatCurrency(ingresos)}
          </Text>
          <View className="flex-row items-center gap-2">
            <Ionicons name="cash-outline" size={24} color="white" />
            <Text className="text-sm text-white">Ingresos (Hoy)</Text>
          </View>
        </View>

        <View className="flex-1 bg-[#292a2a] border border-primary rounded-3xl p-4">
          <Text bold className="text-2xl font-bold text-white">
            {isLoading ? "..." : turnos}
          </Text>
          <View className="flex-row items-center gap-2">
            <Ionicons name="calendar-outline" size={24} color="white" />
            <Text className="text-sm text-white">Turnos (Hoy)</Text>
          </View>
        </View>
      </View>

      <Button
        title="Nuevo Walk-in"
        onPress={onNewWalkIn ?? (() => {})}
        className="bg-[#292a2a] border border-primary rounded-full py-4"
        textClassName="text-secondary"
        leftIcon={
          <Ionicons
            name="add-circle"
            size={24}
            color="white"
          />
        }
      />
    </View>
  );
}