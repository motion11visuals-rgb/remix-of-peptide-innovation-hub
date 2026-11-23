import { createServerFn } from "@tanstack/react-start";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const subscribeMarketing = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string; organization: string }) => {
    const email = String(input.email ?? "").trim().toLowerCase();
    if (!EMAIL_RE.test(email) || email.length > 254) throw new Error("Invalid email");
    return { email, organization: String(input.organization ?? "").trim().slice(0, 200) };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("marketing_signups")
      .upsert({ email: data.email, organization: data.organization || null }, { onConflict: "email" });
    if (error) throw new Error("Could not save signup");
    return { ok: true };
  });
