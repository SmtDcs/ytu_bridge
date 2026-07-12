import { NextResponse, type NextRequest } from "next/server";

// Kullanıcının GitHub repo'larını çeker.
// Token query param'dan gelir (client localStorage'dan gönderir).
// GitHub API: saatte 5000 istek ücretsiz.
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "no_token" }, { status: 401 });
  }

  // Demo token ise sahte repo döndür
  if (token === "ghp_demo_token") {
    return NextResponse.json({
      login: "demo-user",
      repos: [
        { name: "defi-lending-dapp", description: "Aave benzeri lending protocolü — EVM", language: "Solidity", stars: 12, html_url: "https://github.com/demo/defi-lending", topics: ["defi", "solidity", "ethereum"] },
        { name: "nft-marketplace", description: "NFT marketplace — Next.js + ERC-721", language: "TypeScript", stars: 8, html_url: "https://github.com/demo/nft-marketplace", topics: ["nft", "nextjs", "ethereum"] },
        { name: "solana-sniper-bot", description: "Solana üzerinde sniper bot — Rust + Anchor", language: "Rust", stars: 23, html_url: "https://github.com/demo/solana-sniper", topics: ["solana", "anchor", "rust"] },
      ],
    });
  }

  try {
    // Önce kullanıcı bilgisi
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
    });
    if (!userRes.ok) {
      return NextResponse.json({ error: "gh_unauthorized" }, { status: 401 });
    }
    const user = await userRes.json();

    // Repo'ları çek (sahip olunan + 100 adet, yıldıza göre sıralı)
    const reposRes = await fetch(
      "https://api.github.com/user/repos?per_page=100&sort=updated&type=owner",
      { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } }
    );
    const reposData = await reposRes.json();

    const repos = (Array.isArray(reposData) ? reposData : [])
      .filter((r: any) => !r.fork) // fork'ları ele
      .map((r: any) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        html_url: r.html_url,
        topics: r.topics || [],
        updated_at: r.updated_at,
      }));

    return NextResponse.json({ login: user.login, repos });
  } catch {
    return NextResponse.json({ error: "gh_failed" }, { status: 500 });
  }
}
