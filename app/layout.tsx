import type { Metadata } from "next";
import "./globals.css";
import { DOMAIN } from "@/app/lib/site";
import SiteAnalytics from "@/app/components/SiteAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${DOMAIN}`),
  title: "Elevator Scoreboard — Score Elevator without the pen and paper",
  description:
    "Elevator Scoreboard is a mobile scoreboard for the Italian trick-taking card game where only an exact prediction scores. The round count climbs from 1 to 10 cards and back, like an elevator.",
  icons: { icon: "/icon-dark.png", apple: "/icon-light.png" },
  openGraph: {
    title: "Elevator Scoreboard — Score Elevator without the pen and paper",
    description:
      "A mobile scoreboard for the Italian trick-taking card game where only an exact prediction scores.",
    images: ["/icon-light.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <div className="bg-aura" aria-hidden="true" />
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
