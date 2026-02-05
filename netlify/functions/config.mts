import type { Context, Config } from "@netlify/functions";

/**
 * Configuration endpoint that provides Supabase credentials to the frontend.
 * This allows the frontend to use environment variables securely.
 */
export default async (req: Request, context: Context) => {
  const supabaseUrl = Netlify.env.get("SUPABASE_URL") || "";
  const supabaseAnonKey = Netlify.env.get("SUPABASE_ANON_KEY") || "";

  // Return JavaScript that sets the config on window
  const js = `
    window.SUPABASE_URL = "${supabaseUrl}";
    window.SUPABASE_ANON_KEY = "${supabaseAnonKey}";
  `;

  return new Response(js, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=300", // Cache for 5 minutes
    },
  });
};

export const config: Config = {
  path: "/api/config.js",
};
