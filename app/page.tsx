import Image from "next/image";
import Link from "next/link";
import { CardFan } from "@/app/components/CardFan";
import { ChartIcon, ListIcon, TableIcon, TrophyIcon } from "@/app/components/Icons";
import { ToggleShot } from "@/app/components/ToggleShot";
import { PhoneMockup } from "@/app/components/PhoneMockup";
import { Reveal } from "@/app/components/Reveal";
import { StoreButtons } from "@/app/components/StoreButtons";
import { TableSeats } from "@/app/components/TableSeats";
import {
  FrenchClub,
  FrenchDiamond,
  FrenchHeart,
  FrenchSpade,
  ItalianBat,
  ItalianCoin,
  ItalianCup,
  ItalianSword,
} from "@/app/components/SuitIcons";

const navItems = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pro", label: "Pro" },
];

const steps = [
  {
    title: "Predict",
    body: "Everyone calls how many tricks they'll take. Tap to set the call, lock it in, pass the phone along.",
    src: "/screenshots/predict-dark.jpg",
    alt: "Prediction screen: each player locks in their call",
    tilt: "right" as const,
  },
  {
    title: "The last call",
    body: "The dealer can't make the calls add up to the cards in play, so someone always misses. The app shows which number is off limits.",
    src: "/screenshots/lastcall-dark.jpg",
    alt: "The dealer is told which call they can't make",
    tilt: "none" as const,
  },
  {
    title: "Score",
    body: "Enter the tricks each player took. Hit your call exactly and you score. Miss by one and you get nothing.",
    src: "/screenshots/score-dark.jpg",
    alt: "Scoring screen showing points won this round",
    tilt: "left" as const,
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

const shotFeatures = [
  {
    title: "Pick up where you left off",
    body: "Close the app mid-game. The scoreboard is waiting on the home screen.",
    src: "/screenshots/home-light.webp",
  },
  {
    title: "English and Italian",
    body: "The whole app, rules included, in both languages.",
    toggle: {
      label: "App language",
      options: [
        { label: "English", src: "/screenshots/predict-dark.jpg", alt: "Calling screen in English" },
        { label: "Italiano", src: "/screenshots/predict-italian.jpg", alt: "Calling screen in Italian" },
      ],
    },
  },
  {
    title: "Portrait or landscape",
    body: "Every screen works both ways. Upright you get the podium; on its side, the full table.",
    toggle: {
      label: "Orientation",
      options: [
        { label: "Portrait", src: "/screenshots/chart-portrait.jpg", alt: "Stats in portrait: chart and podium" },
        {
          label: "Landscape",
          src: "/screenshots/landscape-table.webp",
          alt: "Stats in landscape: the full score table",
          landscape: true,
        },
      ],
    },
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
  "Live scoreboard sync with a room code",
  "Scores on the Lock Screen while you watch",
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
                <PhoneMockup src="/screenshots/home-light.webp" alt="Games screen in light mode" tilt="left" width="14rem" />
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

        {/* How a round works */}
        <section id="how-it-works" className="scroll-mt-28 px-5 py-20 sm:px-8">
          <div className="mx-auto w-full max-w-5xl">
            <Reveal className="max-w-xl">
              <p className="eyebrow">How a round works</p>
              <h2 className="display mt-5 text-4xl sm:text-5xl">Only an exact call scores</h2>
            </Reveal>

            <div className="mt-16 grid gap-16 md:grid-cols-3 md:gap-8">
              {steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.08} className="flex flex-col items-center text-center">
                  <PhoneMockup src={step.src} alt={step.alt} tilt={step.tilt} width="13.5rem" />
                  <div className="mt-10 flex items-center gap-3">
                    <span className="step-num">{i + 1}</span>
                    <h3 className="text-xl font-semibold tracking-[-0.02em]">{step.title}</h3>
                  </div>
                  <p className="mt-3 max-w-[18rem] leading-6 text-[var(--text-2)]">{step.body}</p>
                </Reveal>
              ))}
            </div>
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
              {/* The table — this is a companion to a game played with friends */}
              <Reveal className="tile grid gap-8 md:col-span-3 md:grid-cols-[0.8fr_1.2fr] md:items-center md:!p-10">
                <div>
                  <h3 className="tile__title !text-2xl">Made for the table</h3>
                  <p className="tile__body">
                    Elevator is played face to face, with a real deck. Every round deals one more card than the
                    last, up to the top floor and back down again, so the more players, the shorter the ride.
                  </p>
                  <p className="tile__body">
                    One phone keeps score for everyone. Seat the players the way you&rsquo;re sitting and the app
                    tracks who deals and who calls first.
                  </p>
                </div>
                <TableSeats />
              </Reveal>

              {/* Chart */}
              <Reveal className="tile flex flex-col gap-8 sm:flex-row md:col-span-2 md:row-span-2 md:min-h-[36rem]">
                <div className="flex flex-col sm:w-1/2">
                  <h3 className="tile__title">See the game unfold</h3>
                  <p className="tile__body">Who&rsquo;s climbing, who&rsquo;s slipping, and by how much.</p>
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
                <div className="pointer-events-none relative -mb-36 flex justify-center sm:-mb-28 sm:w-1/2 sm:items-end">
                  <PhoneMockup
                    src="/screenshots/chart-dark.webp"
                    alt="Score chart and podium after five rounds"
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
                  <PhoneMockup src="/screenshots/home-light.webp" alt="Light mode" width="8.5rem" />
                  <PhoneMockup src="/screenshots/home-dark.webp" alt="Dark mode" width="8.5rem" />
                </div>
              </Reveal>

              {/* Decks */}
              <Reveal delay={0.1} className="tile flex min-h-[18rem] flex-col">
                <h3 className="tile__title">Your deck</h3>
                <p className="tile__body">
                  The 40-card Italian deck, or a regular deck with a few cards taken out.
                </p>
                <div className="mt-auto grid grid-cols-4 gap-3 pt-8">
                  {[
                    { Icon: ItalianSword, color: "var(--suit-sword)" },
                    { Icon: ItalianCup, color: "var(--suit-cup)" },
                    { Icon: ItalianBat, color: "var(--suit-bat)" },
                    { Icon: ItalianCoin, color: "var(--suit-coin)" },
                    { Icon: FrenchSpade, color: "var(--text-2)" },
                    { Icon: FrenchHeart, color: "var(--suit-cup)" },
                    { Icon: FrenchClub, color: "var(--text-2)" },
                    { Icon: FrenchDiamond, color: "var(--suit-cup)" },
                  ].map(({ Icon, color }, i) => (
                    <span
                      key={i}
                      className="grid aspect-square place-items-center rounded-xl bg-[var(--surface-2)]"
                      style={{ color }}
                    >
                      <Icon size={22} />
                    </span>
                  ))}
                </div>
              </Reveal>

              {shotFeatures.map((f, i) => (
                <Reveal key={f.title} delay={0.05 * i} className="tile flex min-h-[22rem] flex-col !p-6">
                  <h3 className="text-[1.05rem] font-semibold tracking-[-0.015em]">{f.title}</h3>
                  <p className="mt-1.5 leading-6 text-[var(--text-2)]">{f.body}</p>
                  {f.toggle ? (
                    <ToggleShot label={f.toggle.label} options={f.toggle.options} />
                  ) : (
                    // the home screen peeks up from the bottom edge; its top is what matters
                    <div className="pointer-events-none absolute -bottom-56 left-1/2 -translate-x-1/2">
                      <PhoneMockup src={f.src ?? ""} alt={f.title} width="11rem" />
                    </div>
                  )}
                </Reveal>
              ))}
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
                  games and for friends who want to follow along.
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
              {/* Live spectating — wide, phone beside the copy */}
              <Reveal className="tile grid items-center gap-8 sm:grid-cols-[0.8fr_1.2fr] md:col-span-2 md:!p-8">
                <div>
                  <h3 className="tile__title">Watch from anywhere</h3>
                  <p className="tile__body">
                    Share a four-letter room code. Friends follow every call and every point live, on their own
                    phone, from the next room or the next city.
                  </p>
                </div>
                <div className="flex justify-center">
                  <PhoneMockup
                    src="/screenshots/spectator.webp"
                    alt="Live spectator view of a game in progress"
                    landscape
                    tilt="left"
                    width="min(100%, 24rem)"
                  />
                </div>
              </Reveal>

              {/* Live Activity — a crop of the real Lock Screen capture */}
              <Reveal delay={0.05} className="tile flex flex-col !p-6">
                <h3 className="tile__title">On the Lock Screen</h3>
                <p className="tile__body">Spectators get a Live Activity: the leader, the scores and the next round.</p>
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
