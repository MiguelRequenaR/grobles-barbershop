import { getCustomerProfileById } from "@/services/customersService";
import { useQuery } from "@tanstack/react-query";

export function useCustomerProfile(shopId: string | null, customerId: string | null) {
  return useQuery({
    queryKey: ["customer", "profile", shopId, customerId],
    queryFn: () => getCustomerProfileById(shopId!, customerId!),
    enabled: Boolean(shopId && customerId),
    staleTime: 1000 * 60,
  });
}
