import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // workspace root'u bu repoya sabitle (başka lockfile uyarısını gider)
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;

