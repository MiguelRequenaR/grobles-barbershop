import { useQuery } from "@tanstack/react-query";
import { getCustomersByShopId } from "@/services/customersService";

export function useShopCustomers(shopId: string | null) {
  return useQuery({
    queryKey: ["shop", "customers", shopId],
    queryFn: () => getCustomersByShopId(shopId!),
    enabled: Boolean(shopId),
    staleTime: 1000 * 60 * 2,
  });
}
