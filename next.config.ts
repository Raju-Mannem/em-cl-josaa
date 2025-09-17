import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    outputFileTracingRoot: path.resolve(__dirname),
  /* config options here */
};

export default nextConfig;
