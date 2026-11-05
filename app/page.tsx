import Image from "next/image";
import Link from "next/link";
import { CardFan } from "@/app/components/CardFan";
import { DeckCards, DeckProvider } from "@/app/components/Deck";
import { ChartIcon, ListIcon, TableIcon, TrophyIcon } from "@/app/components/Icons";
import { PhoneMockup } from "@/app/components/PhoneMockup";
import { PhoneVideo, type Cue } from "@/app/components/PhoneVideo";
import { Reveal } from "@/app/components/Reveal";
import { RotateShot } from "@/app/components/RotateShot";
import { ScoringModes } from "@/app/components/ScoringModes";
import { StepClips, type Step } from "@/app/components/StepClips";
import { StoreButtons } from "@/app/components/StoreButtons";
import { TableSeats } from "@/app/components/TableSeats";

const navItems = [
  { href: "#the-game", label: "The game" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pro", label: "Pro" },
];

// Player colours, as in the app.
const C = { Giulia: "#3b82f6", Marco: "#f97316", Sofia: "#22c55e", Luca: "#d946ef" };
const say = (name: keyof typeof C, text: string, from: number, to: number, side: Cue["side"], y: number): Cue => ({
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
    body: "Everyone calls how many tricks they'll take. Tap in the call, lock it, pass the phone along.",
    src: "/clips/predict.mp4",
    label: "Giulia's call of 2 is entered and locked",
    tilt: "right",
    cues: [say("Giulia", "Two.", 0.2, 3.4, "left", 0.25)],
  },
  {
    title: "The last call",
    body: "Whoever calls last can't make the calls add up to the cards dealt, so someone always misses. The app shows the number that's off limits.",
    src: "/clips/lastcall.mp4",
    label: "Sofia calls 0. Luca, calling last, is told he can't call 2 and calls 1",
    tilt: "none",
    cues: [
      say("Sofia", "Zero.", 0.2, 1.8, "left", 0.46),
      { ...say("Luca", "Two\u2026", 2.2, 5.6, "right", 0.58), then: { at: 3.4, text: "Oh. One, then." } },
    ],
  },
  {
    title: "Score",
    body: "Tap in each trick as it's won. Hit your call exactly and you score. Miss, and you don't.",
    src: "/clips/score.mp4",
    label: "Tricks are entered and the round's points appear",
    tilt: "left",
    cues: [],
  },
];

// The card game itself, before any app: who you need, what to learn, how it goes.
const beats = [
  {
    title: "Get friends",
    body: "Three to six players around one table, and one deck: a 40-card Italian deck or an ordinary poker deck.",
  },
  {
    title: "Learn the rules",
    body: "Every round deals one more card than the last, up to the top floor and back down. Call your tricks, then play them. The Rules tab walks you through it.",
  },
  {
    title: "Play",
    body: "One phone keeps score for everyone. Seat the players the way you're sitting and the app tracks who deals and who calls first.",
  },
];

// Landscape focus modes: the phone lies flat in the middle of the table.
const landscapeShots = [
  {
    src: "/screenshots/landscape-predict.webp",
    alt: "Landscape prediction focus mode: Luca can't call 2",
    caption: "Calls one player at a time, big enough to read across the table, and the dealer is told what they can't call.",
  },
  {
    src: "/screenshots/landscape-score.webp",
    alt: "Landscape scoring grid with points for each player",
    caption: "Tap a player's card for every trick they took. Points land the moment the last trick is in.",
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
        <path d="M2.5 6.2 5 8.6 9.6 3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
              <Image src="/icon-256.png" alt="" width={28} height={28} className="rounded-[8px]" />
              <span className="wordmark whitespace-nowrap text-[0.98rem] sm:text-[1.05rem]">Elevator Scoreboard</span>
            </a>
            <nav className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </a>
              ))}
            </nav>
            <a href="#download" className="btn btn--primary whitespace-nowrap !px-4 !py-2 !text-sm">
              Get the app
            </a>
          </div>
        </div>
      </header>

      <DeckProvider>
      <main className="relative z-10 flex-1">
        {/* Hero */}
        <section id="hero" className="scroll-mt-28 px-5 pb-20 pt-14 sm:px-8 lg:pb-28 lg:pt-20">
          <div className="mx-auto grid w-full max-w-5xl items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-6">
            <Reveal>
              <p className="eyebrow">The Italian card game, Ascensore</p>
              <h1 className="display mt-5 text-5xl sm:text-6xl lg:text-[4.4rem]">
                Score Elevator <span className="text-[var(--text-3)]">without the</span>{" "}
                <span className="accent-text">pen and paper.</span>
              </h1>
              <p className="lede mt-6 max-w-md">
                Grab a deck and a few friends. Everyone calls their tricks, only an exact call scores, and the
                app keeps track of every call, round and point, so the table can keep its eyes on the cards.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <StoreButtons />
                <span className="text-sm text-[var(--text-3)]">Free for 3 to 4 players</span>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="relative flex h-[30rem] items-center justify-center sm:h-[36rem]">
              <div className="absolute left-[8%] top-0 z-10 hidden sm:block">
                <PhoneMockup src="/screenshots/home-light.jpg" alt="Games screen in light mode" tilt="left" width="14rem" />
              </div>
              {/* the hand just dealt, peeking out from under the phones */}
              <CardFan className="absolute bottom-[14%] right-[-2%] z-0 hidden rotate-[18deg] sm:block" />
              <div className="relative z-10 sm:ml-[34%] sm:mt-20">
                <PhoneMockup
                  src="/screenshots/chart-portrait.jpg"
                  alt="Score chart and podium after five rounds"
                  tilt="left"
                  width="15.5rem"
                  glow
                  priority
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* The card game itself: people, a deck, a table */}
        <section id="the-game" className="scroll-mt-28 px-5 py-20 sm:px-8">
          <div className="mx-auto grid w-full max-w-5xl items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <Reveal>
              <p className="eyebrow">First, the card game</p>
              <h2 className="display mt-5 text-4xl sm:text-5xl">Friends, a deck and a table</h2>
              <p className="lede mt-6 max-w-md">
                Elevator is played face to face, with real cards. It takes a round to learn and a whole evening to
                stop playing.
              </p>
              <ol className="mt-9 grid gap-6">
                {beats.map((b, i) => (
                  <li key={b.title} className="beat">
                    <span className="beat__num">0{i + 1}</span>
                    <span className="beat__title">{b.title}</span>
                    <span className="beat__body">{b.body}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal delay={0.1} className="tile !p-6 sm:!p-8">
              <TableSeats />
            </Reveal>
          </div>
        </section>

        {/* How a round works */}
        <section id="how-it-works" className="scroll-mt-28 px-5 py-20 sm:px-8">
          <div className="mx-auto w-full max-w-5xl">
            <Reveal className="max-w-xl">
              <p className="eyebrow">How a round works</p>
              <h2 className="display mt-5 text-4xl sm:text-5xl">Only an exact call scores</h2>
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
                <h2 className="display mt-5 text-4xl sm:text-5xl">Turn it sideways</h2>
                <p className="lede mt-6">
                  Lay the phone in the middle of the table and the scoreboard switches to focus mode, built to
                  be read from every seat.
                </p>
              </Reveal>

              <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-10">
                {landscapeShots.map((shot, i) => (
                  <Reveal key={shot.src} delay={i * 0.08} className="flex flex-col items-center text-center">
                    <PhoneMockup
                      src={shot.src}
                      alt={shot.alt}
                      landscape
                      tilt={i === 0 ? "right" : "left"}
                      width="min(100%, 28rem)"
                    />
                    <p className="mt-8 max-w-sm leading-6 text-[var(--text-2)]">{shot.caption}</p>
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
              <h2 className="display mt-5 text-4xl sm:text-5xl">Everything the table needs</h2>
            </Reveal>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {/* Chart — a real recording: hold a finger on it and the podium follows */}
              <Reveal className="tile flex flex-col gap-8 sm:flex-row md:col-span-2 md:row-span-2 md:min-h-[36rem]">
                <div className="flex flex-col sm:w-1/2">
                  <h3 className="tile__title">See the game unfold</h3>
                  <p className="tile__body">
                    Who&rsquo;s climbing, who&rsquo;s slipping, and by how much. Hold a finger on the chart to
                    see the standings after any round.
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
                  <PhoneMockup src="/screenshots/home-light.jpg" alt="Light mode" width="8.5rem" />
                  <PhoneMockup src="/screenshots/home-dark.jpg" alt="Dark mode" width="8.5rem" />
                </div>
              </Reveal>

              {/* Decks — the switch drives the whole page: hero hand, table, this tile */}
              <Reveal delay={0.1} className="tile flex min-h-[18rem] flex-col">
                <h3 className="tile__title">Your deck</h3>
                <p className="tile__body">
                  The 40-card Italian deck, or a poker deck with the J, Q and K out (or the 8, 9 and 10, or all
                  52 for a longer game).
                </p>
                <DeckCards />
              </Reveal>

              {/* Scoring modes */}
              <Reveal className="tile flex flex-col gap-6">
                <div>
                  <h3 className="tile__title">Casual or competitive</h3>
                  <p className="tile__body">
                    An exact call scores the same either way. In casual, a miss scores nothing. In competitive,
                    it costs you.
                  </p>
                </div>
                <ScoringModes />
              </Reveal>

              {/* Pick up where you left off */}
              <Reveal delay={0.05} className="tile flex min-h-[24rem] flex-col !p-6">
                <h3 className="text-[1.05rem] font-semibold tracking-[-0.015em]">Pick up where you left off</h3>
                <p className="mt-1.5 leading-6 text-[var(--text-2)]">
                  Close the app mid-game. The scoreboard is waiting on the home screen.
                </p>
                <div className="pointer-events-none absolute inset-x-8 top-[9.5rem]">
                  <PhoneMockup src="/screenshots/home-dark.jpg" alt="Games screen: continue the game in round 6" width="100%" />
                </div>
              </Reveal>

              {/* Portrait or landscape — the phone turns, the screen re-lays out */}
              <Reveal delay={0.05} className="tile flex min-h-[30rem] flex-col !p-6">
                <h3 className="text-[1.05rem] font-semibold tracking-[-0.015em]">Portrait or landscape</h3>
                <p className="mt-1.5 leading-6 text-[var(--text-2)]">
                  Every screen works both ways. Turn the phone and calling becomes one big, focused view.
                </p>
                <div className="mt-auto pt-4">
                  <RotateShot
                    portrait={{ src: "/screenshots/predict-dark.jpg", alt: "Calling screen, upright" }}
                    landscape={{ src: "/screenshots/landscape-predict.webp", alt: "The same calls on its side, one player at a time" }}
                  />
                </div>
              </Reveal>

              {/* English and Italian — the same row in both, zoomed in so the words read */}
              <Reveal className="tile grid items-center gap-8 md:col-span-2 md:grid-cols-[0.8fr_1.2fr] md:!p-8">
                <div>
                  <h3 className="tile__title">English and Italian</h3>
                  <p className="tile__body">
                    The whole app, rules included, in both languages. Switch any time in Settings.
                  </p>
                </div>
                <div className="grid gap-3">
                  {(
                    [
                      ["English", "/screenshots/lang-en.jpg", "Game and Stats tabs; Giulia bids first"],
                      ["Italiano", "/screenshots/lang-it.jpg", "Partita and Statistiche tabs; Giulia apre"],
                    ] as const
                  ).map(([lang, src, alt]) => (
                    <figure key={lang} className="lang-strip">
                      <figcaption className="lang-strip__label">{lang}</figcaption>
                      <Image src={src} alt={alt} width={568} height={216} className="lang-strip__img" />
                    </figure>
                  ))}
                </div>
              </Reveal>

              {/* Rules */}
              <Reveal delay={0.1} className="tile flex min-h-[30rem] flex-col !p-6">
                <h3 className="text-[1.05rem] font-semibold tracking-[-0.015em]">The rules, built in</h3>
                <p className="mt-1.5 leading-6 text-[var(--text-2)]">
                  New to Elevator? The Rules tab covers dealing, calling, tricks and scoring, with examples you
                  can tap through.
                </p>
                <div className="pointer-events-none absolute inset-x-6 top-[12.5rem]">
                  <PhoneMockup src="/screenshots/rules-predict.jpg" alt="Rules tab: the last call, explained" width="100%" />
                </div>
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
                <h2 className="display mt-5 text-4xl sm:text-5xl">Bigger tables. Live scores.</h2>
                <p className="lede mt-6 max-w-md">
                  Scoring, match history and stats are free for everyone. Pro is a one-time unlock for bigger
                  games and for a table where everyone can see the score.
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <ul className="grid gap-3">
                  {proItems.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[var(--text-2)]">
                      <CheckIcon />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {/* Live scores at the table — a recording of joining with a room code */}
              <Reveal className="tile grid items-center gap-8 sm:grid-cols-[1fr_1fr] md:col-span-2 md:!p-8">
                <div>
                  <h3 className="tile__title">The score on every phone</h3>
                  <p className="tile__body">
                    Everyone wants to check the score and the chart, and that used to mean passing the one phone
                    around the table. Share a four-letter room code and each player follows every call and every
                    point live on their own phone.
                  </p>
                </div>
                <div className="flex justify-center">
                  <PhoneVideo
                    src="/clips/spectate.mp4"
                    poster="/clips/spectate.jpg"
                    label="Entering room code NYYA opens the live game"
                    cues={[
                      {
                        name: "Luca",
                        color: "#d946ef",
                        text: "The code's NYYA.",
                        from: 1.1,
                        to: 5.2,
                        side: "left",
                        y: 0.36,
                      },
                    ]}
                    width="12rem"
                  />
                </div>
              </Reveal>

              {/* Live Activity — a crop of the real Lock Screen capture */}
              <Reveal delay={0.05} className="tile flex flex-col !p-6">
                <h3 className="tile__title">On the Lock Screen</h3>
                <p className="tile__body">Everyone following gets a Live Activity: the leader, the scores and the next round.</p>
                <div className="mt-auto pt-6">
                  <Image
                    src="/screenshots/live-activity-crop.webp"
                    alt="Live Activity on the Lock Screen: Giulia leads with 80 after round 5"
                    width={900}
                    height={612}
                    className="w-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  />
                </div>
              </Reveal>

              {/* Six players */}
              <Reveal delay={0.1} className="tile grid items-center gap-8 sm:grid-cols-[0.8fr_1.2fr] md:col-span-3 md:!p-8">
                <div>
                  <h3 className="tile__title">Six at the table</h3>
                  <p className="tile__body">
                    Seat up to six. With 40 cards to share, the elevator tops out at six cards each, and the
                    scoring grid makes room for everyone.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-6">
                  <PhoneMockup src="/screenshots/six-list.webp" alt="Six players in the setup list" width="9.5rem" />
                  <div className="hidden w-[22rem] max-w-[60%] sm:block">
                    <PhoneMockup src="/screenshots/six-score.webp" alt="Scoring grid for six players" landscape width="100%" />
                  </div>
                </div>
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
            <h2 className="display mt-7 text-5xl sm:text-6xl">Get Elevator Scoreboard</h2>
            <p className="lede mx-auto mt-5 max-w-md">
              On iPhone. Free for 3 to 4 players, with Pro for bigger tables and live scores.
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
            <Image src="/icon-256.png" alt="" width={20} height={20} className="rounded-[6px]" />
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
