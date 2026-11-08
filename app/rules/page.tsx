import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DeckGrid } from "@/app/components/DeckGrid";
import { DeckProvider } from "@/app/components/Deck";
import { RoundDemo } from "@/app/components/RoundDemo";

export const metadata: Metadata = {
  title: "How to play — Elevator Scoreboard",
  description:
    "The rules of Elevator, the trick-taking card game: call exactly how many tricks you'll win, then make it true.",
};

// Every rule here matches the app's own rules and scoring code.
const sections = [
  {
    title: "The elevator",
    body: (
      <>
        Round one deals one card each. Every round deals one more, up to the
        most your table can share (ten each with four players and a 40-card
        deck). That top floor is played twice, then the hands shrink back down
        to one card.
      </>
    ),
  },
  {
    title: "Which deck",
    body: (
      <>
        Four ways to play, all set in the app&rsquo;s Settings: the traditional
        40-card Italian deck; a poker deck with the 8s, 9s and 10s taken out
        (the default); a poker deck with the jacks, queens and kings taken out;
        or all 52 poker cards. The 40-card decks play the same way. With 52 the
        elevator climbs higher, to 13 cards each with four players, so the game
        runs longer. Whichever you use, the 2 is the weakest card and the ace
        the strongest.
      </>
    ),
  },
  {
    title: "Calling",
    body: (
      <>
        Look at your cards and say how many tricks they will win. Calls go round
        to the left, starting with the player left of the dealer. The last to
        call has one number they can&rsquo;t say: the one that would make the
        calls add up to the cards in each hand. So every round, someone misses.
      </>
    ),
  },
  {
    title: "Playing",
    body: (
      <>
        The first caller leads. Everyone plays one card, going left. Nobody has
        to follow suit: the highest card takes the trick, and its winner leads
        the next.
      </>
    ),
  },
  {
    title: "Scoring",
    body: (
      <>
        Make your call exactly and you score 10, plus 10 for every trick you
        called. Calling zero and taking none is worth 10 too. Miss, and in
        casual you score nothing; in competitive you lose 10 for every trick you
        were off by. A score never drops below zero.
      </>
    ),
  },
  {
    title: "Winning",
    body: (
      <>
        After each round the deal moves one seat to the left. When the elevator
        is back down to one card, the highest total wins.
      </>
    ),
  },
];

export default function Rules() {
  return (
    <DeckProvider>
      <div className="relative flex min-h-screen flex-col">
        <header className="border-b border-[var(--line-soft)] px-5 py-5 sm:px-8">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/icon-256.png"
                alt=""
                width={28}
                height={28}
                className="rounded-[8px]"
              />
              <span className="wordmark text-lg">Elevator Scoreboard</span>
            </Link>
            <Link href="/" className="nav-link text-sm">
              Back to site
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-14 sm:px-8 lg:py-20">
          <p className="eyebrow">How to play</p>
          <h1 className="display mt-4 text-4xl sm:text-5xl">
            Call it, then make it true
          </h1>
          <p className="lede mt-6 max-w-xl">
            Elevator is a trick-taking game for three to six players. Winning
            tricks isn&rsquo;t the point. Every round you say how many
            you&rsquo;ll take, and you only score if you take exactly that many.
          </p>

          <section className="tile mt-12 !p-6 sm:!p-10">
            <RoundDemo title="One round, from above" />
          </section>

          <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {sections.map((s, i) => (
              <section
                key={s.title}
                // the round's end card links here: #rules-calling, #rules-scoring...
                id={`rules-${s.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="scroll-mt-10"
              >
                <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="display mt-3 text-2xl">{s.title}</h2>
                <p className="mt-3 max-w-xl leading-7 text-[var(--text-2)]">
                  {s.body}
                </p>
              </section>
            ))}
          </div>

          {/* every card in order, told as you scroll */}
          <DeckGrid />

          <p className="mt-16 text-[var(--text-2)]">
            The app keeps score, tracks who deals and calls first, and has these
            rules built in, with an example round you can tap through.{" "}
            <Link href="/#download" className="accent-text underline">
              Get the app
            </Link>
            .
          </p>
        </main>
      </div>
    </DeckProvider>
  );
}
