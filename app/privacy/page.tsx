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
            <Image src="/icon-256.png" alt="" width={28} height={28} className="rounded-[8px]" />
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
            <strong className="text-[var(--text)]">Usage analytics.</strong> The app records which screens you
            open and a few game milestones (a game started, a round scored, a game finished), with details
            such as the number of players, the card deck, and the <strong className="text-[var(--text)]">names
            of the players</strong> in the game and who won. Player names often belong to friends at your
            table, so please only add names they&apos;re happy to share. Events are tied to a random ID created
            on install, not to an account. Player photos, spectator codes and anything you type are never
            included, and nothing is used for advertising.
          </p>
          <p>
            <strong className="text-[var(--text)]">Session recordings.</strong> To find and fix bugs, the app may
            record how you move through its screens (a visual replay, plus technical logs and network timing).
            Text on screen, including player names, can appear in these recordings; images such as player photos
            and the system photo picker are hidden.
          </p>
          <p>
            <strong className="text-[var(--text)]">Your choice.</strong> You can turn off usage analytics and
            session recordings at any time in the app under Settings &rsaquo; Privacy &rsaquo; Share usage data.
          </p>
          <p>
            <strong className="text-[var(--text)]">Performance measurements.</strong> The app measures how
            long it takes to start and to open each screen, so we can keep it fast.
          </p>
          <p>
            <strong className="text-[var(--text)]">Device information.</strong> With the analytics and
            performance data, we receive basic technical details: device model, operating system and app
            version, language and time zone. Our analytics provider also sees your IP address when the data
            arrives.
          </p>
        </Section>

        <Section title="How We Use It">
          <p>We use the limited data above only to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Run the game, save your scores, and sync spectator rooms.</li>
            <li>Diagnose crashes and fix bugs.</li>
            <li>Understand, in aggregate, which features are used and how fast the app is.</li>
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
              <strong className="text-[var(--text)]">PostHog</strong> (EU Cloud, Frankfurt) — usage analytics and
              session recordings, as described above.
            </li>
            <li>
              <strong className="text-[var(--text)]">Expo</strong> (EAS Observe) — app start-up and screen
              load performance.
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
            needed to investigate and resolve issues. Analytics events and session recordings are kept only
            as long as they help improve the app, within each provider&apos;s retention limits.
          </p>
        </Section>

        <Section title="This Website">
          <p>
            Separately from the app, this website also measures how it&apos;s used. It runs Vercel
            Analytics, Vercel Speed Insights and PostHog (hosted in the EU). PostHog may record anonymised
            session replays of how you move through the site, including JavaScript errors and page speed;
            anything you type into a form is masked. Some replays may be summarised by PostHog&apos;s AI tools,
            which send them to PostHog&apos;s AI subprocessors.
          </p>
          <p>
            No cookies or local storage are used for this, and nothing is used to identify you across sites.
            If you arrive from lucapulv.com, a random visit ID is passed along in the link so both sites
            count as one visit. See also the{" "}
            <a href="https://lucapulv.com/privacy" className="accent-text underline">
              lucapulv.com privacy note
            </a>
            .
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
          <p>
            © {new Date().getFullYear()} Elevator Scoreboard · Made by{" "}
            <a href="https://lucapulv.com" className="nav-link !text-sm">
              Luca Pulvirenti
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
