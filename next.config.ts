import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const configDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
	// lets several dev servers run side by side (NEXT_DIST_DIR=.next-a next dev -p 3101)
	distDir: process.env.NEXT_DIST_DIR || ".next",
	turbopack: {
		root: configDir,
	},
	// PostHog's API calls use trailing slashes; don't redirect them.
	skipTrailingSlashRedirect: true,
	// Proxy PostHog through this domain, like lucapulv.com: analytics aren't
	// blocked by ad blockers and the EU cloud keeps data in the EU.
	async rewrites() {
		return [
			{ source: "/ingest/static/:path*", destination: "https://eu-assets.i.posthog.com/static/:path*" },
			{ source: "/ingest/:path*", destination: "https://eu.i.posthog.com/:path*" },
		];
	},
	images: {
		// Every image in /public is already sized and compressed (screenshots are
		// ~25 KB WebP), so serve them as-is instead of through the optimizer.
		unoptimized: true,
	},
};

export default nextConfig;
