import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/** Keep each URL/key pair together; never verify a browser token against another project. */
export function orderAuthConfig(publicUrl: string | undefined, publicKey: string | undefined, serverUrl: string | undefined, serverKey: string | undefined) {
  if (publicUrl && publicKey) {
    // Lovable preview can use its internal endpoint only for the same configured key.
    return { url: serverUrl && serverKey === publicKey ? serverUrl : publicUrl, key: publicKey };
  }
  if (serverUrl && serverKey) return { url: serverUrl, key: serverKey };
  throw new Error("Order sign-in is not configured. Please check your website's connection settings.");
}

export const requireOrderAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const config = orderAuthConfig(
    import.meta.env['VITE_SUPABASE_URL'],
    import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'],
    process.env['SUPABASE_URL'],
    process.env['SUPABASE_PUBLISHABLE_KEY'],
  );
  const authorization = getRequest().headers.get("authorization");
  const token = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!token) throw new Error("Your sign-in has expired. Please sign out and sign in again.");

  const supabase = createClient<Database>(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      headers: { Authorization: `Bearer ${token}` },
      fetch: (input, init) => {
        const headers = new Headers(input instanceof Request ? input.headers : undefined);
        new Headers(init?.headers).forEach((value, key) => headers.set(key, value));
        if (config.key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${config.key}`) headers.delete("Authorization");
        headers.set("apikey", config.key);
        return fetch(input, { ...init, headers });
      },
    },
  });
  // The auth service verifies both legacy and public-key signatures; no JWKS-only assumption.
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) throw new Error("Your sign-in could not be verified. Please sign out and sign in again.");
  return next({ context: { supabase, userId: data.user.id } });
});