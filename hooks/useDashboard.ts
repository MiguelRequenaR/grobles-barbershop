import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/dashboardService";
import { useAuthStore } from "@/store/useAuthStore";

export function useDashboard() {
  const shopId = useAuthStore((state) => state.shopId);

  return useQuery({
    queryKey: ["dashboard", "stats", shopId],
    queryFn: () => getDashboardStats(shopId!),
    enabled: Boolean(shopId),
    staleTime: 1000 * 60 * 5,
  })
}
