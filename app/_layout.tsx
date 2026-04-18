import '../global.css';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Comfortaa_400Regular, Comfortaa_700Bold } from '@expo-google-fonts/comfortaa';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const { user, isInitialized, setSession, setUser, setInitialized } = useAuthStore();
  const [isNavigating, setIsNavigating] = useState(false);
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
      setIsNavigating(true);
      router.replace('/login');
      return;
    } 
    
    if (user && inAuthGroup) {
      setIsNavigating(true);
      router.replace('/dashboard');
      return;
    }

    setIsNavigating(false);
  }, [user, isInitialized, segments, router, fontsLoaded, fontError]);

  if(!isInitialized || !fontsLoaded || isNavigating) return null;

  return (
    <Slot />
  );
}
