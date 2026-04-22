import { Text } from "@/components/ui/Text";
import { View } from "react-native";

import { useMemo } from "react";

export default function DashboardGreeting() {
  const { formattedDate, greetingName } = useMemo(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    const formattedDate = today.toLocaleDateString("es-ES", options);
    const greetingName = "Miguel";
    return { formattedDate, greetingName };
  }, []);

  return (
    <View className="mb-6">
      <Text className="text-3xl mb-1">
        Hola, <Text bold>{greetingName}</Text>
      </Text>
      <Text className="text-lg text-gray-700">
        Resumen de hoy, {formattedDate}
      </Text>
    </View>
  );
}
