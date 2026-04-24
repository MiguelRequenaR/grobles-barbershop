import '../global.css';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Comfortaa_400Regular, Comfortaa_700Bold } from '@expo-google-fonts/comfortaa';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getCurrentShopByOwner } from '@/services/shopService';

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {

  const { user, isInitialized, setSession, setUser, setInitialized, setShopId } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    Comfortaa_400Regular,
    Comfortaa_700Bold,
  })

  useEffect(() => {
    const {data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setInitialized(true);
    });

    supabase.auth.getSession().then(({ data: {session}}) => {
      setSession(session);
      setUser(session?.user ?? null);
      setInitialized(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if(fontError) {
      console.error('Error al cargar las fuentes', fontError);
    }

    if(!isInitialized || !fontsLoaded) return;

    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === ('(auth)');

    if(!user && !inAuthGroup) {
      router.replace('/(auth)');
      return;
    } 
    
    if (user && inAuthGroup) {
      router.replace('/dashboard');
      return;
    }

  }, [user, isInitialized, segments, router, fontsLoaded, fontError]);

  useEffect(() => {
    let cancelled = false;

    const loadShop = async () => {
      if (!user?.id) {
        setShopId(null);
        return;
      }
      try {
        const shop = await getCurrentShopByOwner(user.id);
        if (!cancelled) {
          setShopId(shop?.id ?? null);
        }
      } catch (error) {
        if (!cancelled) {
          setShopId(null);
        }
        console.error("Error cargando la barbería actual:", error);
      }
    };

    loadShop();

    return () => {
      cancelled = true;
    };
  }, [user?.id, setShopId])

  if(!isInitialized || !fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <Slot />
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
