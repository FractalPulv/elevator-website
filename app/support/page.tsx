import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Support — Elevator Scoreboard",
  description: "Help with the Elevator Scoreboard app, and how to get in touch.",
};

const faqs = [
  {
    q: "How do I restore Elevator Pro on a new phone?",
    a: "Open Settings, tap Unlock Elevator Pro, then Restore Purchase. Use the same Apple Account you bought it with.",
  },
  {
    q: "How do friends watch a game live?",
    a: "Whoever keeps score shares the room code. Everyone else opens Games, taps Watch a live game and enters the code.",
  },
  {
    q: "A room code says the game has expired.",
    a: "Room codes last 3 days. Ask the scorekeeper to share the game again for a fresh code.",
  },
  {
    q: "Can I play with a regular deck of cards?",
    a: "Yes. In Settings, under Card deck, pick Poker and choose which cards to take out.",
  },
];

export default function Support() {
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
        <p className="eyebrow">Support</p>
        <h1 className="display mt-4 text-4xl sm:text-5xl">How can we help?</h1>
        <p className="lede mt-6 max-w-xl">
          Found a bug, have an idea, or stuck on something? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="accent-text underline">
            {CONTACT_EMAIL}
          </a>{" "}
          and you&rsquo;ll hear back from the developer directly.
        </p>

        <h2 className="display mt-14 text-2xl sm:text-3xl">Common questions</h2>
        <div className="mt-6 grid gap-3">
          {faqs.map((f) => (
            <div key={f.q} className="card !p-6">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-2 leading-7 text-[var(--text-2)]">{f.a}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-[var(--line-soft)] px-5 py-8 text-sm text-[var(--text-3)] sm:px-8">
        <div className="mx-auto flex w-full max-w-3xl justify-between">
          <p>
            © {new Date().getFullYear()} Elevator Scoreboard · Made by{" "}
            <a href="https://lucapulv.com" className="nav-link !text-sm">
              Luca Pulvirenti
            </a>
          </p>
          <Link href="/privacy" className="nav-link !text-sm">
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  );
}
