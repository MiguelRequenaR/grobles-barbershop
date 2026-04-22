import { View } from "react-native";
import DashboardGreeting from "@/components/dashboard/DashboardGreeting"
import DashboardSummaryCards from "@/components/dashboard/DashboardSummaryCards"
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments"

export default function Dashboard() {
  return (
    <View className="flex-1 p-4 bg-[#f7f1e6]">
      <DashboardGreeting />
      <DashboardSummaryCards />
      <UpcomingAppointments />
    </View>
  );
}