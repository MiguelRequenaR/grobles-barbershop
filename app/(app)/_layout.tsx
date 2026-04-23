import AppHeader from "@/components/navigation/AppHeader"
import { Slot } from "expo-router"
import { View } from "react-native"

export default function AppGroupLayout() {
  return (
    <View className="flex-1 bg-secondary">
      <View className="absolute left-0 right-0 top-0 z-50" pointerEvents="box-none">
        <AppHeader />
      </View>
      <View className="flex-1 overflow-hidden">
        <Slot />
      </View>
    </View>
  )
}
