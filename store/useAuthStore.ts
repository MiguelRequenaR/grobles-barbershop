import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setInitialized: (state: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isInitialized: false,
  
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setInitialized: (status) => set({ isInitialized: status }),
  
  clearAuth: () => set({ user: null, session: null }), 
}));