/* ============================================================
   GATEWAY ACADEMY — FRONTEND CONFIG
   assets/js/config.js

   SECURITY RULES:
   ✅  SUPABASE_ANON_KEY  — safe to expose in frontend (designed to be public).
   ✅  PAYSTACK_PUBLIC_KEY — safe to expose in frontend (designed to be public).
   ❌  NEVER put your Supabase service_role key here.
       It bypasses all Row Level Security and must only ever be
       used in secure server-side environments (e.g. Edge Functions).
   ❌  NEVER put your Paystack secret key here under any circumstances.
   ============================================================ */

const SUPABASE_URL      = 'YOUR_SUPABASE_PROJECT_URL';   // e.g. https://xyzcompany.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';       // starts with eyJ…
const PAYSTACK_PUBLIC_KEY = 'YOUR_PAYSTACK_PUBLIC_KEY';   // starts with pk_live_ or pk_test_
