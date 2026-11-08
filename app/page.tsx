import Image from "next/image";
import Link from "next/link";
import { DeckCards, DeckProvider } from "@/app/components/Deck";
import {
  ChartIcon,
  ListIcon,
  TableIcon,
  TrophyIcon,
} from "@/app/components/Icons";
import { Hero } from "@/app/components/Hero";
import { PhoneMockup } from "@/app/components/PhoneMockup";
import { PhoneVideo, type Cue } from "@/app/components/PhoneVideo";
import { Reveal } from "@/app/components/Reveal";
import { RotateShot } from "@/app/components/RotateShot";
import { RoundDemo } from "@/app/components/RoundDemo";
import { ToggleShot } from "@/app/components/ToggleShot";
import { IndieMaker } from "@/app/components/IndieMaker";
import { ScoringModes } from "@/app/components/ScoringModes";
import { StepClips, type Step } from "@/app/components/StepClips";
import { StoreButtons } from "@/app/components/StoreButtons";
import { TableSeats } from "@/app/components/TableSeats";

const navItems = [
  { href: "#the-game", label: "The game" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pro", label: "Pro" },
  { href: "/rules", label: "Rules" },
];

// Player colours, as in the app.
const C = {
  Giulia: "#3b82f6",
  Marco: "#f97316",
  Sofia: "#22c55e",
  Luca: "#d946ef",
};
const say = (
  name: keyof typeof C,
  text: string,
  from: number,
  to: number,
  side: Cue["side"],
  y: number,
): Cue => ({
  name,
  color: C[name],
  text,
  from,
  to,
  side,
  y,
});

// One round of one game, recorded in the app (round 5, five cards each). The bubbles are
// what's said at the table, timed to the recording: someone calls, the phone records it.
// Only the calls are spoken; tricks get tapped in quietly as they're won.
const steps: Step[] = [
  {
    title: "Predict",
    body: "Each player says how many they'll take. Tap it in and lock it: from then on it's on record.",
    src: "/clips/predict.mp4",
    label: "Giulia's call of 2 is entered and locked",
    tilt: "right",
    cues: [say("Giulia", "Two.", 0.2, 3.4, "left", 0.25)],
  },
  {
    title: "Score",
    body: "Tap in each one as it's won. Hit your prediction exactly and you score; miss, and you don't. The totals and stats keep up as you play.",
    src: "/clips/score.mp4",
    label: "Each player's wins are entered and the round's points appear",
    tilt: "left",
    cues: [],
  },
];

// The card game itself, before any app: who you need, what to learn, how it goes.
const beats = [
  {
    title: "Gather the players",
    body: "Three to six of you around one table, and one deck: a 40-card Italian deck or an ordinary poker deck.",
  },
  {
    title: "Learn the rules",
    body: "Each round deals one more card than the last, up to the top floor and back down. Everyone predicts how many they\u2019ll take, then you play it out. The Rules tab in the app walks you through it.",
  },
  {
    title: "Play",
    body: "One phone keeps score for everyone. Seat the players the way you\u2019re sitting and the app tracks who deals and who calls first.",
  },
];

// Landscape focus modes: the phone lies flat in the middle of the table.
const landscapeShots = [
  {
    src: "/screenshots/landscape-predict.webp",
    alt: "Landscape prediction focus mode: Luca can't call 2",
    caption:
      "Predictions go in one player at a time, with nothing else on screen to get in the way.",
  },
  {
    src: "/screenshots/landscape-score.webp",
    alt: "Landscape scoring grid with points for each player",
    caption:
      "Tap a player's card for each one they take. The points land as soon as the round is in.",
  },
];

const chartPoints = [
  { Icon: ChartIcon, label: "A live chart of every round" },
  { Icon: TableIcon, label: "The full score table, round by round" },
  { Icon: TrophyIcon, label: "A podium when the last card falls" },
  { Icon: ListIcon, label: "Every finished game in your history" },
];

const proItems = [
  "5 and 6 player games",
  "The live game on every player's phone",
  "Scores on the Lock Screen while you play",
  "One-time purchase, no subscription",
];

function CheckIcon() {
  return (
    <span className="check" aria-hidden="true">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path
          d="M2.5 6.2 5 8.6 9.6 3.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Floating nav */}
      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <div className="mx-auto w-full max-w-5xl">
          <div className="navbar">
            <a href="#hero" className="flex items-center gap-2.5">
              <Image
                src="/icon-256.png"
                alt=""
                width={28}
                height={28}
                className="rounded-[8px]"
              />
              <span className="wordmark whitespace-nowrap text-[0.98rem] sm:text-[1.05rem]">
                Elevator Scoreboard
              </span>
            </a>
            <nav className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </a>
              ))}
            </nav>
            <a
              href="#download"
              className="btn btn--primary whitespace-nowrap !px-4 !py-2 !text-sm"
            >
              Get the app
            </a>
          </div>
        </div>
      </header>

      <DeckProvider>
        <main className="relative z-10 flex-1">
          {/* Hero */}
          <section
            id="hero"
            className="scroll-mt-28 px-5 pb-20 pt-14 sm:px-8 lg:pb-28 lg:pt-20"
          >
            {/* TEMPORARY ?hero= switch; the fallback (prerendered) is the default hero */}
            <Hero />
          </section>

          {/* The card game itself: people, a deck, a table */}
          <section id="the-game" className="scroll-mt-28 px-5 py-20 sm:px-8">
            <div className="mx-auto w-full max-w-5xl">
              <Reveal className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-14">
                <div>
                  <p className="eyebrow">First, the card game</p>
                  <h2 className="display mt-5 text-4xl sm:text-5xl">
                    Friends, a deck and a table
                  </h2>
                </div>
                <p className="lede max-w-md lg:pb-1">
                  Elevator is played face to face, with real cards. It takes a
                  round to learn and a whole evening to stop playing.
                </p>
              </Reveal>
              <div className="mt-12 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
                <Reveal delay={0.05} className="tile !p-6 sm:!p-8">
                  <TableSeats />
                </Reveal>
                <Reveal delay={0.1} className="h-full">
                  <ol className="beats">
                    {beats.map((b, i) => (
                      <li key={b.title} className="beat">
                        <span className="beat__num">{i + 1}</span>
                        <span className="beat__title">{b.title}</span>
                        <span className="beat__body">{b.body}</span>
                      </li>
                    ))}
                  </ol>
                </Reveal>
              </div>
            </div>
          </section>

          {/* How a round works */}
          <section
            id="how-it-works"
            className="scroll-mt-28 px-5 py-20 sm:px-8"
          >
            <div className="mx-auto w-full max-w-5xl">
              <Reveal className="max-w-xl">
                <p className="eyebrow">How it works</p>
                <h2 className="display mt-5 text-4xl sm:text-5xl">
                  Every prediction, on record
                </h2>
                <p className="lede mt-6 max-w-md">
                  Round the table, a prediction used to be a promise. Now
                  it&rsquo;s locked in, so nobody can say they called something
                  else.
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <StepClips steps={steps} />
              </Reveal>
            </div>
          </section>

          {/* Landscape focus modes */}
          <section id="landscape" className="scroll-mt-28 px-5 py-20 sm:px-8">
            <div className="mx-auto w-full max-w-5xl">
              <Reveal className="max-w-xl">
                <p className="eyebrow">Landscape</p>
                <h2 className="display mt-5 text-4xl sm:text-5xl">
                  Turn it sideways
                </h2>
                <p className="lede mt-6">
                  Turn the phone and the scoreboard switches to focus mode: one
                  player and one decision at a time, and nothing else on screen.
                </p>
              </Reveal>

              <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-10">
                {landscapeShots.map((shot, i) => (
                  <Reveal
                    key={shot.src}
                    delay={i * 0.08}
                    className="flex flex-col items-center text-center"
                  >
                    <PhoneMockup
                      src={shot.src}
                      alt={shot.alt}
                      landscape
                      tilt={i === 0 ? "right" : "left"}
                      width="min(100%, 28rem)"
                    />
                    <p className="mt-8 max-w-sm leading-6 text-[var(--text-2)]">
                      {shot.caption}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Features */}
          <section id="features" className="scroll-mt-28 px-5 py-20 sm:px-8">
            <div className="mx-auto w-full max-w-5xl">
              <Reveal className="max-w-xl">
                <p className="eyebrow">Features</p>
                <h2 className="display mt-5 text-4xl sm:text-5xl">
                  Everything the table needs
                </h2>
              </Reveal>

              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {/* Chart — a real recording: hold a finger on it and the podium follows */}
                <Reveal className="tile flex flex-col gap-8 sm:flex-row md:col-span-2 md:row-span-2 md:min-h-[36rem]">
                  <div className="flex flex-col sm:w-1/2">
                    <h3 className="tile__title">See the game unfold</h3>
                    <p className="tile__body">
                      Who&rsquo;s climbing, who&rsquo;s slipping, and by how
                      much. Hold a finger on the chart to see the standings
                      after any round.
                    </p>
                    <ul className="mt-8 grid gap-4 sm:mt-auto">
                      {chartPoints.map(({ Icon, label }) => (
                        <li key={label} className="stat-row">
                          <span className="icon-chip">
                            <Icon size={17} />
                          </span>
                          {label}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative -mb-36 flex justify-center sm:-mb-28 sm:w-1/2 sm:items-end">
                    <PhoneVideo
                      src="/clips/chart.mp4"
                      poster="/clips/chart.jpg"
                      label="A finger runs along the score chart and the podium re-sorts for each round"
                      tilt="left"
                      width="clamp(13rem, 24vw, 16.5rem)"
                    />
                  </div>
                </Reveal>

                {/* Light & dark */}
                <Reveal delay={0.05} className="tile min-h-[18rem]">
                  <h3 className="tile__title">Light or dark</h3>
                  <p className="tile__body">Follows your phone, or pick one.</p>
                  <div className="pointer-events-none absolute -bottom-40 left-1/2 flex -translate-x-1/2 gap-3">
                    <PhoneMockup
                      src="/screenshots/home-light.jpg"
                      alt="Light mode"
                      width="8.5rem"
                    />
                    <PhoneMockup
                      src="/screenshots/home-dark.jpg"
                      alt="Dark mode"
                      width="8.5rem"
                    />
                  </div>
                </Reveal>

                {/* Decks — the switch drives the whole page: hero hand, table, this tile */}
                <Reveal
                  delay={0.1}
                  className="tile flex min-h-[18rem] flex-col"
                >
                  <h3 className="tile__title">Your deck</h3>
                  <p className="tile__body">
                    The 40-card Italian deck, or a poker deck with the 8, 9 and
                    10 out (or the J, Q and K, or all 52 for a longer game).
                  </p>
                  <DeckCards />
                </Reveal>

                {/* Scoring modes */}
                <Reveal className="tile flex flex-col gap-6">
                  <div>
                    <h3 className="tile__title">Casual or competitive</h3>
                    <p className="tile__body">
                      An exact prediction scores the same in both: 10 points,
                      plus 10 for each one you predicted. They only differ when
                      you miss.
                    </p>
                  </div>
                  <ScoringModes />
                </Reveal>

                {/* Pick up where you left off */}
                <Reveal
                  delay={0.05}
                  className="tile flex min-h-[24rem] flex-col !p-6"
                >
                  <h3 className="text-[1.05rem] font-semibold tracking-[-0.015em]">
                    Pick up where you left off
                  </h3>
                  <p className="mt-1.5 leading-6 text-[var(--text-2)]">
                    Close the app mid-game. The scoreboard is waiting on the
                    home screen.
                  </p>
                  <div className="pointer-events-none absolute inset-x-8 top-[9.5rem]">
                    <PhoneMockup
                      src="/screenshots/home-dark.jpg"
                      alt="Games screen: continue the game in round 6"
                      width="100%"
                    />
                  </div>
                </Reveal>

                {/* Portrait or landscape — the phone turns, the screen re-lays out */}
                <Reveal
                  delay={0.05}
                  className="tile flex min-h-[30rem] flex-col !p-6"
                >
                  <h3 className="text-[1.05rem] font-semibold tracking-[-0.015em]">
                    Portrait or landscape
                  </h3>
                  <p className="mt-1.5 leading-6 text-[var(--text-2)]">
                    Every screen works both ways. Turn the phone for focus mode:
                    one player at a time.
                  </p>
                  <div className="mt-auto pt-4">
                    <RotateShot
                      portrait={{
                        src: "/screenshots/rotate-portrait.jpg",
                        alt: "Round 5, upright: Giulia calls 2",
                      }}
                      landscape={{
                        src: "/screenshots/rotate-landscape.webp",
                        alt: "The same moment on its side: Giulia's call of 2 in focus mode",
                      }}
                    />
                  </div>
                </Reveal>

                {/* English and Italian — the same moment in both, big enough to read */}
                <Reveal className="tile flex min-h-[30rem] flex-col !p-6">
                  <h3 className="text-[1.05rem] font-semibold tracking-[-0.015em]">
                    English and Italian
                  </h3>
                  <p className="mt-1.5 leading-6 text-[var(--text-2)]">
                    Switch the app between English and Italian in Settings.
                  </p>
                  <ToggleShot
                    peek
                    label="App language"
                    options={[
                      {
                        label: "English",
                        src: "/screenshots/settings-en.jpg",
                        alt: "Settings screen in English",
                      },
                      {
                        label: "Italiano",
                        src: "/screenshots/settings-it.jpg",
                        alt: "Settings screen in Italian",
                      },
                    ]}
                  />
                </Reveal>

                {/* Rules — a round from above, and the full rules a click away */}
                <Reveal
                  delay={0.05}
                  className="tile grid items-center gap-8 md:col-span-2 md:grid-cols-[0.8fr_1.2fr] md:!p-8"
                >
                  <div>
                    <h3 className="tile__title">New to Elevator?</h3>
                    <p className="tile__body">
                      Predict how many you&rsquo;ll take, then take exactly that
                      many. The rules page walks through a whole round, one step
                      at a time. They&rsquo;re in the app too.
                    </p>
                    <Link href="/rules" className="btn btn--primary mt-6">
                      How to play
                    </Link>
                  </div>
                  {/* the table is a way in too; the button above is the one in the tab order */}
                  <Link
                    href="/rules"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="block"
                  >
                    <RoundDemo compact />
                  </Link>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Pro */}
          <section id="pro" className="scroll-mt-28 px-5 py-20 sm:px-8">
            <div className="mx-auto w-full max-w-5xl">
              <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
                <Reveal>
                  <p className="eyebrow accent-text">Elevator Pro</p>
                  <h2 className="display mt-5 text-4xl sm:text-5xl">
                    Bigger tables. Live scores.
                  </h2>
                  <p className="lede mt-6 max-w-md">
                    Scoring, match history and stats are free for everyone. Pro
                    is a one-time unlock for bigger games and for a table where
                    everyone can see the score.
                  </p>
                </Reveal>
                <Reveal delay={0.05}>
                  <ul className="grid gap-3">
                    {proItems.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-[var(--text-2)]"
                      >
                        <CheckIcon />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {/* Live scores at the table — a recording of joining with a room code */}
                <Reveal className="tile grid items-center gap-8 sm:grid-cols-[0.9fr_1.1fr] md:col-span-2 md:!p-8">
                  <div>
                    <h3 className="tile__title">The score on every phone</h3>
                    <p className="tile__body">
                      Everyone wants to check the score and the chart, and that
                      used to mean passing the one phone around the table. Share
                      a four-letter room code and each player follows every call
                      and every point live on their own phone.
                    </p>
                  </div>
                  {/* the camera pushes in on the whole phone; this column crops it with soft
                      edges, so it never covers the text. 1.6 at most keeps the phone's sides
                      in view on a 390px screen. */}
                  <div className="phone-crop">
                    <PhoneVideo
                      src="/clips/spectate.mp4"
                      poster="/clips/spectate.jpg"
                      label="Typing room code ZZBT opens the live game"
                      camera={[
                        { at: 0, scale: 1.3, x: 0.5, y: 0.4 },
                        { at: 2.6, scale: 1.6, x: 0.5, y: 0.46 },
                        { at: 7.2, scale: 1.3, x: 0.5, y: 0.4 },
                      ]}
                      width="11rem"
                    />
                  </div>
                </Reveal>

                {/* Live Activity — a crop of the real Lock Screen capture */}
                <Reveal delay={0.05} className="tile flex flex-col !p-6">
                  <h3 className="tile__title">On the Lock Screen</h3>
                  <p className="tile__body">
                    Everyone following gets a Live Activity: the leader, the
                    scores and the next round.
                  </p>
                  {/* a phone on its Lock Screen, the Live Activity where iOS puts it: fills the
                    tile's height instead of leaving a gap above a small crop */}
                  <div className="mt-auto flex justify-center pt-6">
                    <PhoneMockup
                      width="11rem"
                      src="/screenshots/lock-screen.jpg"
                      alt="Live Activity on the Lock Screen: Giulia leads with 80 after round 4, round 5 next"
                    />
                  </div>
                </Reveal>

                {/* Six players */}
                <Reveal
                  delay={0.1}
                  className="tile flex flex-col gap-8 md:col-span-2 md:!p-8"
                >
                  <div>
                    <h3 className="tile__title">Six at the table</h3>
                    <p className="tile__body">
                      Seat up to six. With 40 cards to share, the elevator tops
                      out at six cards each, and the scoring grid makes room for
                      everyone.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-6">
                    <PhoneMockup
                      src="/screenshots/six-list.webp"
                      alt="Six players in the setup list"
                      width="9.5rem"
                    />
                    <div className="hidden w-[22rem] max-w-[60%] sm:block">
                      <PhoneMockup
                        src="/screenshots/six-score.webp"
                        alt="Scoring grid for six players"
                        landscape
                        width="100%"
                      />
                    </div>
                  </div>
                </Reveal>

                {/* Indie */}
                <Reveal delay={0.15} className="tile flex flex-col !p-6">
                  <h3 className="tile__title">Support indie development</h3>
                  <p className="tile__body">
                    Elevator Scoreboard is made by one person, not a studio. No
                    ads, no subscription: Pro is what keeps it going.
                  </p>
                  <Link href="/story" className="btn btn--primary mt-6 self-start">
                    Read the story
                  </Link>
                  <IndieMaker />
                </Reveal>
              </div>
            </div>
          </section>

          {/* Download CTA */}
          <section id="download" className="scroll-mt-28 px-5 py-24 sm:px-8">
            <Reveal className="mx-auto w-full max-w-2xl text-center">
              <Image
                src="/icon-256.png"
                alt="Elevator Scoreboard app icon"
                width={72}
                height={72}
                className="mx-auto rounded-[22%] shadow-[0_20px_60px_var(--accent-glow)]"
              />
              <h2 className="display mt-7 text-5xl sm:text-6xl">
                Get Elevator Scoreboard
              </h2>
              <p className="lede mx-auto mt-5 max-w-md">
                A scoreboard for iPhone. Free for 3 to 4 players, with Pro for
                bigger tables and live scores.
              </p>
              <div className="mt-9 flex justify-center">
                <StoreButtons />
              </div>
            </Reveal>
          </section>
        </main>
      </DeckProvider>

      <footer className="relative z-10 px-5 py-10 text-sm text-[var(--text-3)] sm:px-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2 text-[var(--text-2)]">
            <Image
              src="/icon-256.png"
              alt=""
              width={20}
              height={20}
              className="rounded-[6px]"
            />
            <span className="wordmark">Elevator Scoreboard</span>
          </span>
          <p>
            © {new Date().getFullYear()} Elevator Scoreboard · Made by{" "}
            <a href="https://lucapulv.com" className="nav-link !text-sm">
              Luca Pulvirenti
            </a>
          </p>
          <div className="flex gap-5">
            <Link href="/support" className="nav-link">
              Support
            </Link>
            <Link href="/privacy" className="nav-link">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
