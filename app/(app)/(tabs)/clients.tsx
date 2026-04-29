import ClientsDirectory from "@/components/clients/ClientsDirectory";
import { useShopCustomers } from "@/hooks/useShopCustomers";
import { useAuthStore } from "@/store/useAuthStore";

export default function ClientsScreen() {
  const shopId = useAuthStore((state) => state.shopId);
  const { data: customers = [], isLoading } = useShopCustomers(shopId);

  return <ClientsDirectory customers={customers} isLoading={isLoading} />;
}
