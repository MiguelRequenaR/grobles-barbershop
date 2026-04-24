import { useQuery } from "@tanstack/react-query";
import { getServicesByShopId } from "@/services/servicesCatalogService";

export function useShopServices(shopId: string | null) {
  return useQuery({
    queryKey: ["shop", "services", shopId],
    queryFn: () => getServicesByShopId(shopId!),
    enabled: Boolean(shopId),
    staleTime: 1000 * 60 * 2,
  });
}
