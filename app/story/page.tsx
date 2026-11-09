import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The story — Elevator Scoreboard",
  description:
    "How Elevator Scoreboard went from a page on my portfolio site in 2024 to an iPhone app.",
};

// The old web version, still online.
const OLD_WEB_VERSION = "https://portfolio-nine-ecru-67.vercel.app/elevator";

type Shot = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

// Every image is pre-cropped to its figure's ratio (see .story-figure__shots--*
// in globals.css): "tall" 4:5, "wide" 16:9, "photos" 4:3.
type Layout = "tall" | "wide" | "photos";

// Photos from real games. No faces until the people in them have said yes.
// To add one later: crop it to 4:3, save it to public/story/ as WebP, add a line.
const tablePhotos: Shot[] = [
  {
    src: "/story/table-candle.webp",
    alt: "Sicilian playing cards, a candle and an ashtray on a small table at night",
    width: 1440,
    height: 1080,
  },
  {
    src: "/story/table-camping.webp",
    alt: "A white camping table on a festival field with Italian playing cards, a phone, cans of beer and a mug",
    width: 1440,
    height: 1080,
  },
  // { src: "/story/table-friends.webp", alt: "…", width: 1440, height: 1080 }, // photo 44, needs consent
  // { src: "/story/table-player.webp", alt: "…", width: 1440, height: 1080 }, // photo 47, needs consent
];

// Same people as the credits screen in the app (Settings > Credits).
const INTRODUCED_BY = "Alessandro and Giacomo";
const PLAYED_ALONE = "Francesco and Yves";
const PLAYERS = [
  "Adriaan",
  "Alvin",
  "Charlie",
  "Delilah",
  "Edwin",
  "Ella",
  "Enzo",
  "Ethan",
  "Hayley",
  "John",
  "Karen",
  "Maarten",
  "Marco",
  "Mila",
  "Nathan",
  "Obrad",
  "Robin",
  "Ross",
  "Ruby",
  "Sarah",
  "Tiago",
  "Tyrone",
  "Yugi",
  "Zuzana",
];

function Figure({
  shots,
  caption,
  layout,
}: {
  shots: Shot[];
  caption: React.ReactNode;
  layout: Layout;
}) {
  const sizes =
    layout === "wide"
      ? "(min-width: 768px) 640px, 100vw"
      : "(min-width: 768px) 320px, 50vw";
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
            sizes={sizes}
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
          I&rsquo;m Luca, and I make Elevator Scoreboard on my own. My friends
          and I were tired of adding up scores on paper, so I put a page on my
          portfolio site to do it for us. This is how that page ended up on the
          App Store.
        </p>

        <ol className="story-timeline">
          <Milestone date="9 August 2024" title="The first game">
            <p>
              The first version was one page that ran in the browser. No
              accounts, no server. You typed in the names, tapped plus or minus
              for each call and locked the round. We played our first game with
              it on 9 August 2024.
            </p>
            <Figure
              layout="tall"
              shots={[
                {
                  src: "/story/web-2024-desktop.webp",
                  alt: "The first web version: round 1 with Alice, Bob, Charlie and Diana, and an empty score table",
                  width: 960,
                  height: 1200,
                },
                {
                  src: "/story/web-2024-phone.webp",
                  alt: "An early phone layout: round 3, with red Lock All and Reset Game buttons and a yellow Start Decrease Early button",
                  width: 960,
                  height: 1200,
                },
              ]}
              caption="The first version on a laptop, and an early layout on my phone."
            />
            <p>
              It&rsquo;s still online if you want to see it:{" "}
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
              Friends kept using it, so I kept fixing it. A cell went red when
              you missed your call and green when you made it, darker the more
              tricks you called. This is a real game with Yves and Mila, all
              twenty rounds of it.
            </p>
            <Figure
              layout="tall"
              shots={[
                {
                  src: "/story/table-rounds-1-13.webp",
                  alt: "Score table for Luca, Yves and Mila, rounds 1 to 9, with red and green cells",
                  width: 960,
                  height: 1200,
                },
                {
                  src: "/story/dev-desk.webp",
                  alt: "A monitor with code in an editor on the left and the web app on the right, showing Round 20, Game Over",
                  width: 960,
                  height: 1200,
                },
              ]}
              caption="The start of that game, and the web version next to its code on my desk."
            />
            <Figure
              layout="wide"
              shots={[
                {
                  src: "/story/table-rounds-13-20.webp",
                  alt: "The same game, rounds 13 to 20: final totals Luca 280, Yves 340, Mila 390",
                  width: 1600,
                  height: 900,
                },
              ]}
              caption="The way back down. Mila won with 390, Yves had 340 and I came last with 280."
            />
            <p>
              Then friends of friends started using it, some of them in other
              countries. I didn&rsquo;t see that coming.
            </p>
            <Figure
              layout="photos"
              shots={tablePhotos}
              caption="Two of the tables it got played at."
            />
          </Milestone>

          <Milestone date="26 September 2025" title="Starting the iPhone app">
            <p>
              On 26 September 2025 I started building it again as a proper
              iPhone app. I&rsquo;ve been working on it ever since.
            </p>
          </Milestone>

          <Milestone date="Now" title="On the App Store">
            <p>
              I finally paid for an Apple developer account and put it out.
              Scoring, match history and stats are free. Pro is an optional
              one-time purchase.
            </p>
          </Milestone>
        </ol>

        <section className="mt-16">
          <h2 className="display text-2xl sm:text-3xl">
            Why there&rsquo;s a Pro
          </h2>
          <div className="mt-4 space-y-4 leading-7 text-[var(--text-2)]">
            <p>
              The app mostly runs on your phone. I added Pro anyway, because
              it&rsquo;s taken up a big part of my time.
            </p>
            <p>
              Pro gets you 5 and 6 player games, the live game on
              everyone&rsquo;s phone with a room code, and the scores on your
              Lock Screen while you play. You pay once. There&rsquo;s no
              subscription.
            </p>
            <p>
              I don&rsquo;t expect it to make much money, and I&rsquo;m fine
              with that. It&rsquo;s a passion project, and a way to show how
              much I like programming. Seeing people enjoy the game is the best
              part. If you buy Pro, thank you. It helps me keep working on it.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="display text-2xl sm:text-3xl">Thank you</h2>
          <div className="mt-4 space-y-4 leading-7 text-[var(--text-2)]">
            <p>
              <span className="text-[var(--text)]">{INTRODUCED_BY}</span>, for
              showing me Ascensore (Elevator) in the first place.
            </p>
            <p>
              <span className="text-[var(--text)]">{PLAYED_ALONE}</span>, for
              using the scoreboard on your own, even when I wasn&rsquo;t there.
            </p>
            <p>And everyone else who sat at the table with it:</p>
          </div>
          <ul className="story-names" aria-label="Players">
            {PLAYERS.map((name) => (
              <li key={name} className="story-name">
                {name}
              </li>
            ))}
          </ul>
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
