import { getCalendarAppointments } from "@/services/calendarService";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type UseCalendarDayParams = {
  selectedDate: Date,
}

export function useCalendarDay({selectedDate}: UseCalendarDayParams) {
  const shopId = useAuthStore((state) => state.shopId);

  const dateKey = useMemo(() => {
    const d = new Date(selectedDate);
    d.setHours(0, 0, 0, 0);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [selectedDate])

  return useQuery({
    queryKey: ["calendar", "day", shopId, dateKey],
    queryFn: () => getCalendarAppointments(shopId!, dateKey),
    enabled: Boolean(shopId && dateKey),
    staleTime: 1000 * 60 * 2,
  });
}
