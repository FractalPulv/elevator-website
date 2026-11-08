import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The story — Elevator Scoreboard",
  description:
    "How Elevator Scoreboard went from a page on my portfolio site in 2024 to an iPhone app, told by the one person who makes it.",
};

// The old web version, still online.
const OLD_WEB_VERSION = "https://portfolio-nine-ecru-67.vercel.app/elevator";

type Shot = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

// Photos from real games. No faces until the people in them have said yes.
// To add one later: copy it to public/story/ as WebP and add a line here.
const tablePhotos: Shot[] = [
  {
    src: "/story/table-candle.webp",
    alt: "Sicilian playing cards and a candle on a small table at night",
    width: 720,
    height: 610,
  },
  {
    src: "/story/table-camping.webp",
    alt: "Italian playing cards and a phone on a white camping table",
    width: 1330,
    height: 680,
  },
  // { src: "/story/table-friends.webp", alt: "…", width: 1600, height: 1200 }, // photo 44, needs consent
  // { src: "/story/table-player.webp", alt: "…", width: 1600, height: 1200 }, // photo 47, needs consent
];

function Figure({
  shots,
  caption,
  layout = "single",
}: {
  shots: Shot[];
  caption: React.ReactNode;
  layout?: "single" | "pair" | "phone";
}) {
  return (
    <figure className="story-figure">
      <div className={`story-figure__shots story-figure__shots--${layout}`}>
        {shots.map((s) => (
          <Image
            key={s.src}
            src={s.src}
            alt={s.alt}
            width={s.width}
            height={s.height}
            sizes="(min-width: 768px) 640px, 100vw"
            className="story-shot"
          />
        ))}
      </div>
      <figcaption className="story-figure__caption">{caption}</figcaption>
    </figure>
  );
}

function Milestone({
  date,
  title,
  children,
}: {
  date: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="story-step">
      <p className="story-step__date">{date}</p>
      <h2 className="display mt-2 text-2xl sm:text-3xl">{title}</h2>
      <div className="story-step__body">{children}</div>
    </li>
  );
}

export default function Story() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="border-b border-[var(--line-soft)] px-5 py-5 sm:px-8">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
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

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-14 sm:px-8 lg:py-20">
        <p className="eyebrow">The story</p>
        <h1 className="display mt-4 text-4xl sm:text-5xl">
          It started as a web page
        </h1>
        <p className="lede mt-6 max-w-xl">
          I&rsquo;m Luca, and I make Elevator Scoreboard on my own. It began as
          a page on my portfolio site so my friends and I could stop adding up
          scores on paper. This is how it got from there to the App Store.
        </p>

        <ol className="story-timeline">
          <Milestone date="9 August 2024" title="The first game">
            <p>
              The first version was a single page on my portfolio site. It ran
              entirely in the browser: no accounts, no server. You typed the
              names, pressed plus and minus for each call, and locked the round
              in. We played our first game with it on 9 August 2024.
            </p>
            <Figure
              layout="phone"
              shots={[
                {
                  src: "/story/web-2024-desktop.webp",
                  alt: "The first web version: round 1 with Alice, Bob, Charlie and Diana, and an empty score table",
                  width: 960,
                  height: 1140,
                },
                {
                  src: "/story/web-2024-phone.webp",
                  alt: "An early layout on a phone at lucapulv.com: round 3, with red Lock All and Reset Game buttons",
                  width: 924,
                  height: 1600,
                },
              ]}
              caption="The first version on a laptop, and an early layout on a phone."
            />
            <p>
              That page is still online if you want to see where it started:{" "}
              <a
                href={OLD_WEB_VERSION}
                className="accent-text underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                the old web version
              </a>
              .
            </p>
          </Milestone>

          <Milestone
            date="The months after"
            title="The version we actually played"
          >
            <p>
              Friends kept using it, so I kept fixing it. Each cell got a
              colour: red for a missed call, green for a made one, darker the
              more tricks you called. Below is a real game between Yves, Mila
              and me, all twenty rounds of it. I came last.
            </p>
            <Figure
              layout="phone"
              shots={[
                {
                  src: "/story/table-rounds-1-13.webp",
                  alt: "Score table for Luca, Yves and Mila, rounds 1 to 13: Luca 180, Yves 240, Mila 290",
                  width: 786,
                  height: 1600,
                },
                {
                  src: "/story/dev-desk.webp",
                  alt: "A monitor with code in an editor on the left and the web app on the right, showing Round 20, Game Over",
                  width: 755,
                  height: 1100,
                },
              ]}
              caption="Halfway through that game, and the web version next to its code on my desk."
            />
            <Figure
              shots={[
                {
                  src: "/story/table-rounds-13-20.webp",
                  alt: "The same game, rounds 13 to 20: final totals Luca 280, Yves 340, Mila 390",
                  width: 1600,
                  height: 900,
                },
              ]}
              caption="The way back down. Mila won with 390."
            />
            <p>
              It went further than I expected. Friends of friends, some of them
              in other countries, were using it to keep score.
            </p>
            <Figure
              layout="pair"
              shots={tablePhotos}
              caption={"Two of the tables it was played at."}
            />
          </Milestone>

          <Milestone date="26 September 2025" title="Starting the iPhone app">
            <p>
              On 26 September 2025 I started building Elevator Scoreboard as a
              proper iPhone app. I&rsquo;ve been working on it for a long time
              since.
            </p>
          </Milestone>

          <Milestone date="Now" title="On the App Store">
            <p>
              I finally bought an Apple developer licence and released it.
              Scoring, match history and stats are free for everyone. Pro is an
              optional one-time purchase.
            </p>
          </Milestone>
        </ol>

        <section className="mt-16">
          <h2 className="display text-2xl sm:text-3xl">
            Why there&rsquo;s a Pro
          </h2>
          <div className="mt-4 space-y-4 leading-7 text-[var(--text-2)]">
            <p>
              Elevator Scoreboard mostly runs on your phone. I added Pro anyway,
              because this app has taken a large part of my time.
            </p>
            <p>
              Pro unlocks 5 and 6 player games, the live game on every
              player&rsquo;s phone with a room code, and the scores on the Lock
              Screen while you play. It&rsquo;s a one-time purchase, no
              subscription.
            </p>
            <p>
              I don&rsquo;t expect it to make much money, and that&rsquo;s fine.
              It&rsquo;s a passion project. It let me show people how much I
              like programming, and it made the game easier to play. Seeing
              other people enjoy Elevator has been the best part. If you buy
              Pro, thank you. It helps me keep working on it.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="display text-2xl sm:text-3xl">Thank you</h2>
          <p className="mt-4 leading-7 text-[var(--text-2)]">
            To everyone who played the early versions, found the bugs and sat
            through one more test game.
          </p>
        </section>

        <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link href="/#download" className="btn btn--primary">
            Get the app
          </Link>
          <Link href="/rules" className="nav-link">
            How to play
          </Link>
        </div>
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
