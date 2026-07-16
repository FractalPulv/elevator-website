import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CONTACT_EMAIL, PRIVACY_UPDATED } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy — Elevator Scoreboard",
  description: "How the Elevator Scoreboard app handles your data.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="display text-2xl sm:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 leading-7 text-[var(--text-2)]">{children}</div>
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="border-b border-[var(--line-soft)] px-5 py-5 sm:px-8">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/icon-light.png" alt="" width={28} height={28} className="rounded-[8px]" />
            <span className="wordmark text-lg">Elevator Scoreboard</span>
          </Link>
          <Link href="/" className="nav-link text-sm">
            Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-14 sm:px-8 lg:py-20">
        <p className="eyebrow">Privacy</p>
        <h1 className="display mt-4 text-4xl sm:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-[var(--text-3)]">Last updated {PRIVACY_UPDATED}.</p>

        <p className="mt-8 leading-7 text-[var(--text-2)]">
          Elevator Scoreboard (&ldquo;the app&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a scoreboard for an
          Italian trick-taking card game, designed to collect as little about you as possible. This policy
          explains what is collected, why, and who we share it with.
        </p>

        <Section title="Information We Collect">
          <p>
            <strong className="text-[var(--text)]">No account required.</strong> You do not need to create an
            account or provide an email address to play.
          </p>
          <p>
            <strong className="text-[var(--text)]">Game data you create.</strong> Player names, chosen
            avatars, and match history are stored on your device and synced through our backend so your games
            and shared spectator rooms work across screens.
          </p>
          <p>
            <strong className="text-[var(--text)]">Crash and error reports.</strong> If the app crashes or
            hits an error, we receive technical diagnostic data to help us fix it. These reports are
            configured to exclude personally identifying information.
          </p>
          <p>
            <strong className="text-[var(--text)]">Purchases.</strong> If you buy Elevator Scoreboard Pro, our payments
            provider processes the purchase and tells us your subscription status. We never receive your full
            payment card details.
          </p>
          <p>
            <strong className="text-[var(--text)]">No analytics.</strong> The app does not include behavioral
            or advertising analytics.
          </p>
        </Section>

        <Section title="How We Use It">
          <p>We use the limited data above only to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Run the game, save your scores, and sync spectator rooms.</li>
            <li>Diagnose crashes and fix bugs.</li>
            <li>Unlock and maintain Elevator Scoreboard Pro for accounts that purchased it.</li>
          </ul>
          <p>We do not sell your data or use it for advertising.</p>
        </Section>

        <Section title="Third-Party Services">
          <p>The app relies on a small number of processors, each handling only what their function needs:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--text)]">Sentry</strong> (sentry.io) — crash and error reporting,
              configured to not send personally identifying information.
            </li>
            <li>
              <strong className="text-[var(--text)]">Convex</strong> — backend storage for the game and
              scoreboard data you create, including spectator rooms.
            </li>
            <li>
              <strong className="text-[var(--text)]">RevenueCat</strong> — manages the Elevator Scoreboard Pro purchase
              and subscription status.
            </li>
          </ul>
          <p>Purchases are also processed by the Apple App Store or Google Play, under their own policies.</p>
        </Section>

        <Section title="Data Retention">
          <p>
            Game data lives on your device and in our backend for as long as you keep using the app. You can
            remove players, matches, and rooms from within the app. Crash reports are retained only as long as
            needed to investigate and resolve issues.
          </p>
        </Section>

        <Section title="Children">
          <p>
            Elevator Scoreboard is not directed at children under 13, and we do not knowingly collect personal
            information from them. If you believe a child has provided us data, contact us and we will remove
            it.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy or your data? Reach us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="accent-text underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>
      </main>

      <footer className="border-t border-[var(--line-soft)] px-5 py-8 text-sm text-[var(--text-3)] sm:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <p>© {new Date().getFullYear()} Elevator Scoreboard.</p>
        </div>
      </footer>
    </div>
  );
}
