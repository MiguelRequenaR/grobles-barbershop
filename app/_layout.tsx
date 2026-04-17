import '../global.css';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Comfortaa_400Regular, Comfortaa_700Bold } from '@expo-google-fonts/comfortaa';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const { user, isInitialized, setSession, setUser, setInitialized } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    Comfortaa_400Regular,
    Comfortaa_700Bold,
  })

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);
      setInitialized(true);
    };
    init();

    const {data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setInitialized]);

  useEffect(() => {
    if(fontError) throw fontError;

    if(!isInitialized || !fontsLoaded) return;

    SplashScreen.hideAsync();

    const inAuthGroup = segments[0]?.startsWith('(auth)');

    if(!user && !inAuthGroup) {
      router.replace('/login');
    } 
    
    if (user && inAuthGroup) {
      router.replace('/dashboard');
    }
  }, [user, isInitialized, segments, router, fontsLoaded, fontError]);

  if(!isInitialized || !fontsLoaded) return null;

  return (
    <Slot />
  );
}
