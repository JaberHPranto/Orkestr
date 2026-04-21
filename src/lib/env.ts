import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    // add server-only vars here — API keys, DB urls, secrets
    // DATABASE_URL: z.string().url(),
    // RESEND_API_KEY: z.string().min(1),
  },
  client: {
    // NEXT_PUBLIC_* vars only
    // NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    // DATABASE_URL: process.env.DATABASE_URL,
    // NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
