import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCalendarAppointments } from "@/services/calendarService";
import { useAuthStore } from "@/store/useAuthStore";

type UseCalendarDayParams = {
  selectedDate: Date,
}

export function useCalendarDay({selectedDate}: UseCalendarDayParams) {
  const shopId = useAuthStore((state) => state.shopId);

  const dateKey = useMemo(() => {
    const d = new Date(selectedDate);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }, [selectedDate])

  return useQuery({
    queryKey: ["calendar", "day", shopId, dateKey],
    queryFn: () => getCalendarAppointments(shopId!, dateKey),
    enabled: Boolean(shopId && dateKey),
    staleTime: 1000 * 60 * 2,
  });
}
