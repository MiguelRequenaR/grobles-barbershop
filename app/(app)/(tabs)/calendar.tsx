import { ScrollView } from "react-native";
import CalendarAppointmetsList from "@/components/calendar/CalendarAppointmetsList";
import CalendarGreeting from "@/components/calendar/CalendarGreeting";

export default function CalendarScreen() {
  return (
    <ScrollView className="flex-1" contentContainerClassName="p-4 pt-32 pb-24">
      <CalendarGreeting />
      <CalendarAppointmetsList />
    </ScrollView>
  );
}
