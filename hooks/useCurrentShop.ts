import { useQuery } from "@tanstack/react-query";
import { getCurrentShopByOwner } from "@/services/shopService";
import { useAuthStore } from "@/store/useAuthStore";

export function useCurrentShop() {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery ({
    queryKey: ["shop", "current", userId],
    queryFn: () => getCurrentShopByOwner(userId!),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });
}