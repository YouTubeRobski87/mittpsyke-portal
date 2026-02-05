import type { Context, Config } from "@netlify/functions";

/**
 * OAuth Callback Handler for Google Login via Supabase
 *
 * This function handles the OAuth callback from Supabase authentication.
 * It receives the authorization code from Google (via Supabase) and
 * redirects the user back to the application.
 */
export default async (req: Request, context: Context) => {
  const url = new URL(req.url);

  // Get the hash fragment parameters (Supabase returns tokens in hash)
  // Since hash is not sent to server, we need to handle this client-side
  // This function primarily handles the redirect and any server-side processing

  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  // Handle error from OAuth provider
  if (error) {
    console.error("OAuth Error:", error, errorDescription);
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/login.html?error=${encodeURIComponent(errorDescription || error)}`,
      },
    });
  }

  // If we have an authorization code, redirect to the app
  // The app will exchange the code for tokens using Supabase client
  if (code) {
    // Redirect to the main app with the code
    // The frontend Supabase client will complete the token exchange
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/?code=${code}`,
      },
    });
  }

  // Default redirect for hash-based callbacks (handled client-side)
  // Supabase typically uses hash-based redirects for implicit flow
  return new Response(
    `<!DOCTYPE html>
    <html>
    <head>
      <title>Authenticating...</title>
      <script>
        // Handle hash-based OAuth callback (Supabase implicit flow)
        const hash = window.location.hash;
        if (hash) {
          // Redirect to main app with hash parameters
          window.location.href = '/' + hash;
        } else {
          // No auth data, redirect to login
          window.location.href = '/login.html';
        }
      </script>
    </head>
    <body>
      <p>Authenticating... Please wait.</p>
    </body>
    </html>`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
};

export const config: Config = {
  path: "/auth/callback",
};
