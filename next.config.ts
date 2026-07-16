import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const configDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
	turbopack: {
		root: configDir,
	},
	images: {
		// Allow the official Apple "Download on the App Store" SVG badge in /public.
		dangerouslyAllowSVG: true,
		contentDispositionType: "attachment",
	},
};

export default nextConfig;
