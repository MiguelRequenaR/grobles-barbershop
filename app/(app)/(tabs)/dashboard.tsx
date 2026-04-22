import { useCallback, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RefreshControl, ScrollView } from "react-native";
import DashboardGreeting from "@/components/dashboard/DashboardGreeting"
import DashboardSummaryCards from "@/components/dashboard/DashboardSummaryCards"
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments"
import { useDashboard } from "@/hooks/useDashboard";
import { NewWalkInSheet } from "@/components/appointments";

export default function Dashboard() {
  const { data, isLoading, isRefetching, refetch } = useDashboard();
  const newWalkInSheetRef = useRef<BottomSheetModal>(null);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleOpenWalkInSheet = useCallback(() => {
    newWalkInSheetRef.current?.present();
  }, []);

  return (
    <>
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 gap-6 pb-24"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor="#d97706"
          />
        }
      >
        <DashboardGreeting />
        <DashboardSummaryCards
          ingresos={data?.ingresos ?? 0}
          turnos={data?.turnos ?? 0}
          isLoading={isLoading}
          onNewWalkIn={handleOpenWalkInSheet}
        />
        <UpcomingAppointments
          appointments={data?.proximosTurnos ?? []}
          isLoading={isLoading}
        />
      </ScrollView>

      <NewWalkInSheet
        ref={newWalkInSheetRef}
        onSubmit={(payload) => {
          console.log("Nuevo walk-in:", payload);
          newWalkInSheetRef.current?.dismiss();
        }}
      />
    </>
  );
}