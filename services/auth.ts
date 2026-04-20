import { supabase } from "@/lib/supabase";

export type AuthServiceResult = 
  | { ok: true; message?: string}
  | { ok: false; message: string};

export type RegisterServiceResult = 
  | { ok: true; needsEmailVerification: false; message?: string }
  | { ok: true; needsEmailVerification: true; message?: string }
  | { ok: false; message: string };

export async function loginWithEmail(
  email: string,
  password: string,
) : Promise<AuthServiceResult> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Ocurrió un error al iniciar sesión. Intenta nuevamente." };
  }
}

export async function registerWithEmail(params: {
  email: string;
  password: string;
  shopName: string;
}) : Promise<RegisterServiceResult> {
  const { email, password, shopName } = params;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          shop_name: shopName,
        }
      }
    });

    if (error) {
      return {
        ok: false,
        message: error.message,
      }
    }

    if (data.session) {
      return {
        ok: true,
        needsEmailVerification: false,
      }
    }

    return {
      ok: true,
      needsEmailVerification: true,
      message: "Hemos enviado un enlace de confirmación a tu email.",
    };
  } catch {
    return {
      ok: false,
      message: "Ocurrió un error al registrar tu cuenta. Intenta nuevamente.",
    }
  }
}
