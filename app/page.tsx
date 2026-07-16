import Image from "next/image";
import Link from "next/link";
import { DeckProvider } from "@/app/components/DeckContext";
import { DeckShowcase } from "@/app/components/DeckShowcase";
import { ElevatorDiagram } from "@/app/components/ElevatorDiagram";
import { HeroVisual } from "@/app/components/HeroVisual";
import { PhoneMockup, ScoreScreen } from "@/app/components/PhoneMockup";
import { PlayerAvatars } from "@/app/components/PlayerAvatars";
import { RoundDemo } from "@/app/components/RoundDemo";
import { Reveal } from "@/app/components/Reveal";
import { StoreButtons } from "@/app/components/StoreButtons";
import { ItalianCoin } from "@/app/components/SuitIcons";

const navItems = [
  { href: "#about", label: "Overview" },
  { href: "#elevator", label: "The Elevator" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pro", label: "Pro" },
];

const features = [
  "iOS and Android",
  "Light and dark scoreboards",
  "English and Italian in-app",
  "Portrait and landscape",
  "3 to 4 players free",
  "Fast setup for repeat games",
];

export default function Home() {
  return (
    <DeckProvider>
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Floating nav */}
      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <div className="mx-auto w-full max-w-5xl">
          <div className="navbar">
            <a href="#hero" className="flex items-center gap-2.5">
              <Image src="/icon-light.png" alt="" width={28} height={28} className="rounded-[8px]" />
              <span className="wordmark text-[1.05rem]">Elevator Scoreboard</span>
            </a>
            <nav className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </a>
              ))}
            </nav>
            <a href="#download" className="btn btn--primary !px-4 !py-2 !text-sm">
              Get the app
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        {/* Hero */}
        <section id="hero" className="scroll-mt-28 px-5 pb-24 pt-16 sm:px-8 lg:pt-24">
          <div className="mx-auto grid w-full max-w-5xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <h1 className="display text-6xl sm:text-7xl lg:text-8xl">
                Predict.
                <br />
                Play.
                <br />
                <span className="accent-text">Score.</span>
              </h1>
              <p className="mt-7 max-w-md text-lg leading-7 text-[var(--text-2)]">
                A mobile scoreboard for the Italian trick-taking game where only an exact call scores.
                You bring the cards and the friends — the app keeps score, teaches the rules, and tracks
                your stats.
              </p>

              <div className="mt-8">
                <StoreButtons />
              </div>
            </Reveal>

            <Reveal delay={0.1} className="flex justify-center lg:justify-end">
              <HeroVisual />
            </Reveal>
          </div>
        </section>

        {/* Overview */}
        <section id="about" className="scroll-mt-28 px-5 py-20 sm:px-8">
          <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-2">
            <Reveal>
              <p className="eyebrow">Overview</p>
              <h2 className="display mt-5 text-4xl sm:text-5xl">Only an exact call scores</h2>
              <p className="mt-6 max-w-md text-lg leading-7 text-[var(--text-2)]">
                Every round each player gets a hand and predicts the exact number of tricks they will win.
                Match it perfectly and you score — miss, and you get nothing.
              </p>
              <p className="mt-4 max-w-md text-lg leading-7 text-[var(--text-2)]">
                The last predictor can&rsquo;t make the table&rsquo;s calls total the cards in play, which
                guarantees at least one miss.
              </p>
            </Reveal>

            <Reveal as="div" delay={0.05}>
              <DeckShowcase />
            </Reveal>
          </div>
        </section>

        {/* The Elevator — static */}
        <section id="elevator" className="scroll-mt-28 px-5 py-20 sm:px-8">
          <div className="mx-auto w-full max-w-5xl">
            <Reveal className="max-w-xl">
              <p className="eyebrow">The Elevator</p>
              <h2 className="display mt-5 text-4xl sm:text-5xl">The game is in the name</h2>
              <p className="mt-6 text-lg leading-7 text-[var(--text-2)]">
                Each round deals one more card per player than the last — climbing from one up to ten, then
                riding all the way back down to one.
              </p>
              <div className="mt-7 flex items-center gap-4">
                <PlayerAvatars count={5} />
                <span className="text-sm text-[var(--text-3)]">Built for 3 to 6 players</span>
              </div>
            </Reveal>

            <Reveal as="div" delay={0.1} className="card mt-10">
              <ElevatorDiagram />
            </Reveal>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-28 px-5 py-20 sm:px-8">
          <div className="mx-auto w-full max-w-5xl">
            <Reveal>
              <p className="eyebrow">How a round works</p>
            </Reveal>
            <div className="mt-8">
              <RoundDemo />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-28 px-5 py-20 sm:px-8">
          <div className="mx-auto w-full max-w-5xl">
            <Reveal>
              <p className="eyebrow">Features</p>
              <h2 className="display mt-5 max-w-2xl text-4xl sm:text-5xl">
                Everything in one scoreboard
              </h2>
            </Reveal>

            <Reveal delay={0.1} className="mt-14 flex items-end justify-center gap-2 sm:gap-6">
              <div className="hidden translate-y-8 sm:block">
                <PhoneMockup width="11rem" className="opacity-70" alt="Light scoreboard">
                  <ScoreScreen mode="light" />
                </PhoneMockup>
              </div>
              <PhoneMockup glow width="14rem" alt="Dark scoreboard">
                <ScoreScreen mode="dark" />
              </PhoneMockup>
              <div className="hidden translate-y-8 sm:block">
                <PhoneMockup width="11rem" className="opacity-70" alt="Italian scoreboard">
                  <ScoreScreen mode="dark" />
                </PhoneMockup>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="mx-auto mt-16 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2.5 rounded-xl bg-[var(--surface)] px-4 py-3.5 text-[0.97rem]"
                >
                  <span className="accent-text">
                    <ItalianCoin size={15} />
                  </span>
                  {feature}
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Pro */}
        <section id="pro" className="scroll-mt-28 px-5 py-20 sm:px-8">
          <div className="mx-auto grid w-full max-w-5xl items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
            <Reveal>
              <p className="eyebrow accent-text">Elevator Scoreboard Pro</p>
              <h2 className="display mt-5 text-4xl sm:text-5xl">Bigger tables, live spectating</h2>
              <p className="mt-6 max-w-md text-lg leading-7 text-[var(--text-2)]">
                The scoreboard is free for 3 to 4 players. Pro adds 5 to 6 player tables and a live spectator
                view — share a short room code and everyone can follow the scores on their own screens.
              </p>
              <ul className="mt-7 grid max-w-md gap-2.5">
                {[
                  "5 to 6 player tables",
                  "Live spectator screen",
                  "Shareable room code",
                  "One-tap support for the project",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[var(--text-2)]">
                    <span className="accent-text">
                      <ItalianCoin size={15} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1} className="flex justify-center lg:justify-end">
              <PhoneMockup glow alt="Live spectator view">
                <div className="screen-ph screen-ph--dark">
                  <div className="screen-ph__bar">
                    <span>Spectator</span>
                    <span className="accent-text">Code FELT</span>
                  </div>
                  <div className="mt-1 flex flex-col gap-1.5">
                    {[
                      { name: "Luca", score: "18", lead: true },
                      { name: "Marta", score: "13" },
                      { name: "Dario", score: "16" },
                      { name: "Nina", score: "14" },
                      { name: "Gio", score: "11" },
                    ].map((p) => (
                      <div key={p.name} className="screen-ph__row" data-lead={p.lead ? "true" : undefined}>
                        <span className="screen-ph__name">{p.name}</span>
                        <span className="opacity-60 text-[0.62rem]">Round 14</span>
                        <span className="screen-ph__score">{p.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </PhoneMockup>
            </Reveal>
          </div>
        </section>

        {/* Download CTA */}
        <section id="download" className="scroll-mt-28 px-5 py-24 sm:px-8">
          <Reveal className="mx-auto w-full max-w-2xl text-center">
            <Image
              src="/icon-light.png"
              alt="Elevator Scoreboard app icon"
              width={72}
              height={72}
              className="mx-auto rounded-[22%] shadow-[0_20px_60px_var(--accent-glow)]"
            />
            <h2 className="display mt-7 text-5xl sm:text-6xl">Get Elevator Scoreboard</h2>
            <p className="mx-auto mt-5 max-w-md text-lg leading-7 text-[var(--text-2)]">
              On iOS and Android. 3 to 4 players free, with Pro for bigger tables and live spectators.
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
            <Image src="/icon-light.png" alt="" width={20} height={20} className="rounded-[6px]" />
            <span className="wordmark">Elevator Scoreboard</span>
          </span>
          <p>© {new Date().getFullYear()} Elevator Scoreboard. The Italian card game, tracked.</p>
          <Link href="/privacy" className="nav-link">
            Privacy policy
          </Link>
        </div>
      </footer>
    </div>
    </DeckProvider>
  );
}
