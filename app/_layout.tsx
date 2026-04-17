import '../global.css';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

export default function RootLayout() {

  const { user, isInitialized, setSession, setUser, setInitialized } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

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
    if(!isInitialized) return;

    const inAuthGroup = segments[0]?.startsWith('(auth)');

    if(!user && !inAuthGroup) {
      router.replace('/login');
    } 
    
    if (user && inAuthGroup) {
      router.replace('/dashboard');
    }
  }, [user, isInitialized, segments, router]);

  if(!isInitialized) return null;

  return (
    <Slot />
  );
}
