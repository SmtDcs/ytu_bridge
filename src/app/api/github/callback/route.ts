import { NextResponse, type NextRequest } from "next/server";

// GitHub OAuth callback — kullanıcının GitHub'ından kod alır,
// access token'a çevirir, client'a döner.
// Client localStorage'a kaydeder (auth yok, basit tutuyoruz).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("state") || "/projects";

  if (!code) {
    return NextResponse.redirect(`${origin}/projects?error=no_code`);
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  // Config yoksa hata döndür (demo mode kapalı)
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/projects?error=gh_not_configured`);
  }

  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await res.json();

    if (data.access_token) {
      return NextResponse.redirect(
        `${origin}${redirect}?gh_token=${data.access_token}&scope=${data.scope || ""}`
      );
    }
    return NextResponse.redirect(`${origin}/projects?error=gh_failed`);
  } catch {
    return NextResponse.redirect(`${origin}/projects?error=gh_failed`);
  }
}
