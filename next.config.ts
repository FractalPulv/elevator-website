import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const configDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
	turbopack: {
		root: configDir,
	},
	images: {
		// Every image in /public is already sized and compressed (screenshots are
		// ~25 KB WebP), so serve them as-is instead of through the optimizer.
		unoptimized: true,
	},
};

export default nextConfig;
