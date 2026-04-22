import { Slot } from "expo-router"
import { View } from "react-native"
import AppHeader from "@/components/navigation/AppHeader"

export default function AppGroupLayout() {
  return (
    <View className="flex-1 bg-secondary">
      <AppHeader />
      <View className="flex-1 overflow-hidden">
        <Slot />
      </View>
    </View>
  )
}
